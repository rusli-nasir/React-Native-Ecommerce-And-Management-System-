import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function ClientLIstHeader() {
  return (
    <React.Fragment>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#83b9e6',
          height: 40,
          padding: 10,
        }}>
        <View style={{flex: 1}}>
          <Text style={styles.text}>Name</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.text}>Contact</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.text}>Address</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.text}>Customer Type</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.text}>Due Amount</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.text}>Wallet Balance</Text>
        </View>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  text: {
    fontSize: 15,
  },
});
