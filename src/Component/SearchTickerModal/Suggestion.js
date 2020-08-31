import React, {useState, useCallback} from 'react';
import Separator from '../Separator';
import SuggestionItem from './SuggestionItem';
import {FlatList} from 'react-native-gesture-handler';
import moment from 'moment';

const Suggestion = ({data, closeModal, navigation}) => {
  const renderItem = useCallback(({item}) => {
    return (
      <SuggestionItem
        item={item}
        navigation={navigation}
        closeModal={closeModal}
      />
    );
  }, []);

  const renderSeparator = React.memo(() => {
    return <Separator />;
  });

  const renderKeyExtractor = useCallback(
    (item) => `symbol-suggestion-key-${item.symbol}-${moment().valueOf()}`,
    [],
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={renderKeyExtractor}
      ItemSeparatorComponent={renderSeparator}
    />
  );
};

export default Suggestion;
