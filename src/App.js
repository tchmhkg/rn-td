import 'react-native-gesture-handler';
import React, {createRef} from 'react';
import {enableScreens} from 'react-native-screens';
import FlashMessage from 'react-native-flash-message';

import {UserContextProvider} from '~/Context/User';

import Navigator from './Screen/Navigator';

enableScreens();
const App = () => {
  const flashMessageRef = createRef();
  return (
    <UserContextProvider>
      <Navigator />
      <FlashMessage ref={flashMessageRef} />
    </UserContextProvider>
  );
};

export default App;
