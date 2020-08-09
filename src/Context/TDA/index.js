import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const defaultContext = {
  login: (authData) => {},
  getTDToken: () => {},
};

const TDContext = createContext(defaultContext);

const TDContextProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState(undefined);

  const login = (authData) => {
    // Use Eamil and Passowrd for login API
    // Get token and UserInfo via Login API
    console.log('in TDContext login', authData);
    AsyncStorage.setItem('access_token', authData.access_token).then(() => {
      setUserInfo(authData.access_token);
    });
  };

  const getTDToken = () => {
    AsyncStorage.getItem('access_token')
      .then((value) => {
        if (value) {
          console.log(value);
          setUserInfo(value);
        }
      })
      .catch(() => {
        setUserInfo(undefined);
      });
  };

  const logout = () => {
    AsyncStorage.removeItem('access_token');
    setUserInfo(undefined);
  };

  useEffect(() => {
    getTDToken();
  }, []);

  return (
    <TDContext.Provider
      value={{
        tdToken: userInfo,
        login,
        getTDToken,
      }}>
      {children}
    </TDContext.Provider>
  );
};
export {TDContextProvider, TDContext};
