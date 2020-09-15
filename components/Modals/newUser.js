import React, {useState} from 'react';
import {Button, Text, View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function newUserModal({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 30}}> user info</Text>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
});
