import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const defaultContext = {
  userInfo: undefined,
  login: (email, password) => {},
  getUserInfo: () => {},
  logout: () => {},
};

const UserContext = createContext(defaultContext);

const UserContextProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState(undefined);

  const login = (email, password) => {
    // Use Eamil and Passowrd for login API
    // Get token and UserInfo via Login API
    AsyncStorage.setItem('token', 'save your token').then(() => {
      setUserInfo({
        name: 'peter',
        email: 'peter@email.com',
      });
    });
  };

  const getUserInfo = () => {
    AsyncStorage.getItem('token')
      .then((value) => {
        if (value) {
          setUserInfo({
            name: 'peter',
            email: 'peter@email.com',
          });
        }
      })
      .catch(() => {
        setUserInfo(undefined);
      });
  };

  const logout = () => {
    AsyncStorage.removeItem('token');
    setUserInfo(undefined);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        login,
        getUserInfo,
        logout,
      }}>
      {children}
    </UserContext.Provider>
  );
};
export {UserContextProvider, UserContext};
