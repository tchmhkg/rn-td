import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {FINNHUB_API_KEY} from '~/Util/config';
import {QUOTE_API} from '~/Util/apiUrls';
import Styled from 'styled-components/native';

const Container = Styled.View`
  flex: 1;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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

const StockItem = ({item}) => {
  const navigation = useNavigation();
  const [price, setPrice] = useState('-');
  const [previousClosePrice, setPreviousClosePrice] = useState(null);

  useEffect(() => {
    const getPrice = async () => {
      console.log('get price');
      const res = await axios.get(QUOTE_API, {
        params: {
          symbol: item.symbol.toUpperCase(),
          token: FINNHUB_API_KEY,
        },
      });
      setPrice(res.data?.c);
      setPreviousClosePrice(res.data?.pc);
    };
    getPrice();
  }, []);

  const onPressStock = (symbol) => {
    navigation.navigate('Stock', {ticker: symbol});
  };

  const getPriceColor = () => {
    if (price > previousClosePrice) {
      return styles.positive;
    } else if (price < previousClosePrice) {
      return styles.negative;
    } else {
      return {};
    }
  };

  const getPriceDiff = () => {
    const diff = price - previousClosePrice;
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

  return (
    <TouchableWithoutFeedback onPress={() => onPressStock(item.symbol)}>
      <Container>
        <View style={styles.stockInfo}>
          <Name numberOfLines={1}>{item.name}</Name>
          <Symbol>{item.symbol}</Symbol>
        </View>
        <View style={styles.stockPrice}>
          <Price style={getPriceColor()}>{price}</Price>
          <Diff style={getPriceColor()}>{getPriceDiff()}</Diff>
        </View>
      </Container>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  symbolWrapper: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockInfo: {
    flex: 0.7,
  },
  stockPrice: {
    flex: 0.3,
    alignItems: 'flex-end',
  },
  positive: {
    color: '#4DBD33',
  },
  negative: {
    color: '#FD1050',
  },
});
export default StockItem;
