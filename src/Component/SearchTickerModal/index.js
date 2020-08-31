import React, {useState, forwardRef} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import Styled from 'styled-components/native';
import Button from '~/Component/Button';
import TickerPreview from '~/Component/Stock/Preview';
import {useLocale} from '~/I18n';
import {useTheme} from '~/Theme';
import finance from '~/Util/finance';
import Separator from '~/Component/Separator';
import SuggestionItem from './SuggestionItem';

const Container = Styled.SafeAreaView`
  flex: 1;
  padding: 15px;
  background: ${(props) => props.theme.background};
`;

const Input = Styled.TextInput`
  border-width: 1px;
  padding: 10px;
  margin-horizontal: 10px;
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.theme.text};
  border-color: ${(props) => props.theme.border};
`;

const SearchTickerModal = forwardRef(({...props}, ref) => {
  const navigation = useNavigation();
  const [ticker, setTicker] = useState('');
  const [submittedTicker, setSubmittedTicker] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [suggestion, setSuggestion] = useState([]);
  const {t} = useLocale();
  const theme = useTheme();

  const onPressSubmit = (symbol) => {
    if (!symbol) {
      return;
    }
    setSubmittedTicker(symbol);
    setSubmitted(true);
  };

  const closeModal = () => {
    ref.current.close();
  };

  const resetInput = () => {
    setTicker('');
    setSubmittedTicker('');
  };

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

  const getSuggestion = (symbol) => {
    setTicker(symbol);
    finance
      .symbolSuggest(symbol)
      .then((response) => response.text())
      .then((result) => {
        result = result.replace(
          /(YAHOO\.util\.ScriptNodeDataSource\.callbacks\()(.*)(\);)/g,
          '$2',
        );
        console.log(result);
        return JSON.parse(result);
      })
      .then((json) => {
        setSuggestion(json.ResultSet.Result);
      })
      .catch((error) => {
        console.log('Request failed', error);
      });
  };

  return (
    <Portal>
      <Modalize
        ref={ref}
        // adjustToContentHeight
        keyboardAvoidingOffset={30}
        handlePosition="inside"
        modalStyle={{
          paddingTop: 25,
          backgroundColor: theme.colors.background,
        }}
        handleStyle={{backgroundColor: theme.colors.text, opacity: 0.7}}
        onClosed={resetInput}>
        <>
          <Container>
            <View style={styles.inputWrapper}>
              <Input
                onChangeText={getSuggestion}
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="done"
                // value={ticker}
                autoFocus
              />
            </View>
            <FlatList
              data={suggestion}
              extraData={ticker}
              renderItem={renderItem}
              keyExtractor={(item) => item.symbol}
              ItemSeparatorComponent={renderSeparator}
            />
            <Button label={t('Search')} onPress={onPressSubmit} />
            {submitted && submittedTicker ? (
              <TickerPreview
                ticker={submittedTicker}
                closeModal={closeModal}
                navigation={navigation}
              />
            ) : null}
          </Container>
        </>
      </Modalize>
    </Portal>
  );
});

const styles = StyleSheet.create({
  inputWrapper: {
    paddingVertical: 10,
    marginBottom: 20,
  },
});

export default SearchTickerModal;
