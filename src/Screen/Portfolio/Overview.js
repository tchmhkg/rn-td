import React, {useState, useRef, useContext, useEffect} from 'react';
import Styled from 'styled-components/native';
import axios from 'axios';
import Accordion from 'react-native-collapsible/Accordion';

import Button from '~/Component/Button';
import {TDAWebView} from '~/Component/Modal/TDAWebView';
import {TDContext} from '~/Context/TDA';
import {TDA_BASE_URL, TDA_CLIENT_ID} from '~/Util/config';
import {View, Text} from 'react-native';
import {useTheme} from '~/Theme';
import {showMessage} from 'react-native-flash-message';
// import { getTDARefreshTokenUrl } from '~/Util/apiUrls';

const Container = Styled.View`
  flex: 1;
  background: ${(props) => props.theme.background};
`;

const Label = Styled.Text`
  color: ${(props) => props.theme.text};
`;
const url =
  'https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=https%3A%2F%2Fchmtdsapi.herokuapp.com%2Fauth&client_id=1AQTLQTIRXA05MXOGHCE96NC5BFRTQFH%40AMER.OAUTHAP';
const Overview = ({navigation}) => {
  const {tdToken, authInfo, logout} = useContext(TDContext);
  const modalizeRef = useRef(null);
  const [activeSections, setActiveSections] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const theme = useTheme();

  const openTDWeb = () => {
    modalizeRef.current.open();
  };

  useEffect(() => {
    // console.log('authInfo', authInfo);
    if (authInfo?.access_token) {
      getTDAccounts();
    }
  }, [authInfo?.access_token]);

  // const refreshToken = async (callback) => {
  //   try {
  //     console.log('refresh token');

  //     const res = await axios.post(
  //       getTDARefreshTokenUrl(authInfo.refresh_token),
  //       {},
  //       {
  //         headers: {
  //           'Content-Type': 'application/x-www-form-urlencoded',
  //         },
  //       },
  //     );
  //     if (res.data && res.data) {
  //       refreshAccessToken(res.data.access_token);
  //       if (callback) {
  //         callback();
  //       }
  //     }
  //     console.log(res.data);
  //   } catch (error) {
  //     console.log(error.response);
  //     showMessage({
  //       message: error.response?.data?.error,
  //       type: 'danger',
  //       icon: 'auto',
  //       duration: 2000,
  //     });
  //   }
  // };

  const getTDAccounts = async () => {
    try {
      const res = await axios.get(TDA_BASE_URL + '/accounts', {
        headers: {
          Authorization: 'Bearer ' + authInfo.access_token,
        },
        params: {
          fields: 'positions',
        },
      });
      if (res.data && res.data.length) {
        setAccounts(res.data);
        setActiveSections([0]);
      }
      console.log(res.data);
    } catch (error) {
      console.log(error.response);

      if (error.response?.status === 401) {
        logout();
        // refreshToken();
        // } else {
        // setLoading(false);
        showMessage({
          message: error.response?.data?.error,
          type: 'danger',
          icon: 'auto',
          duration: 2000,
        });
      }
    }
  };

  const _renderHeader = ({securitiesAccount}) => {
    return (
      <View
        style={{
          padding: 15,
          backgroundColor: theme.colors.border,
          borderBottomColor: '#b2b2b2',
          borderBottomWidth: 1,
        }}>
        <Label>
          {securitiesAccount?.accountId} ({securitiesAccount?.type})
        </Label>
      </View>
    );
  };

  const _renderContent = ({securitiesAccount}) => {
    return (
      <View style={{padding: 15, backgroundColor: theme.colors.borderAlt}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Label>Cash Balance:</Label>
          <Label>${securitiesAccount?.currentBalances?.cashBalance} USD</Label>
        </View>
      </View>
    );
  };

  return (
    <Container>
      <Label>This is Portfolio Overview</Label>
      {!tdToken && (
        <Button
          style={{marginBottom: 20}}
          label="Login TD Ameritrade"
          onPress={openTDWeb}
        />
      )}
      {authInfo?.access_token && (!accounts || !accounts.length) ? (
        <Button
          style={{marginBottom: 20}}
          label="Get TD Accounts"
          onPress={getTDAccounts}
        />
      ) : null}
      {authInfo?.access_token ? (
        <Accordion
          activeSections={activeSections}
          sections={accounts}
          // renderSectionTitle={_renderSectionTitle}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={setActiveSections}
          expandMultiple
        />
      ) : (
        <View>
          <Label>You must login first!</Label>
        </View>
      )}
      <TDAWebView ref={modalizeRef} url={url} />
    </Container>
  );
};

export default Overview;
