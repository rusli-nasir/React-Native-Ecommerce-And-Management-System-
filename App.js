import React, {useContext} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Clients from './screens/ClientList';
import Products from './screens/ProductLIst';
import {TouchableOpacity, View, Text, Image, Button} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Transactions from './screens/Transactions';
import newUserModal from './components/Modals/newUser';
import userInfo from './components/Modals/userInfo';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();

function TransactionScreen({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerTitleStyle: {},
          headerLeft: () => (
            <View style={{paddingLeft: 8}}>
              <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Icon name="bars" size={30} color="#363636" />
              </TouchableOpacity>
            </View>
          ),
        }}
        name="Transactions"
        component={Transactions}
      />
    </Stack.Navigator>
  );
}

function HomeScreen({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Clients"
        options={{
          headerTitleStyle: {},
          headerLeft: () => (
            <View style={{paddingLeft: 8}}>
              <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Icon name="bars" size={30} color="#363636" />
              </TouchableOpacity>
            </View>
          ),
        }}
        component={Clients}
      />
      <Stack.Screen
        name="Products"
        options={({route}) => ({
          title: `${route.params.client}'s Order`,
          headerStyle: {
            backgroundColor: '#2791e8',
          },
          headerTintColor: '#fff',
        })}
        component={Products}
      />
    </Stack.Navigator>
  );
}

function MainScreen() {
  return (
    <HomeStack.Navigator mode="modal" headerMode="none">
      <HomeStack.Screen name="Main" component={HomeScreen} />
      <HomeStack.Screen name="newUserModal" component={newUserModal} />
      <HomeStack.Screen name="userInfo" component={userInfo} />
    </HomeStack.Navigator>
  );
}

function DrawerStack() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={MainScreen} />
        <Drawer.Screen name="Trsansactions" component={TransactionScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default function Root() {
  return <DrawerStack />;
}
