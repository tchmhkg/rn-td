import 'react-native-gesture-handler';
import React, {createRef} from 'react';
import {enableScreens} from 'react-native-screens';
import FlashMessage from 'react-native-flash-message';

import {UserContextProvider} from '~/Context/User';

import Navigator from '~/Screen/Navigator';
import LocaleProvider from '~/I18n';

enableScreens();
const App = () => {
  const flashMessageRef = createRef();
  return (
    <LocaleProvider>
      <UserContextProvider>
        <Navigator />
        <FlashMessage ref={flashMessageRef} />
      </UserContextProvider>
    </LocaleProvider>
  );
};

export default App;
