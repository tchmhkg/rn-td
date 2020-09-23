import React, {useState, useCallback, useEffect} from 'react';
import {FlatList} from 'react-native';
import Separator from '../Separator';
import SuggestionItem from './SuggestionItem';
import moment from 'moment';
import finance from '~/Util/finance';

const Suggestion = ({symbol, closeModal = () => {}, navigation, visible, headerComponent = () => null, closeSearch = () => {}, ...props}) => {
  const [suggestion, setSuggestion] = useState([]);

  const getSuggestion = React.useCallback(async() => {
    const results = await finance.symbolSuggest(symbol);
    // console.log('result => ',results);
    setSuggestion(
      results?.filter(
        (result) =>
          result.typeDisp === 'Equity' || result.typeDisp === 'ETF',
      ),
    );
  }, [symbol]);

  useEffect(() => {
    if(!symbol || !visible) {
      return;
    }
    getSuggestion();
  }, [symbol])

  useEffect(() => {
    if(!visible) {
      setSuggestion([]);
    }
  },[visible])

  const renderItem = useCallback(({item}) => {
    return (
      <SuggestionItem
        item={item}
        navigation={navigation}
        closeSearch={closeSearch}
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
      // style={{maxHeight: 300}}
      data={suggestion}
      renderItem={renderItem}
      keyExtractor={renderKeyExtractor}
      ItemSeparatorComponent={renderSeparator}
      ListHeaderComponent={headerComponent}
    />
  );
};

export default Suggestion;
