import React, {useState, useRef, useContext, useEffect} from 'react';
import Styled from 'styled-components/native';
import axios from 'axios';
import Accordion from 'react-native-collapsible/Accordion';

import Button from '~/Component/Button';
import {TDAWebView} from '~/Component/Modal/TDAWebView';
import {TDContext} from '~/Context/TDA';
import {TDA_BASE_URL, TDA_LOGIN_URL, TDA_CLIENT_ID} from '~/Util/config';
import {
  View,
  FlatList,
  Text,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {getTDARefreshTokenUrl, TDA_REFRESH_TOKEN_API} from '~/Util/apiUrls';
import {useIsFocused} from '@react-navigation/native';
import Separator from '~/Component/Separator';
import {useLocale} from '~/I18n';
import Spinner from '~/Component/Spinner';
import {useTheme} from '~/Theme';

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
const Cell = Styled.View`
  padding: 15px;
  background-color: ${(props) => props.theme.borderAlt};
  align-items: center;
  justify-content: center;
`;

const Summary = ({navigation}) => {
  const {tdToken, authInfo, logout, refreshAccessToken} = useContext(TDContext);
  const modalizeRef = useRef(null);
  const [screenIsFocused, setScreenIsFocused] = useState(false);
  const [activeSections, setActiveSections] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const {t} = useLocale();
  const theme = useTheme();

  const openTDWeb = () => {
    modalizeRef.current?.open();
  };

  useEffect(() => {
    setScreenIsFocused(isFocused);
  }, [isFocused]);

  useEffect(() => {
    getTDAccounts();
  }, [authInfo?.access_token]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getTDAccounts();
  //   }, 5 * 1000);

  //   return () => clearInterval(interval);
  // }, [authInfo?.access_token]);

  const refreshToken = async (callback) => {
    try {
      console.log('refreshToken');
      let bodyData = new URLSearchParams();
      bodyData.append('grant_type', 'refresh_token');
      bodyData.append('refresh_token', authInfo?.refresh_token);
      bodyData.append('client_id', TDA_CLIENT_ID);
      const res = await axios.post(TDA_REFRESH_TOKEN_API, bodyData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      // console.log(res.data);
      if (res.data && res.data) {
        refreshAccessToken(res.data.access_token);
        if (typeof callback === 'function') {
          callback();
        }
      }
    } catch (error) {
      console.log(error.response);
      showMessage({
        message: error.response?.data?.error,
        type: 'danger',
        icon: 'auto',
        duration: 2000,
      });
      logout();
    }
  };

  const getTDAccounts = async () => {
    try {
      if (authInfo?.access_token) {
        // console.log(authInfo);
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
          // if (!activeSections?.length) {
          //   setActiveSections([0]);
          // }
        }
        console.log(res.data);
      }
    } catch (error) {
      console.log(error.response);

      if (error.response?.status === 401) {
        // logout();
        refreshToken();
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
      }
    }

    if (isRefreshing) {
      setIsRefreshing(false);
    }
    if (isLoading) {
      setIsLoading(false);
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

  const renderItem = (item) => {
    return (
      <Content key={item[0]}>
        <Label>{t(item[0])}:</Label>
        <Label>${item[1].toFixed(2)}</Label>
      </Content>
    );
  };

  // const renderSeparator = () => {
  //   return <Separator />;
  // };

  const handleRefresh = () => {
    setIsRefreshing(true);
  };

  const fields = [
    'cashBalance',
    'longMarketValue',
    'shortMarketValue',
    'moneyMarketFund',
    'liquidationValue',
    'cashAvailableForTrading',
    'cashAvailableForWithdrawal',
  ];
  const priceFormatter = ({value, prefix = '', suffix = '', isPL= false}) => {
    const formattedValue = `${prefix}${value?.toFixed(2)}${suffix}`;
    if(isPL) {
      return (
        <Text style={isPositive(value) ? styles.positive : (isZero(value) ? {} : styles.negative)}>{formattedValue}</Text>
      )
    }
    return formattedValue;
  }

  const isPositive = value => {
    return value > 0;
  }

  const isZero = value => {
    return value === 0;
  }

  const positionFields = React.useMemo(() => [
    {label: 'averagePrice', formatter: (value) => priceFormatter({value, prefix: '$'})},
    {label: 'longQuantity'},
    {label: 'marketValue', formatter: (value) => priceFormatter({value, prefix: '$'})},
    {label: 'currentDayProfitLoss', formatter: (value) => priceFormatter({value, prefix: '$', isPL: true})},
    {label: 'currentDayProfitLossPercentage', formatter: (value) => priceFormatter({value, suffix: '%', isPL: true})},
  ], []);

  const _renderContent = ({securitiesAccount}) => {
    
    const currentBalances = Object.entries(
      securitiesAccount?.currentBalances,
    ).filter((field) => {
      return fields.includes(field[0]);
    });
    const {positions = []} = securitiesAccount;
    
    return (
      <>
        {currentBalances?.map((i) => renderItem(i))}
        {positions?.length ? (
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <View>
            <Content>
              <Label>{t('symbol')}</Label>
            </Content>
            {positions?.map((p, i) => (
              <Content key={'symbol-' + p.instrument?.symbol}>
                <Label>{p.instrument?.symbol}</Label>
              </Content>
            ))}
          </View>
          <ScrollView horizontal bounces={false} showsHorizontalScrollIndicator={false}>
            {positionFields.map(({label, formatter}) => (
              <View key={label}>
                <Cell>
                  <Label>{t(label)}</Label>
                </Cell>
                {positions?.map((p, i) => (
                  <Cell key={'cell-' + p.instrument?.symbol}>
                    <Label>{formatter ? formatter(p?.[label]) : p?.[label]}</Label>
                  </Cell>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
        ) : null}
        
      </>
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
      <Button
        style={{marginTop: 20, marginBottom: 20}}
        label="Refresh token"
        onPress={refreshToken}
      />

      {authInfo?.access_token ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.text}
              colors={[theme.colors.text]}
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
          {!authInfo?.access_token && (
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

const styles = StyleSheet.create({
  positive: {
    color: '#42f5a1',
  },
  negative: {
    color: '#bf0404',
  },
});

export default Summary;
