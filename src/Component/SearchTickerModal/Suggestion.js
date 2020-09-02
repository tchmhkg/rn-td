import React, {useState, useCallback, useEffect} from 'react';
import {FlatList} from 'react-native';
import Separator from '../Separator';
import SuggestionItem from './SuggestionItem';
import moment from 'moment';
import finance from '~/Util/finance';

const Suggestion = ({symbol, closeModal, navigation}) => {
  const [suggestion, setSuggestion] = useState([]);

  const getSuggestion = () => {
    finance
      .symbolSuggest(symbol)
      .then((response) => response.text())
      .then((result) => {
        result = result.replace(
          /(YAHOO\.util\.ScriptNodeDataSource\.callbacks\()(.*)(\);)/g,
          '$2',
        );
        // console.log(result);
        return JSON.parse(result);
      })
      .then((json) => {
        setSuggestion(
          json?.ResultSet?.Result?.filter(
            (result) =>
              result.typeDisp === 'Equity' || result.typeDisp === 'ETF',
          ),
        );
      })
      .catch((error) => {
        console.log('Request failed', error);
      });
  };

  useEffect(() => {
    if(!symbol) {
      return;
    }
    getSuggestion();
  }, [symbol])

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
      style={{maxHeight: 300}}
      data={suggestion}
      renderItem={renderItem}
      keyExtractor={renderKeyExtractor}
      ItemSeparatorComponent={renderSeparator}
    />
  );
};

export default Suggestion;
