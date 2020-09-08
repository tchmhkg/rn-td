import React, {useState, useCallback, useEffect} from 'react';
import {FlatList} from 'react-native';
import Separator from '../Separator';
import SuggestionItem from './SuggestionItem';
import moment from 'moment';
import finance from '~/Util/finance';

const Suggestion = ({symbol, closeModal, navigation, visible, headerComponent = () => {}, ...props}) => {
  const [suggestion, setSuggestion] = useState([]);

  const getSuggestion = React.useCallback(() => {
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
        // props.openModal();
      })
      .catch((error) => {
        console.log('Request failed', error);
      });
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
