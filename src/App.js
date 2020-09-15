import 'react-native-gesture-handler';
import React, {createRef, useRef, useEffect, useState} from 'react';
import {View, Image, Animated, StatusBar, StyleSheet} from 'react-native';
import {enableScreens} from 'react-native-screens';
import FlashMessage from 'react-native-flash-message';

import {UserContextProvider} from '~/Context/User';
import {TDContextProvider} from '~/Context/TDA';

import Navigator from '~/Screen/Navigator';
import LocaleProvider from '~/I18n';
import Splash from '~/Component/Splash';

enableScreens();
const App = () => {
  const flashMessageRef = createRef();
  return (
    <Splash isLoaded>
      <LocaleProvider>
        <UserContextProvider>
          <TDContextProvider>
            <Navigator />
            <FlashMessage ref={flashMessageRef} />
          </TDContextProvider>
        </UserContextProvider>
      </LocaleProvider>
    </Splash>
  );
};

export default App;
