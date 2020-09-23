import React, {useCallback, memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Styled from 'styled-components/native';

const Price = Styled.Text`
  color: ${(props) => props.theme.text}
  font-size: 20px;
  font-weight: bold;
`;

const IndexPrice = ({priceObj, isFuture = false}) => {
  const getPriceColor = () => {
    const lastPrice = (isFuture
      ? priceObj?.lastPriceInDouble
      : priceObj?.lastPrice).toFixed(2);
    const closePrice = (isFuture
      ? priceObj?.closePriceInDouble
      : priceObj?.closePrice).toFixed(2);
    if (lastPrice > closePrice) {
      return styles.positive;
    } else if (lastPrice < closePrice) {
      return styles.negative;
    } else {
      return {};
    }
  };

  const getPriceDiff = () => {
    const lastPrice = (isFuture
      ? priceObj?.lastPriceInDouble
      : priceObj?.lastPrice).toFixed(2);
    const closePrice = (isFuture
      ? priceObj?.closePriceInDouble
      : priceObj?.closePrice).toFixed(2);
    const diff = lastPrice - closePrice;
    const diffPercent = (diff / closePrice) * 100;
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

  const renderLastPrice = useCallback(() => {
    return (
      <Price style={getPriceColor()}>
        {isFuture
          ? priceObj?.lastPriceInDouble?.toFixed(2)
          : priceObj?.lastPrice?.toFixed(2)}
      </Price>
    );
  }, [priceObj?.lastPriceInDouble, priceObj?.lastPrice]);

  const renderPriceDiff = useCallback(() => {
    return (
      <Price style={getPriceColor()}>
        <Text style={styles.priceDiff}>{getPriceDiff()}</Text>
      </Price>
    );
  }, [priceObj?.lastPriceInDouble, priceObj?.lastPrice]);

  return (
    <View style={{flexGrow: 1, justifyContent: 'flex-end'}}>
      {renderLastPrice()}
      {renderPriceDiff()}
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
    fontSize: 13,
  },
});

export default memo(IndexPrice);
