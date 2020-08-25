import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const defaultContext = {
  tdToken: '',
  authInfo: {},
  login: (authData) => {},
  getTDAuthInfo: () => {},
  logout: () => {},
  refreshAccessToken: () => {},
};

const TDContext = createContext(defaultContext);

const TDContextProvider = ({children}) => {
  const [authInfo, setAuthInfo] = useState(undefined);

  const login = (authData) => {
    // Use Eamil and Passowrd for login API
    // Get token and UserInfo via Login API
    // console.log('in TDContext login', authData);
    AsyncStorage.setItem('tda_auth', JSON.stringify(authData)).then(() => {
      setAuthInfo(authData);
    });
  };

  const getTDAuthInfo = () => {
    AsyncStorage.getItem('tda_auth')
      .then((value) => {
        if (value) {
          // console.log(value);
          setAuthInfo(JSON.parse(value));
        }
      })
      .catch(() => {
        setAuthInfo(undefined);
      });
  };

  const refreshAccessToken = (token) => {
    AsyncStorage.getItem('tda_auth')
      .then((value) => {
        if (value) {
          const jsonValue = JSON.parse(value);
          const withNewAccessToken = {...jsonValue, access_token: token};
          AsyncStorage.setItem(
            'tda_auth',
            JSON.stringify(withNewAccessToken),
          ).then(() => {
            setAuthInfo(withNewAccessToken);
          });
        }
      })
      .catch(() => {
        setAuthInfo(undefined);
      });
  };

  const logout = () => {
    AsyncStorage.removeItem('tda_auth');
    setAuthInfo(undefined);
  };

  useEffect(() => {
    getTDAuthInfo();
  }, []);

  return (
    <TDContext.Provider
      value={{
        tdToken: authInfo,
        authInfo,
        login,
        getTDAuthInfo,
        logout,
        refreshAccessToken,
      }}>
      {children}
    </TDContext.Provider>
  );
};
export {TDContextProvider, TDContext};
