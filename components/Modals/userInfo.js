import React, {useState} from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function userInfo({navigation}) {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon.Button
            onPress={() => navigation.goBack()}
            name="close"
            size={30}
            color="red"
            backgroundColor="transparent"
            solid
          />
        </View>
        <View style={styles.forms}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.text}> Create new user</Text>
          </View>
          <View style={{padding: 25}}>
            <TextInput placeholder="Customer Name" style={styles.input} />
          </View>
          <View style={{padding: 25}}>
            <TextInput placeholder="Telephone #" style={styles.input} />
          </View>
          <View style={{padding: 25}}>
            <TextInput placeholder="Telephone #2" style={styles.input} />
          </View>
          <View style={{padding: 25}}>
            <TextInput
              placeholder="Select Customer Type"
              style={styles.input}
            />
          </View>
          <Button title="Create Customer" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 0.5,
  },
  forms: {
    justifyContent: 'space-around',
  },
  text: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 25,
  },
});
