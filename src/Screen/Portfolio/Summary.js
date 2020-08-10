import React, {useState, useRef, useContext, useEffect} from 'react';
import Styled from 'styled-components/native';
import axios from 'axios';
import Accordion from 'react-native-collapsible/Accordion';

import Button from '~/Component/Button';
import {TDAWebView} from '~/Component/Modal/TDAWebView';
import {TDContext} from '~/Context/TDA';
import {TDA_BASE_URL, TDA_LOGIN_URL} from '~/Util/config';
import {
  View,
  FlatList,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
// import { getTDARefreshTokenUrl } from '~/Util/apiUrls';
import {useIsFocused} from '@react-navigation/native';
import Separator from '~/Component/Separator';
import {useLocale} from '~/I18n';
import Spinner from '~/Component/Spinner';

const Container = Styled.View`
  flex: 1;
  background: ${(props) => props.theme.background};
`;

const Label = Styled.Text`
  color: ${(props) => props.theme.text};
`;

const Header = Styled.View`
  padding: 15px;
  background-color: ${(props) => props.theme.border};
  border-bottom-color: #b2b2b2;
  border-bottom-width: 1px;
`;

const Content = Styled.View`
  padding: 15px
  background-color: ${(props) => props.theme.borderAlt};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Summary = ({navigation}) => {
  const {tdToken, authInfo, logout} = useContext(TDContext);
  const modalizeRef = useRef(null);
  const [screenIsFocused, setScreenIsFocused] = useState(false);
  const [activeSections, setActiveSections] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const {t} = useLocale();

  const openTDWeb = () => {
    modalizeRef.current?.open();
  };

  useEffect(() => {
    console.log('isFocused', isFocused);
    setScreenIsFocused(isFocused);
  }, [isFocused]);

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
        if (!activeSections?.length) {
          setActiveSections([0]);
        }
        if (isRefreshing) {
          setIsRefreshing(false);
        }
        if (isLoading) {
          setIsLoading(false);
        }
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
        setAccounts([]);
        setActiveSections([]);
        if (isRefreshing) {
          setIsRefreshing(false);
        }
        if (isLoading) {
          setIsLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    if (isRefreshing) {
      getTDAccounts();
    }
  }, [isRefreshing]);

  const _renderHeader = ({securitiesAccount}) => {
    return (
      <Header>
        <Label>
          {securitiesAccount?.accountId} ({t(securitiesAccount?.type)})
        </Label>
      </Header>
    );
  };

  const renderItem = ({item}) => {
    return (
      <Content>
        <Label>{t(item[0])}:</Label>
        <Label>${item[1].toFixed(2)}</Label>
      </Content>
    );
  };

  const renderSeparator = () => {
    return <Separator />;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
  };

  const _renderContent = ({securitiesAccount}) => {
    const fields = [
      'cashBalance',
      'longMarketValue',
      'shortMarketValue',
      'moneyMarketFund',
      'liquidationValue',
      'cashAvailableForTrading',
      'cashAvailableForWithdrawal',
    ];
    const currentBalances = Object.entries(
      securitiesAccount?.currentBalances,
    ).filter((field) => {
      return fields.includes(field[0]);
    });
    return (
      <FlatList
        data={currentBalances}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={(item) => item[0]}
        scrollEnabled={false}
      />
    );
  };

  return (
    <Container>
      {isLoading && <Spinner />}
      {/* {authInfo?.access_token && (!accounts || !accounts.length) ? (
        <Button
          style={{marginTop: 20, marginBottom: 20}}
          label="Get TD Accounts"
          onPress={getTDAccounts}
        />
      ) : null} */}

      {authInfo?.access_token ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }>
          <Accordion
            activeSections={activeSections}
            sections={accounts}
            // renderSectionTitle={_renderSectionTitle}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={setActiveSections}
            expandMultiple
          />
        </ScrollView>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {!tdToken && (
            <Button
              style={{marginBottom: 20}}
              label="Login TD Ameritrade"
              onPress={openTDWeb}
            />
          )}
          <Label>{t('You must login first')}</Label>
        </View>
      )}
      <TDAWebView ref={modalizeRef} url={TDA_LOGIN_URL} />
    </Container>
  );
};

export default Summary;
