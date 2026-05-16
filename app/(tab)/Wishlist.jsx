//===================================
//     Wishlist
//===================================
import React, { useContext } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, 
  TouchableOpacity, Image, Dimensions 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { WishlistContext } from '../../context/WishlistContext';
import { CartContext } from '../../context/CartContext';
import ProductDetail from '../ProductDetail';

const { width } = Dimensions.get('window');

export default function Wishlist() {
  const router = useRouter();
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (item) => {
    addToCart(item);
    router.push('/Cart');
  };

  // --- RENDER TABLE ROW ---
  const renderTableRow = (item) => {
    const itemId = item._id || item.id; 

    // Product Detail Page par jane ke liye function
    const Product = () => {
      router.push({
        pathname: "/ProductDetail",
        params: { item: JSON.stringify(item) },
      });
    };
    return (
      <View key={itemId} style={styles.tableRow}>
        
        <TouchableOpacity style={styles.cellProduct} onPress={Product} activeOpacity={0.7}>
          <Image source={{ uri: item.image || item.thumbnail }} style={styles.productImg} resizeMode="contain" />
          <View>
            <Text style={styles.productName}>{item.title || "Unnamed Product"}</Text>
            <Text style={styles.productUnit}>{item.unit || "1 Pc"}</Text>
          </View>
        </TouchableOpacity>

        {/* Amount */}
        <View style={styles.cellAmount}>
          <Text style={styles.priceText}>₹{(item.salePrice || item.price || 0).toFixed(2)}</Text>
        </View>


        {/* Actions */}
        <View style={styles.cellAction}>
    
            <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
              <Text style={styles.addBtnText}>Add to cart</Text>
            </TouchableOpacity>
          
        </View>

        {/* Remove Button */}
        <View style={styles.cellRemove}>
          <TouchableOpacity onPress={() => removeFromWishlist(item)} style={styles.removeIconBtn}>
            <Feather name="trash-2" size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header Breadcrumb */}
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbLink} onPress={() => router.push('/Index')}>Home</Text>
          <Text style={styles.breadcrumbSlash}> / </Text>
          <Text style={styles.breadcrumbCurrent}>Shop Wishlist</Text>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>My Wishlist</Text>
          <Text style={styles.subtitle}>There are {wishlist.length} products in this wishlist.</Text>
        </View>

        {/* Table View */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.cellProduct]}>Product</Text>
            <Text style={[styles.headerText, styles.cellAmount]}>Amount</Text>
            <Text style={[styles.headerText, styles.cellAction]}>Actions</Text>
            <Text style={[styles.headerText, styles.cellRemove]}>Remove</Text>
          </View>

          {wishlist.length > 0 ? (
            wishlist.map(renderTableRow)
          ) : (
            <View style={styles.emptyState}>
              <Feather name="heart" size={40} color="#cbd5e1" />
              <Text style={styles.emptyText}>Your wishlist is empty</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Styles ekdum same hain purane UI jaise
const styles = StyleSheet.create({
  safeArea: { flex: 1, marginTop: 45, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: width > 768 ? 40 : 15 },
  breadcrumb: { flexDirection: 'row', marginTop: 20, marginBottom: 15 },
  breadcrumbLink: { color: '#0aad0a', fontSize: 14, fontWeight: '500' },
  breadcrumbSlash: { color: '#94a3b8', fontSize: 14 },
  breadcrumbCurrent: { color: '#64748b', fontSize: 14 },
  titleSection: { marginBottom: 30 },
  pageTitle: { fontSize: 32, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#64748b' },
  tableContainer: { borderWidth: 1, borderColor: '#f1f5f9', borderRadius: 8, overflow: 'hidden', marginBottom: 50 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f8fafc', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  headerText: { fontSize: 14, fontWeight: '600', color: '#475569' },
  tableRow: { flexDirection: 'row', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', alignItems: 'center' },
  cellProduct: { flex: 2, flexDirection: 'row', alignItems: 'center' },
  cellAmount: { flex: 1 },
  cellAction: { flex: 1 },
  cellRemove: { width: 80, alignItems: 'center', justifyContent: 'center' },
  productImg: { width: 45, height: 45, marginRight: 15 },
  productName: { fontSize: 15, fontWeight: '600', color: '#0f172a', marginBottom: 4 },
  productUnit: { fontSize: 13, color: '#64748b' },
  priceText: { fontSize: 15, paddingTop: 25, fontWeight: '600', color: '#475569' },
  addBtn: { backgroundColor: '#0aad0a', width: '100',paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6, alignSelf: 'flex-start' },
  addBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  contactBtn: { backgroundColor: '#0f172a', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6, alignSelf: 'flex-start' },
  contactBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  removeIconBtn: { padding: 5 },
  emptyState: { padding: 50, alignItems: 'center', justifyContent: 'center' },
  emptyText: { marginTop: 15, fontSize: 16, color: '#64748b' }
});