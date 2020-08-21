import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
// import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
// import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Host} from 'react-native-portalize';

import ThemeManager, {useTheme} from '~/Theme';

import {UserContext} from '~/Context/User';
import {TDContext} from '~/Context/TDA';

import IconButton from '~/Component/IconButton';

import SignIn from './SignIn';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
// import TabFirst from './TabFirst';
import StockList from './StockList';
import News from './News';
import Setting from './Setting';
import Modal from './Modal';
import WebView from './WebView';
import TDAWebView from './WebView/TDA';
import SearchTicker from './SearchTicker';
import Stock from './Stock';

import Summary from './Portfolio/Summary';

import Styled from 'styled-components/native';
import {useLocale} from '~/I18n';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
// const MaterialTab = createMaterialBottomTabNavigator();
// const MaterialTopTab = createMaterialTopTabNavigator();

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

// const TabFirstStackNavi = ({navigation}) => {
//   const {logout} = useContext(UserContext);
//   const {colors} = useTheme();

//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerStyle: {
//           backgroundColor: colors?.primary,
//         },
//         headerTintColor: '#fff',
//         headerTitleStyle: {
//           fontWeight: 'bold',
//         },
//         headerRight: (props) => (
//           <IconButton iconName="power-settings-new" onPress={logout} />
//         ),
//       }}>
//       <Stack.Screen
//         name="TabFirst"
//         component={TabFirst}
//         options={{
//           headerLeft: (props) => (
//             <IconButton
//               iconName="menu"
//               onPress={() => navigation.openDrawer()}
//             />
//           ),
//         }}
//       />
//       <Stack.Screen
//         name="Modal"
//         component={Modal}
//         options={{stackPresentation: 'modal'}}
//       />
//     </Stack.Navigator>
//   );
// };

