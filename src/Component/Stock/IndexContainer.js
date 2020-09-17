import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {FINNHUB_API_KEY, TDA_CLIENT_ID} from '~/Util/config';
import {timestampToDate} from '~/Helper';
import axios from 'axios';
import {QUOTE_API} from '~/Util/apiUrls';
import Styled from 'styled-components/native';
import {useLocale} from '~/I18n';
import ReconnectingWebSocket from 'reconnecting-websocket';
import {TDA_QUOTES_API} from '~/Util/apiUrls';
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const Container = Styled.View`
  margin: 5px 10px;
`;

const Price = Styled.Text`
  color: ${(props) => props.theme.text}
  font-size: 32px;
  font-weight: bold;
`;

const LastUpdate = Styled.Text`
  color: ${(props) => props.theme.text}
  font-size: 12px;
`;
export default ({isFocused}) => {
  const route = useRoute();
  const [prices, setPrices] = useState({});
  let isCancelled = useRef(false);
  //   const [previousClosePrice, setPreviousClosePrice] = useState({});
  const {t} = useLocale();

  useEffect(() => {
    const interval = setInterval(() => {
      getQuotes();
    }, 500);
    if(!isFocused) {
        clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isFocused]);

  const getQuotes = () => {
    axios
      .get(TDA_QUOTES_API, {
        cancelToken: source.token,
        params: {
          apikey: TDA_CLIENT_ID,
          symbol: '/NQ,/YM,/ES,$DJI,$COMPX,$SPX.X',
        },
      })
      .then((res) => {
        if (res?.data && !isCancelled.current) {
          console.log(Object.values(res?.data));
          setPrices(Object.values(res?.data));
          //   console.log(Object.values(res?.data));
        }
        // setIsRefreshing(false);
      })
      .catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message);
        } else {
          console.log(thrown);
        }
        // setIsRefreshing(false);
      });
  };

  return (
    <Container>
      <Text>{prices?.[0]?.description} </Text>
      <Price>
        <Text style={styles.priceDiff}>{prices?.[0]?.lastPriceInDouble}</Text>
      </Price>
    </Container>
  );
};
const styles = StyleSheet.create({
  positive: {
    color: '#4DBD33',
  },
  negative: {
    color: '#FD1050',
  },
  priceDiff: {
    fontSize: 14,
  },
});
