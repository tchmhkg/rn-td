import React, {useState} from 'react';
import Separator from '../Separator';
import SuggestionItem from './SuggestionItem';
import {FlatList} from 'react-native-gesture-handler';

const Suggestion = ({data, closeModal, navigation}) => {
  const renderItem = ({item}) => {
    return (
      <SuggestionItem
        item={item}
        navigation={navigation}
        closeModal={closeModal}
      />
    );
  };

  const renderSeparator = () => {
    return <Separator />;
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.symbol}
      ItemSeparatorComponent={renderSeparator}
    />
  );
};

export default Suggestion;
