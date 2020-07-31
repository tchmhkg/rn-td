import React, {createContext, useState, useEffect} from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {Appearance, AppearanceProvider} from 'react-native-appearance';

import lightTheme from './light';
import darkTheme from './dark';
import AsyncStorage from '@react-native-community/async-storage';

const getModeFromStorage = async () => {
  try {
    const mode = await AsyncStorage.getItem('mode');
    if (mode !== null) {
      return mode;
    }
    return Appearance.getColorScheme() || 'light';
  } catch (e) {
    console.log(e);
  }
};

const defaultMode = async () => await getModeFromStorage();

const ThemeContext = createContext({
  mode: getModeFromStorage(),
  setMode: (mode) => console.log(mode),
  colors: {},
});

export const useTheme = () => React.useContext(ThemeContext);

const ManageThemeProvider = ({children}) => {
  const [themeState, setThemeState] = useState(defaultMode());
  const setMode = (mode) => {
    AsyncStorage.setItem('mode', mode);
    setThemeState(mode);
    // StatusBar.setBarStyle(
    //   mode === 'dark' ? 'light-content' : 'dark-content',
    //   true,
    // );
  };

  useEffect(() => {
    const getDefaultMode = async () => {
      const mode = await getModeFromStorage();
      setThemeState(mode);
      // StatusBar.setBarStyle(
      //   mode === 'dark' ? 'light-content' : 'dark-content',
      //   true,
      // );
    };
    getDefaultMode();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      AsyncStorage.setItem('mode', colorScheme);
      setThemeState(colorScheme);
      // StatusBar.setBarStyle(
      //   colorScheme === 'dark' ? 'light-content' : 'dark-content',
      //   true,
      // );
    });
    return () => subscription.remove();
  }, []);
  return (
    <ThemeContext.Provider
      value={{
        mode: themeState,
        setMode,
        colors: themeState === 'dark' ? darkTheme.theme : lightTheme.theme,
      }}>
      <ThemeProvider
        theme={themeState === 'dark' ? darkTheme.theme : lightTheme.theme}>
        <>
          <StatusBar
            barStyle={themeState === 'dark' ? 'light-content' : 'dark-content'}
          />
          {children}
        </>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

const ThemeManager = ({children}) => (
  <AppearanceProvider>
    <ManageThemeProvider>{children}</ManageThemeProvider>
  </AppearanceProvider>
);

export default ThemeManager;