const PortfolioStackNavi = ({navigation}) => {
  const {authInfo, logout} = useContext(TDContext);

  const {colors} = useTheme();
  const {t} = useLocale();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors?.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: (props) =>
          authInfo?.access_token && (
            <IconButton iconName="power-settings-new" onPress={logout} />
          ),
      }}>
      <Stack.Screen
        name="Summary"
        component={Summary}
        options={{
          headerTitle: t('Summary'),
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

const StockStackNavi = ({navigation}) => {
  const {colors} = useTheme();
  const {t} = useLocale();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors?.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="StockList"
        component={StockList}
        options={{
          headerTitle: t('Stocks'),
          headerLeft: (props) => (
            <IconButton
              iconName="menu"
              onPress={() => navigation.openDrawer()}
            />
          ),
          // headerRight: (props) => (
          //   <IconButton
          //     iconName="search"
          //     onPress={() => {
          //       navigation.push('SearchTicker');
          //     }}
          //   />
          // ),
        }}
      />
      <Stack.Screen
        name="SearchTicker"
        component={SearchTicker}
        options={{stackPresentation: 'modal'}}
      />
      <Stack.Screen
        name="Stock"
        component={Stock}
        options={{headerTitle: t('Stock')}}
      />
      <Stack.Screen
        name="Modal"
        component={Modal}
        options={{stackPresentation: 'modal'}}
      />
    </Stack.Navigator>
  );
};

const SettingStackNavi = ({navigation}) => {
  const {colors} = useTheme();
  const {t} = useLocale();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors?.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{
          headerTitle: t('Setting'),
          headerLeft: (props) => (
            <IconButton
              iconName="menu"
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const TabNavi = () => {
  const {colors} = useTheme();
  const {t} = useLocale();
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.primary,
        inactiveBackgroundColor: colors.background,
        activeBackgroundColor: colors.background,
        inactiveTintColor: colors.inactive,
      }}>
      <Tab.Screen
        name="PortfolioStackNavi"
        component={PortfolioStackNavi}
        options={{
          tabBarLabel: t('Portfolio'),
          tabBarIcon: ({color}) => (
            <Icon name="account-box" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Stocks"
        component={StockStackNavi}
        options={{
          // headerShown: true,
          tabBarLabel: t('Stocks'),
          tabBarIcon: ({color}) => (
            <Icon name="trending-up" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="News"
        component={News}
        options={{
          tabBarLabel: t('News'),
          tabBarIcon: ({color}) => (
            <Icon name="message" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingStackNavi}
        options={{
          tabBarLabel: t('Setting'),
          tabBarIcon: ({color}) => (
            <Icon name="settings" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// const MaterialTabNavi = () => {
//   return (
//     <Host>
//       <MaterialTab.Navigator>
//         <MaterialTab.Screen
//           name="PortfolioStackNavi"
//           component={PortfolioStackNavi}
//           options={{
//             tabBarColor: '#336723',
//             tabBarLabel: 'Portfolio',
//             tabBarIcon: ({color}) => (
//               <Icon name="home" color={color} size={26} />
//             ),
//           }}
//         />
//         <MaterialTab.Screen
//           name="StockStackNavi"
//           component={StockStackNavi}
//           options={{
//             tabBarColor: '#3f0103',
//             tabBarLabel: 'Stocks',
//             tabBarIcon: ({color}) => (
//               <Icon name="people" color={color} size={26} />
//             ),
//           }}
//         />
//         <MaterialTab.Screen
//           name="News"
//           component={News}
//           options={{
//             tabBarColor: '#227ff2',
//             tabBarLabel: 'News',
//             tabBarIcon: ({color}) => (
//               <Icon name="message" color={color} size={26} />
//             ),
//           }}
//         />
//         <MaterialTab.Screen
//           name="Setting"
//           component={Setting}
//           options={{
//             tabBarColor: '#83463f',
//             tabBarLabel: 'Setting',
//             tabBarIcon: ({color}) => (
//               <Icon name="settings" color={color} size={26} />
//             ),
//           }}
//         />
//       </MaterialTab.Navigator>
//     </Host>
//   );
// };

// const MaterialTopTabNavi = () => {
//   return (
//     <Host>
//       <MaterialTopTab.Navigator>
//         <MaterialTopTab.Screen name="TabFirst" component={TabFirst} />
//         <MaterialTopTab.Screen name="StockList" component={StockList} />
//         <MaterialTopTab.Screen name="News" component={News} />
//         <MaterialTopTab.Screen name="Setting" component={Setting} />
//       </MaterialTopTab.Navigator>
//     </Host>
//   );
// };

// const MaterialTopTabNaviStackNavi = ({navigation}) => {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerLeft: (props) => (
//           <IconButton
//             iconName="menu"
//             onPress={() => navigation.openDrawer()}
//             color="black"
//           />
//         ),
//       }}>
//       <Stack.Screen name="MaterialTopTabNavi" component={MaterialTopTabNavi} />
//     </Stack.Navigator>
//   );
// };

const CustomDrawerContent = (props, logout) => {
  return (
    <DrawerContentScrollView {...props}>
      {/* <DrawerItemList {...props} /> */}
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
      {/* <Drawer.Screen name="MaterialTabNavi" component={MaterialTabNavi} /> */}
      {/* <Drawer.Screen
        name="MaterialTopTabNaviStackNavi"
        component={MaterialTopTabNaviStackNavi}
      /> */}
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
      <Stack.Screen
        name="TDAWebView"
        component={TDAWebView}
        // options={{stackPresentation: 'modal'}}
      />
    </Stack.Navigator>
  );
};

const SafeAreaBottom = Styled.SafeAreaView`
  background-color: ${(props) => props.theme.background};
`;

export default () => {
  const {userInfo} = useContext(UserContext);

  return (
    <ThemeManager>
      <NavigationContainer>
        <Host>{userInfo ? <MainNavi /> : <LoginStackNavi />}</Host>
      </NavigationContainer>
      <SafeAreaBottom />
    </ThemeManager>
  );
};
