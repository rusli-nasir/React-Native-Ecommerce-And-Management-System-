import React from 'react';
import Modal from 'react-native-modal';
import {
  Button,
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';

export default function Modal2({toggleModal2, isModalVisible2}) {
  const [value, onChangeText] = React.useState('');
  return (
    <View>
      <Modal isVisible={isModalVisible2} onBackdropPress={toggleModal2}>
        <ScrollView>
          <View style={styles.container}>
            <View style={{alignItems: 'center', padding: 15}}>
              <Text>Add Notes</Text>
              <View style={{padding: 15}}>
                <TextInput
                  style={{
                    height: 280,
                    borderColor: 'gray',
                    borderWidth: 1,
                    width: 1100,
                  }}
                  onChangeText={(text) => onChangeText(text)}
                  value={value}
                />
              </View>
            </View>

            <View style={{padding: 35}}>
              <Button title="close" onPress={toggleModal2} />
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 0.8,
    // alignItems: 'center',
    // justifyContent: 'space-around',
  },
});
