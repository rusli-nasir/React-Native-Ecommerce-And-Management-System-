import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import SubmitModal from './Modals/SubmitModal';
import ItemModal from './Modals/ItemModal';

const height = Dimensions.get('window').height;

export default function Products(props) {
  const {cartItems, cartTotal, setCartItems, setCartTotal} = props;
  const [isModalVisible, setModalVisible] = useState(false);
  const [item, setItem] = useState({});

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [isItemModalVisible, setItemModalVisible] = useState(false);

  const toggleItemModal = (item) => {
    setItem(item);

    setItemModalVisible(!isItemModalVisible);
  };

  const increaseQty = (prod) => {
    const object = {...prod};
    const updatedCart = [...cartItems];
    const updatedItemIndex = updatedCart.findIndex(
      (item) => item.productId === prod.productId,
    );

    const updatedItem = {
      ...updatedCart[updatedItemIndex],
    };
    updatedItem.quantity++;
    object.quantity++;
    setCartTotal((item) => item + 1);
    if (updatedItem.quantity <= 0) {
      updatedCart.splice(updatedItemIndex, 1);
    } else {
      updatedCart[updatedItemIndex] = updatedItem;
    }
    setItem(object);
    setCartItems(updatedCart);
  };

  const removeProductFromCart = (prod) => {
    const object = {...prod};
    const updatedCart = [...cartItems];
    const updatedItemIndex = updatedCart.findIndex(
      (item) => item.productId === prod.productId,
    );

    const updatedItem = {
      ...updatedCart[updatedItemIndex],
    };
    updatedItem.quantity--;
    object.quantity--;
    setCartTotal((item) => item - 1);
    if (updatedItem.quantity <= 0) {
      updatedCart.splice(updatedItemIndex, 1);
    } else {
      updatedCart[updatedItemIndex] = updatedItem;
    }
    setItem(object);
    setCartItems(updatedCart);
  };

  const deleteItem = (prod) => {
    const object = {...prod};
    const updatedCart = [...cartItems];
    const updatedItemIndex = updatedCart.findIndex(
      (item) => item.productId === prod.productId,
    );

    const updatedItem = {
      ...updatedCart[updatedItemIndex],
    };

    cartTotal - object.quantity;
    object.quantity = 0;
    if (updatedItem.quantity > -1) {
      updatedCart.splice(updatedItemIndex, 1);
      setCartItems(updatedCart);
      setCartTotal((item) => item);
      setItem(object);
    }
  };

  return (
    <React.Fragment>
      <SubmitModal isModalVisible={isModalVisible} toggleModal={toggleModal} />
      <ItemModal
        item={item}
        toggleItemModal={toggleItemModal}
        isItemModalVisible={isItemModalVisible}
        increaseQty={increaseQty}
        removeProductFromCart={removeProductFromCart}
        deleteItem={deleteItem}
      />
      <View
        style={{
          height: height,
          backgroundColor: '#2791e8',
        }}>
        <View
          style={{
            height: (8 / 100) * height,
            margin: 5,
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.text}>order Summary</Text>
          <Text style={styles.text}>cart({cartTotal})</Text>
        </View>
        <View
          style={{
            height: (18 / 100) * height,
            backgroundColor: 'white',
            margin: 5,
          }}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', textTransform: 'capitalize'}}>
              order total
            </Text>
          </View>
        </View>
        <View
          style={{
            height: (50 / 100) * height,
            margin: 5,
            backgroundColor: 'white',
          }}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1.5}}>
                <Text style={styles.header}>Item name</Text>
              </View>
              <View style={{flex: 1.5}}>
                <Text style={styles.header}>Quantity</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.header}>Charge</Text>
              </View>
            </View>
            <ScrollView>
              {cartItems.map((item) => {
                return (
                  <TouchableOpacity
                    onPress={() => toggleItemModal(item)}
                    key={item.productId}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1.5}}>
                        <Text>{item.description}</Text>
                      </View>
                      <View style={{flex: 1.5}}>
                        <Text>{item.quantity}</Text>
                      </View>
                      <View style={{flex: 1}}>
                        <Text>Charge</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
        <TouchableOpacity onPress={toggleModal}>
          <View style={styles.submitBtn}>
            <Text style={styles.submitText}>Submit</Text>
          </View>
        </TouchableOpacity>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  header: {
    letterSpacing: 1,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    backgroundColor: '#83b9e6',
  },
  text: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  button: {
    marginTop: '95%',
    width: '100%',
    position: 'absolute',
  },
  submitBtn: {
    height: (8 / 100) * height,
    margin: 5,
    alignContent: 'center',
    backgroundColor: '#335bb0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
