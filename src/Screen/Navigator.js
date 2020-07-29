import React, {useContext} from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
// import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AppearanceProvider, useColorScheme} from 'react-native-appearance';

import {UserContext} from '~/Context/User';

import IconButton from '~/Component/IconButton';

import SignIn from './SignIn';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import TabFirst from './TabFirst';
import TabSecond from './TabSecond';
import News from './News';
import Setting from './Setting';
import Modal from './Modal';
import WebView from './WebView';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const MaterialTab = createMaterialBottomTabNavigator();
const MaterialTopTab = createMaterialTopTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
  },
};
const LoginStackNavi = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{stackPresentation: 'modal'}}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{stackPresentation: 'modal'}}
      />
    </Stack.Navigator>
  );
};

const TabFirstStackNavi = ({navigation}) => {
  const {logout} = useContext(UserContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ff66ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: (props) => (
          <IconButton iconName="power-settings-new" onPress={logout} />
        ),
      }}>
      <Stack.Screen
        name="TabFirst"
        component={TabFirst}
        options={{
          headerLeft: (props) => (
            <IconButton
              iconName="menu"
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Modal"
        component={Modal}
        options={{stackPresentation: 'modal'}}
      />
    </Stack.Navigator>
  );
};

const TabNavi = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="TabFirstStackNavi"
        component={TabFirstStackNavi}
        options={{
          tabBarLabel: 'Frist',
          tabBarIcon: ({color}) => <Icon name="home" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="TabSecond"
        component={TabSecond}
        options={{
          tabBarLabel: 'Second',
          tabBarIcon: ({color}) => (
            <Icon name="people" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="News"
        component={News}
        options={{
          tabBarLabel: 'News',
          tabBarIcon: ({color}) => (
            <Icon name="message" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({color}) => (
            <Icon name="settings" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MaterialTabNavi = () => {
  return (
    <MaterialTab.Navigator>
      <MaterialTab.Screen
        name="TabFirstStackNavi"
        component={TabFirstStackNavi}
        options={{
          tabBarColor: '#336723',
          tabBarLabel: 'Frist',
          tabBarIcon: ({color}) => <Icon name="home" color={color} size={26} />,
        }}
      />
      <MaterialTab.Screen
        name="TabSecond"
        component={TabSecond}
        options={{
          tabBarColor: '#3f0103',
          tabBarLabel: 'Second',
          tabBarIcon: ({color}) => (
            <Icon name="people" color={color} size={26} />
          ),
        }}
      />
      <MaterialTab.Screen
        name="News"
        component={News}
        options={{
          tabBarColor: '#227ff2',
          tabBarLabel: 'News',
          tabBarIcon: ({color}) => (
            <Icon name="message" color={color} size={26} />
          ),
        }}
      />
      <MaterialTab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarColor: '#83463f',
          tabBarLabel: 'Setting',
          tabBarIcon: ({color}) => (
            <Icon name="settings" color={color} size={26} />
          ),
        }}
      />
    </MaterialTab.Navigator>
  );
};

const MaterialTopTabNavi = () => {
  return (
    <MaterialTopTab.Navigator>
      <MaterialTopTab.Screen name="TabFirst" component={TabFirst} />
      <MaterialTopTab.Screen name="TabSecond" component={TabSecond} />
      <MaterialTopTab.Screen name="News" component={News} />
      <MaterialTopTab.Screen name="Setting" component={Setting} />
    </MaterialTopTab.Navigator>
  );
};

const MaterialTopTabNaviStackNavi = ({navigation}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: (props) => (
          <IconButton
            iconName="menu"
            onPress={() => navigation.openDrawer()}
            color="black"
          />
        ),
      }}>
      <Stack.Screen name="MaterialTopTabNavi" component={MaterialTopTabNavi} />
    </Stack.Navigator>
  );
};

const CustomDrawerContent = (props, logout) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={() => logout()} />
    </DrawerContentScrollView>
  );
};
const DrawNavi = () => {
  const {logout} = useContext(UserContext);

  return (
    <Drawer.Navigator
      drawerContent={(props) => CustomDrawerContent(props, logout)}>
      <Drawer.Screen name="TabNavi" component={TabNavi} />
      <Drawer.Screen name="MaterialTabNavi" component={MaterialTabNavi} />
      <Drawer.Screen
        name="MaterialTopTabNaviStackNavi"
        component={MaterialTopTabNaviStackNavi}
      />
    </Drawer.Navigator>
  );
};

const MainNavi = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DrawNavi"
        component={DrawNavi}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="FullModal" component={Modal} />
      <Stack.Screen
        name="WebView"
        component={WebView}
        options={{stackPresentation: 'modal'}}
      />
    </Stack.Navigator>
  );
};
export default () => {
  const scheme = useColorScheme();
  const {userInfo} = useContext(UserContext);

  return (
    <AppearanceProvider>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        {userInfo ? <MainNavi /> : <LoginStackNavi />}
      </NavigationContainer>
    </AppearanceProvider>
  );
};
