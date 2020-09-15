import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import ProductsRealm from '../database/products/product.operations';
import ProductMRPRealm from '../database/productmrp/productmrp.operations';
import Product from '../components/Product';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import Cart from '../components/Cart';
const windowWidth = Dimensions.get('window').width;

export default function ProductList({route}) {
  const [data, setData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const prepareData = () => {
    const productMrp = ProductMRPRealm.getFilteredProductMRP();
    const ids = Object.keys(productMrp).map((key) => productMrp[key].productId);
    let finalProducts = ProductsRealm.getProducts().filter((prod) =>
      ids.includes(prod.productId),
    );
    return finalProducts;
  };

  useEffect(() => {
    if (data.length === 0) {
      setData(prepareData);
    }
  });

  const addToCart = (product) => {
    const updatedCart = [...cartItems];
    const updatedItemIndex = updatedCart.findIndex(
      (item) => item.productId === product.productId,
    );

    if (updatedItemIndex < 0) {
      updatedCart.push({...product, quantity: 1});
      setCartTotal((item) => item + 1);
    } else {
      const updatedItem = {
        ...updatedCart[updatedItemIndex],
      };
      updatedItem.quantity++;
      setCartTotal((item) => item + 1);
      updatedCart[updatedItemIndex] = updatedItem;
    }

    setCartItems(updatedCart);
  };

  if (data.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.col_1}>
          <ScrollView>
            <View style={styles.gridContainer}>
              {data.map((item) => {
                return (
                  <TouchableOpacity onPress={() => addToCart(item)}>
                    <Product
                      key={item.productId}
                      route={route}
                      item={item}
                      cartTotal={cartTotal}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <View style={styles.col_2}>
          <Cart
            cartItems={cartItems}
            cartTotal={cartTotal}
            setCartItems={setCartItems}
            setCartTotal={setCartTotal}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#2791e8',
  },
  col_1: {
    width: (65 / 100) * windowWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  col_2: {
    width: (34.5 / 100) * windowWidth,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  item: {
    backgroundColor: 'yellow',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
