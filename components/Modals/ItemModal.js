import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import {Button, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextInput, ScrollView} from 'react-native-gesture-handler';

export default function ItemModal({
  toggleItemModal,
  isItemModalVisible,
  item,
  increaseQty,
  removeProductFromCart,
  deleteItem,
}) {
  const [state, setState] = useState();
  const [disconut, setDiscount] = useState('0');
  useEffect(() => {
    setState(isItemModalVisible);
  });
  return (
    <React.Fragment>
      <Modal isVisible={state} onBackdropPress={toggleItemModal}>
        {item.quantity > 0 ? (
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.row1}>
                <Text style={styles.text}>{item.description}</Text>
                <Icon.Button
                  onPress={toggleItemModal}
                  name="close"
                  size={30}
                  color="red"
                  backgroundColor="transparent"
                  solid
                />
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.text}>Quantity</Text>
              </View>
              <View style={styles.qty}>
                <Icon.Button
                  backgroundColor="transparent"
                  name="remove-circle-outline"
                  size={40}
                  color="red"
                  solid
                  onPress={() => removeProductFromCart(item)}
                />
                <Text>{item.quantity}</Text>
                <Icon.Button
                  backgroundColor="transparent"
                  name="add-circle-outline"
                  size={40}
                  color="green"
                  solid
                  onPress={() => increaseQty(item)}
                />
              </View>
              <View style={styles.notes}>
                <TextInput placeholder="Add Notes" />
              </View>
              <View style={styles.discount}>
                <Text style={styles.text}>Discounts</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}>
                  <Text>Custom</Text>
                  <TextInput
                    placeholder="Custom Discount"
                    onChangeText={(text) => setDiscount(text)}
                    value={disconut}
                  />
                </View>
              </View>
              <View style={styles.deleteSave}>
                <TouchableOpacity onPress={() => deleteItem(item)}>
                  <Icon name="trash" size={40} color="red" />
                </TouchableOpacity>
                <Button title="Save" />
              </View>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.container}>
            <View
              style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
              <Text style={styles.text}>No Product Is Available</Text>
            </View>
          </View>
        )}
      </Modal>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 0.8,
    flexDirection: 'column',
  },
  row1: {
    flexDirection: 'row',
    backgroundColor: '#83b9e6',
    padding: 8,
    justifyContent: 'space-between',
  },

  text: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  qty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 25,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 0.5,
  },
  discount: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    padding: 10,
    height: 100,
  },
  deleteSave: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  notes: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    padding: 10,
  },
});
