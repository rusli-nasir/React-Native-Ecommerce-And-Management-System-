import React from 'react';
import Modal from 'react-native-modal';
import {Button, Text, View, StyleSheet} from 'react-native';

export default function Modal1({toggleModal1, isModalVisible1}) {
  return (
    <View>
      <Modal isVisible={isModalVisible1} onBackdropPress={toggleModal1}>
        <View style={styles.container}>
          <Text>Modal 1</Text>

          <Button title="Hide modal" onPress={toggleModal1} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
