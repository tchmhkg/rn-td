import 'react-native-gesture-handler';
import React, {createRef} from 'react';
import {enableScreens} from 'react-native-screens';
import FlashMessage from 'react-native-flash-message';

import {UserContextProvider} from '~/Context/User';
import {TDContextProvider} from '~/Context/TDA';

import Navigator from '~/Screen/Navigator';
import LocaleProvider from '~/I18n';

enableScreens();
const App = () => {
  const flashMessageRef = createRef();
  return (
    <LocaleProvider>
      <UserContextProvider>
        <TDContextProvider>
          <Navigator />
          <FlashMessage ref={flashMessageRef} />
        </TDContextProvider>
      </UserContextProvider>
    </LocaleProvider>
  );
};

export default App;
