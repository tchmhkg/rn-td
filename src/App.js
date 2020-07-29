import 'react-native-gesture-handler';
import React from 'react';
import {enableScreens} from 'react-native-screens';

import {UserContextProvider} from '~/Context/User';

import Navigator from './Screen/Navigator';

enableScreens();
const App = () => {
  return (
    <UserContextProvider>
      <Navigator />
    </UserContextProvider>
  );
};

export default App;
