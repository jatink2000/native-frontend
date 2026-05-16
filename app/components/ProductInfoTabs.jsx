import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../constants/api";

const TABS = ["Product Details", "Information", "Reviews", "Seller Info"];

function StarRow({ value, onChange, size = 18 }) {
  return (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity
          key={n}
          onPress={() => onChange?.(n)}
          disabled={!onChange}
          style={{ paddingRight: 6 }}
        >
          <AntDesign
            name={n <= value ? "star" : "staro"}
            size={size}
            color="#f39c12"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ProgressBar({ percent }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, percent))}%` }]} />
    </View>
  );
}

export default function ProductInfoTabs({ productId, initialProduct }) {
  const { width } = useWindowDimensions();
  const isWide = width >= 720;

  const [active, setActive] = useState(0);
  const [product, setProduct] = useState(initialProduct || null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/products/${productId}`);
      if (res.data?.status) setProduct(res.data.product);
    } catch (_e) {
      // keep initialProduct fallback
    }
  }, [productId]);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoadingReviews(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/products/${productId}/reviews`);
      if (res.data?.status) setReviews(res.data.reviews || []);
    } catch (e) {
      console.log("Reviews fetch error:", e?.message);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [fetchProduct, fetchReviews]);

  const ratingStats = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of reviews) counts[r.rating] = (counts[r.rating] || 0) + 1;
    const total = reviews.length || 0;
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    const avg = total ? sum / total : 0;
    return { counts, total, avg };
  }, [reviews]);

  const openReviewModal = () => {
    setReviewForm({ rating: 5, title: "", body: "" });
    setReviewModalOpen(true);
  };

  const submitReview = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userEmail = user?.email;
      const userName = user?.name || user?.email || "User";

      if (!userEmail) {
        Alert.alert("Login required", "Please login to write a review.");
        return;
      }
      if (!reviewForm.title.trim() || !reviewForm.body.trim()) {
        Alert.alert("Missing fields", "Please fill review title and message.");
        return;
      }

      setSubmitting(true);
      const res = await axios.post(`${API_BASE_URL}/products/${productId}/reviews`, {
        userEmail,
        userName,
        rating: reviewForm.rating,
        title: reviewForm.title,
        body: reviewForm.body,
      });
      if (res.data?.status) {
        setReviewModalOpen(false);
        await fetchReviews();
      } else {
        Alert.alert("Error", res.data?.message || "Could not submit review");
      }
    } catch (e) {
      Alert.alert("Error", e?.message || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const reactToReview = async (reviewId, type) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/reviews/${reviewId}/react`, { type });
      if (res.data?.status) {
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? { ...r, ...res.data.review } : r)),
        );
      }
    } catch (_e) {
      // ignore
    }
  };

  const renderDetailsTab = () => {
    const p = product || {};
    return (
      <View style={styles.section}>
        <Text style={styles.h2}>Nutrient Value & Benefits</Text>
        <Text style={styles.p}>{p.nutrientValueBenefits || "—"}</Text>

        <Text style={styles.h2}>Storage Tips</Text>
        <Text style={styles.p}>{p.storageTips || "—"}</Text>

        <View style={styles.kvRow}>
          <Text style={styles.k}>Unit</Text>
          <Text style={styles.v}>{p.unit || "—"}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.k}>Seller</Text>
          <Text style={styles.v}>{p.sellerName || "—"}</Text>
        </View>
      </View>
    );
  };

  const renderInfoTab = () => {
    const specs = (product?.specs && typeof product.specs === "object") ? product.specs : {};
    const entries = Object.entries(specs);
    if (!entries.length) {
      return (
        <View style={styles.section}>
          <Text style={styles.p}>No technical specifications available.</Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        {entries.map(([key, value], idx) => (
          <View
            key={key}
            style={[
              styles.specRow,
              idx % 2 === 0 ? styles.specRowAlt : null,
            ]}
          >
            <Text style={styles.specKey}>{key}</Text>
            <Text style={styles.specVal}>{String(value)}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderReviewsTab = () => {
    const { counts, total, avg } = ratingStats;
    const summaryLeft = (
      <View style={styles.reviewSummary}>
        <Text style={styles.avgNumber}>{avg ? avg.toFixed(1) : "0.0"}</Text>
        <StarRow value={Math.round(avg)} size={18} />
        <Text style={styles.muted}>{total} reviews</Text>

        <View style={{ marginTop: 14 }}>
          {[5, 4, 3, 2, 1].map((s) => {
            const pct = total ? (counts[s] / total) * 100 : 0;
            return (
              <View key={s} style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>{s}</Text>
                <AntDesign name="star" size={14} color="#f39c12" />
                <ProgressBar percent={pct} />
                <Text style={styles.breakdownCount}>{counts[s]}</Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={openReviewModal}>
          <Text style={styles.primaryBtnText}>Write a Review</Text>
        </TouchableOpacity>
      </View>
    );

    const listRight = (
      <View style={styles.reviewList}>
        {loadingReviews ? (
          <Text style={styles.muted}>Loading reviews...</Text>
        ) : reviews.length === 0 ? (
          <Text style={styles.muted}>No reviews yet. Be the first to review.</Text>
        ) : (
          reviews.map((r) => {
            const name = r.userName || "User";
            const initial = String(name).trim().slice(0, 1).toUpperCase() || "U";
            const date = r.createdAt ? new Date(r.createdAt) : new Date();
            const dateText = date.toLocaleDateString();
            return (
              <View key={r._id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initial}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewName}>{name}</Text>
                    <Text style={styles.reviewDate}>{dateText}</Text>
                  </View>
                </View>

                <View style={{ marginTop: 10 }}>
                  <StarRow value={Number(r.rating) || 0} size={16} />
                  {!!r.title && <Text style={styles.reviewTitle}>{r.title}</Text>}
                  {!!r.body && <Text style={styles.reviewBody}>{r.body}</Text>}
                </View>

                <View style={styles.reviewFooter}>
                  <TouchableOpacity
                    style={styles.reactionBtn}
                    onPress={() => reactToReview(r._id, "helpful")}
                  >
                    <Feather name="thumbs-up" size={16} color="#0aad0a" />
                    <Text style={styles.reactionText}>{r.helpfulCount || 0}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.reactionBtn}
                    onPress={() => reactToReview(r._id, "dislike")}
                  >
                    <Feather name="thumbs-down" size={16} color="#64748b" />
                    <Text style={styles.reactionText}>{r.dislikeCount || 0}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>
    );

    return (
      <View style={styles.section}>
        <View style={[styles.reviewGrid, isWide && { flexDirection: "row" }]}>
          {summaryLeft}
          {listRight}
        </View>

        <Modal visible={reviewModalOpen} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Write a Review</Text>
              <Text style={styles.label}>Rating</Text>
              <StarRow
                value={reviewForm.rating}
                onChange={(n) => setReviewForm((p) => ({ ...p, rating: n }))}
                size={22}
              />

              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Review title"
                value={reviewForm.title}
                onChangeText={(t) => setReviewForm((p) => ({ ...p, title: t }))}
              />

              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, { height: 110, textAlignVertical: "top" }]}
                placeholder="Write your review..."
                multiline
                value={reviewForm.body}
                onChangeText={(t) => setReviewForm((p) => ({ ...p, body: t }))}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => setReviewModalOpen(false)}
                  disabled={submitting}
                >
                  <Text style={styles.secondaryBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={submitReview}
                  disabled={submitting}
                >
                  <Text style={styles.primaryBtnText}>
                    {submitting ? "Submitting..." : "Submit"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderSellerTab = () => (
    <View style={styles.section}>
      <Text style={styles.p}>Seller info coming soon.</Text>
    </View>
  );

  const content = () => {
    switch (active) {
      case 0:
        return renderDetailsTab();
      case 1:
        return renderInfoTab();
      case 2:
        return renderReviewsTab();
      case 3:
        return renderSellerTab();
      default:
        return null;
    }
  };

  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {TABS.map((t, idx) => {
          const isActive = idx === active;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setActive(idx)}
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {content()}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 20 },
  tabBar: { flexGrow: 0 },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    marginRight: 10,
  },
  tabBtnActive: { backgroundColor: "#0aad0a" },
  tabText: { fontSize: 13, fontWeight: "700", color: "#334155" },
  tabTextActive: { color: "#fff" },

  section: { marginTop: 16 },
  h2: { fontSize: 16, fontWeight: "800", color: "#0f172a", marginTop: 12, marginBottom: 6 },
  p: { fontSize: 14, color: "#475569", lineHeight: 20 },
  kvRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  k: { color: "#64748b", fontWeight: "700" },
  v: { color: "#0f172a", fontWeight: "600" },

  specRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eef2f7",
    marginBottom: 10,
  },
  specRowAlt: { backgroundColor: "#f8fafc" },
  specKey: { flex: 1, color: "#334155", fontWeight: "700" },
  specVal: { flex: 1, color: "#0f172a", fontWeight: "600", textAlign: "right" },

  reviewGrid: { flexDirection: "column", gap: 14 },
  reviewSummary: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eef2f7",
    width: "100%",
    maxWidth: 360,
  },
  avgNumber: { fontSize: 34, fontWeight: "900", color: "#0f172a", marginBottom: 6 },
  muted: { marginTop: 6, color: "#64748b", fontWeight: "600" },
  breakdownRow: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 },
  breakdownLabel: { width: 16, color: "#334155", fontWeight: "800" },
  breakdownCount: { width: 24, textAlign: "right", color: "#334155", fontWeight: "700" },
  progressTrack: { flex: 1, height: 8, borderRadius: 999, backgroundColor: "#e2e8f0", overflow: "hidden" },
  progressFill: { height: 8, backgroundColor: "#0aad0a" },

  primaryBtn: { marginTop: 14, backgroundColor: "#0aad0a", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  primaryBtnText: { color: "#fff", fontWeight: "800" },
  secondaryBtn: { backgroundColor: "#f1f5f9", paddingVertical: 12, borderRadius: 10, alignItems: "center", flex: 1 },
  secondaryBtnText: { color: "#0f172a", fontWeight: "800" },

  reviewList: { flex: 1, minWidth: 0 },
  reviewCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eef2f7",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#eafaf1", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#0aad0a", fontWeight: "900", fontSize: 18 },
  reviewName: { color: "#0f172a", fontWeight: "800" },
  reviewDate: { color: "#64748b", fontWeight: "600", marginTop: 2, fontSize: 12 },
  reviewTitle: { marginTop: 8, fontWeight: "900", color: "#0f172a" },
  reviewBody: { marginTop: 6, color: "#475569", lineHeight: 20 },
  reviewFooter: { marginTop: 12, flexDirection: "row", justifyContent: "flex-end", gap: 14 },
  reactionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  reactionText: { fontWeight: "800", color: "#334155" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  modalTitle: { fontSize: 18, fontWeight: "900", color: "#0f172a", marginBottom: 12 },
  label: { marginTop: 10, marginBottom: 6, fontWeight: "800", color: "#334155" },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 12, backgroundColor: "#f8fafc" },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 14 },
});

