import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
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
  color: ${(props) => props.theme.text};
`;

const Diff = Styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.text};
`;

const StockItem = ({item, refreshing}) => {
  const navigation = useNavigation();
  const {lastPrice = item.lastPriceInDouble, closePrice} = item;
  

  const onPressStock = (symbol) => {
    navigation.navigate('Stock', {ticker: symbol});
  };

  const getPriceColor = () => {
    if (lastPrice > closePrice) {
      return styles.positive;
    } else if (lastPrice < closePrice) {
      return styles.negative;
    } else {
      return {};
    }
  };

  const getPriceDiff = () => {
    const diff = lastPrice - closePrice;
    const diffPercent = (diff / closePrice) * 100;
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
          <Name numberOfLines={1}>{item.description || item.name}</Name>
          <Symbol>{item.symbol}</Symbol>
        </View>
        <View style={styles.stockPrice}>
          <Price style={getPriceColor()}>{lastPrice}</Price>
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
export default StockItem;
