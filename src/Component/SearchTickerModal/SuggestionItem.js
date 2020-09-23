import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Styled from 'styled-components/native';

const Container = Styled.View`
  flex: 1;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Name = Styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.text};
`;

const Symbol = Styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.text};
`;

const SuggestionItem = ({item, navigation, closeSearch}) => {
  const onPressStock = (symbol) => {
    closeSearch();
    navigation.navigate('Stock', {ticker: symbol});
  };

  return (
    <TouchableOpacity onPress={() => onPressStock(item.symbol)}>
      <Container>
        <View>
          <Symbol>
            {item.symbol}{' '}
            <Text style={{color: '#888888'}}>{item.exchDisp}</Text>
          </Symbol>
          <Name numberOfLines={1}>{item.name}</Name>
        </View>
      </Container>
    </TouchableOpacity>
  );
};

export default SuggestionItem;
