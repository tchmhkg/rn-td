import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {FINNHUB_API_KEY} from '~/Util/config';
import {timestampToDate} from '~/Helper';
import axios from 'axios';
import {QUOTE_API} from '~/Util/apiUrls';

export default () => {
  const route = useRoute();
  const {ticker} = route.params;
  const [latestPrice, setLatestPrice] = useState({});
  const [previousClosePrice, setPreviousClosePrice] = useState({});

  useEffect(() => {
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
  }, []);

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
      if (data?.data?.[0]?.p) {
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
    <View style={styles.titleView}>
      <Text style={[styles.title, getPriceColor()]}>
        {latestPrice?.price?.toFixed(3)}{' '}
        <Text style={styles.priceDiff}>{getPriceDiff()}</Text>
      </Text>
      <Text style={styles.lastUpdateTime}>
        Last updated at: {latestPrice?.lastUpdateTime}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleView: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    opacity: 0.87,
  },
  lastUpdateTime: {
    color: '#fff',
    opacity: 0.87,
    fontSize: 12,
  },
  positive: {
    color: '#0CF49B',
  },
  negative: {
    color: '#FD1050',
  },
  priceDiff: {
    fontSize: 14,
  },
});
