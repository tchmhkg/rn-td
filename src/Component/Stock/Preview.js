import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import {getAdvancedStatsApi, CANDLES_API, QUOTE_API} from '~/Util/apiUrls';
import {IEX_SANDBOX_API_KEY, FINNHUB_API_KEY} from '~/Util/config';
import Styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

const Container = Styled.View`
  flex: 1;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.background};

`;

const Name = Styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.text};
`;

const Symbol = Styled.Text`
  color: ${(props) => props.theme.text};
`;

const Price = Styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

const Diff = Styled.Text`
  font-size: 14px;
`;
export default function TickerPreview({ticker, ...props}) {
  const navigation = useNavigation();
  const [selectedStock, setSelectedStock] = useState({info: {}});
  const [loading, setLoading] = useState(true);
  const [latestPrice, setLatestPrice] = useState({});
  const [previousClosePrice, setPreviousClosePrice] = useState({});
  const {info} = selectedStock;
  mounted = true;

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
    setSelectedStock({info: null});
    fetchStock();
  }, [ticker]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStock();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [ticker]);

  const fetchStock = async () => {
    try {
      if (!ticker || !mounted) {
        return;
      }
      const infoRes = await axios.get(getAdvancedStatsApi(ticker), {
        params: {
          token: IEX_SANDBOX_API_KEY,
        },
      });
      setSelectedStock({
        info: {...infoRes.data, symbol: ticker.toUpperCase()},
      });
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      setLoading(false);
      showMessage({
        message: error.response?.data,
        type: 'danger',
        icon: 'auto',
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    if (!ticker) {
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

  const onPressStock = (symbol) => {
    props.closeModal();
    navigation.navigate('Stock', {ticker: symbol});
  };

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
    } else if (diff === 0) {
      return '0(+0%)';
    } else {
      return '-';
    }
  };

  if (loading) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={() => onPressStock(ticker)}>
      <Container>
        <View style={styles.stockInfo}>
          <Name numberOfLines={1}>{info?.['companyName']}</Name>
          <Symbol>{ticker}</Symbol>
        </View>
        <View style={styles.stockPrice}>
          <Price style={getPriceColor()}>
            {latestPrice?.price?.toFixed(3)}
          </Price>
          <Diff style={getPriceColor()}>{getPriceDiff()}</Diff>
        </View>
      </Container>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  stockInfo: {
    flex: 0.6,
  },
  stockPrice: {
    flex: 0.4,
    alignItems: 'flex-end',
  },
  positive: {
    color: '#4DBD33',
  },
  negative: {
    color: '#FD1050',
  },
});
