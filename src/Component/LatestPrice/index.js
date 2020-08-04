import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {FINNHUB_API_KEY} from '~/Util/config';
import {timestampToDate} from '~/Helper';
import axios from 'axios';
import {QUOTE_API} from '~/Util/apiUrls';
import Styled from 'styled-components/native';
import {useLocale} from '~/I18n';

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

export default (props) => {
  const route = useRoute();
  const {ticker} = route?.params || props;
  const [latestPrice, setLatestPrice] = useState({});
  const [previousClosePrice, setPreviousClosePrice] = useState({});
  const {t} = useLocale();
  let mounted = true;

  useEffect(() => {
    setLatestPrice({});
    const getPreviousClosePrice = async () => {
      const res = await axios.get(QUOTE_API, {
        params: {
          symbol: ticker.toUpperCase(),
          token: FINNHUB_API_KEY,
        },
      });
      setPreviousClosePrice(res.data?.pc);
    };
    getPreviousClosePrice();
  }, [ticker]);

  useEffect(() => {
    // console.log('ticker => ', ticker);
    if (!ticker) {
      // console.log('ticker not valid, quit');
      return;
    }
    const ws = new WebSocket('wss://ws.finnhub.io?token=' + FINNHUB_API_KEY);
    // Connection opened -> Subscribe
    ws.onopen = (e) => {
      // console.log('subscribe', e);
      ws.send(JSON.stringify({type: 'subscribe', symbol: ticker}));
    };

    ws.onmessage = (e) => {
      // console.log('Message from server ', e.data);
      const data = JSON.parse(e.data);
      if (data?.data?.[0]?.p && mounted) {
        setLatestPrice({
          price: data?.data?.[0]?.p,
          lastUpdateTime: data?.data?.[0]?.t
            ? timestampToDate(data?.data?.[0]?.t / 1000, 'YYYY/MM/DD HH:mm:ss')
            : '',
        });
      }
    };

    ws.onerror = (e) => {
      // an error occurred
      console.log('onerror');
      console.log(e.message);
    };

    ws.onclose = (e) => {
      console.log(e.code, e.reason);
    };

    // Unsubscribe
    return () => {
      mounted = false;
      ws.send(JSON.stringify({type: 'unsubscribe', symbol: ticker}));
      ws.close();
      console.log('unsubscribe => ', ticker);
    };
  }, [ticker]);

  const getPriceColor = () => {
    if (latestPrice?.price > previousClosePrice) {
      return styles.positive;
    } else if (latestPrice?.price < previousClosePrice) {
      return styles.negative;
    } else {
      return {};
    }
  };

  const getPriceDiff = () => {
    const diff = latestPrice?.price - previousClosePrice;
    const diffPercent = (diff / previousClosePrice) * 100;
    if (diff > 0) {
      return `+${diff.toFixed(3)}(+${diffPercent.toFixed(2)}%)`;
    } else if (diff < 0) {
      return `${diff.toFixed(3)}(${diffPercent.toFixed(2)}%)`;
    } else {
      return '0(+0%)';
    }
  };

  if (!latestPrice?.price) {
    return null;
  }

  return (
    <Container>
      <Price style={getPriceColor()}>
        {latestPrice?.price?.toFixed(3)}{' '}
        <Text style={styles.priceDiff}>{getPriceDiff()}</Text>
      </Price>
      <LastUpdate>
        {t('Last updated at:')} {latestPrice?.lastUpdateTime}
      </LastUpdate>
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
