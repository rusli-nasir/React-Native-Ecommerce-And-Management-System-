import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function Client({item}) {
  return (
    <React.Fragment>
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Text style={styles.text2}>{item.name}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.text2}>{item.phoneNumber}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.text2}>{item.address || ''}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.text2}>{item.customerType}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.text2}> {item.dueAmount}</Text>
        </View>

        <View style={{flex: 1}}>
          <Text style={styles.text2}> {item.walletBalance}</Text>
        </View>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  text2: {
    textTransform: 'capitalize',
    fontSize: 15,
    fontWeight: '100',
  },
});
