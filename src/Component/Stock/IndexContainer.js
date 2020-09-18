import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {TDA_CLIENT_ID} from '~/Util/config';
import axios from 'axios';
import Styled from 'styled-components/native';
import {useLocale} from '~/I18n';
import {TDA_QUOTES_API} from '~/Util/apiUrls';
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const Container = Styled.View`
  margin: 5px 10px;
  flex: 1;
`;

const Price = Styled.Text`
  color: ${(props) => props.theme.text}
  font-size: 20px;
  font-weight: bold;
`;

export default ({isFocused}) => {
  const route = useRoute();
  const [prices, setPrices] = useState([]);
  let isCancelled = useRef(false);
  //   const [previousClosePrice, setPreviousClosePrice] = useState({});
  const {t} = useLocale();

  useEffect(() => {
    const interval = setInterval(() => {
      getQuotes();
    }, 500);
    if (!isFocused) {
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
          symbol: '/YM,/NQ,/ES,$DJI,$COMPX,$SPX.X',
        },
      })
      .then((res) => {
        if (res?.data && !isCancelled.current) {
          console.log(Object.values(res?.data));
          setPrices(Object.values(res?.data));
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

  const getPriceColor = (priceObj) => {
    if (priceObj?.lastPriceInDouble > priceObj?.closePriceInDouble) {
      return styles.positive;
    } else if (priceObj?.lastPriceInDouble < priceObj?.closePriceInDouble) {
      return styles.negative;
    } else {
      return {};
    }
  };

  const getPriceDiff = (priceObj) => {
    const diff = priceObj?.lastPriceInDouble - priceObj?.closePriceInDouble;
    const diffPercent = (diff / priceObj?.closePriceInDouble) * 100;
    if (diff > 0) {
      return `+${diff.toFixed(2)}(+${diffPercent.toFixed(2)}%)`;
    } else if (diff < 0) {
      return `${diff.toFixed(2)}(${diffPercent.toFixed(2)}%)`;
    } else if (diff === 0) {
      return '0(+0%)';
    } else {
      return '';
    }
  };

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {prices?.slice(0, 3).map((price) => {
        return (
          <Container>
            <Text numberOfLines={2}>{price?.description} </Text>
            <Price style={getPriceColor(price)}>
              {price?.lastPriceInDouble?.toFixed(price)}
            </Price>
            <Price style={getPriceColor(price)}>
              <Text style={styles.priceDiff}>{getPriceDiff(price)}</Text>
            </Price>
          </Container>
        );
      })}
    </View>
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
