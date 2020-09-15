import React, {useEffect, useState, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import CustomerRealm from '../database/customers/customer.operations';
import Client from '../components/Client';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import ClientLIstHeader from '../components/ClientLIstHeader';
import Icon from 'react-native-vector-icons/Ionicons';
// import UserModal from '../components/Modals/userModal';
// import UserInfo from '../components/Modals/userInfo';
const height = Dimensions.get('window').height;

export default function Clients({navigation}) {
  const [data, setData] = useState([]);
  const clients = CustomerRealm.getAllCustomer();

  // const [isModalVisible, setModalVisible] = useState(true);

  // const toggleModal = () => {
  //   setModalVisible(!isModalVisible);
  // };

  useEffect(() => {
    if (data.length === 0) {
      return setData(clients);
    }
  });

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <View style={{marginRight: 600}}>
  //         <Text>Tedxt</Text>
  //       </View>
  //     ),
  //   });
  // }, [navigation]);

  const setHeader = () => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{paddingRight: 10, flexDirection: 'row'}}>
          <Icon.Button
            backgroundColor="transparent"
            name="cart"
            size={30}
            color="black"
          />

          <Icon.Button
            backgroundColor="transparent"
            name="trash"
            size={30}
            color="black"
          />

          <Icon.Button
            backgroundColor="transparent"
            onPress={() => navigation.navigate('newUserModal')}
            name="information-circle"
            size={30}
            color="black"
          />
        </View>
      ),
    });
  };

  if (data.length === 0) {
    return <Text>Clients list loading</Text>;
  } else {
    return (
      <React.Fragment>
        {/* <UserModal isModalVisible={isModalVisible} toggleModal={toggleModal} /> */}
        {/* <UserInfo isModalVisible={isModalVisible} toggleModal={toggleModal} /> */}
        <ClientLIstHeader />
        <ScrollView>
          <View>
            {data.map((item) => {
              return (
                <TouchableOpacity
                  onLongPress={setHeader}
                  onPress={() =>
                    navigation.navigate('Products', {
                      client: item.name,
                      salesChannelId: item.salesChannelId,
                    })
                  }>
                  <View style={styles.item}>
                    <Client key={item.customerId} item={item} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate('userInfo')}>
          <View style={styles.actionButton}>
            <View style={{paddingLeft: 6}}>
              <Icon
                backgroundColor="transparent"
                name="add"
                size={30}
                color="white"
                solid
              />
            </View>
          </View>
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 8,
  },
  actionButton: {
    height: (8 / 100) * height,
    marginLeft: '90%',
    borderRadius: 50,
    // alignContent: 'center',
    backgroundColor: '#335bb0',
    justifyContent: 'center',
    alignItems: 'center',
    width: (8 / 100) * height,
  },
});
