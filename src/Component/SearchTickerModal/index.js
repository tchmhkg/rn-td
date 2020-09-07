import React, {useState, forwardRef, useCallback, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, FlatList, KeyboardAvoidingView, Keyboard} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import Styled from 'styled-components/native';
import Button from '~/Component/Button';
import TickerPreview from '~/Component/Stock/Preview';
import {useLocale} from '~/I18n';
import {useTheme} from '~/Theme';
import Separator from '~/Component/Separator';
import Suggestion from './Suggestion';
import SuggestionItem from './SuggestionItem';
import ActionSheet from 'react-native-actions-sheet';
import BottomSheet from '../BottomSheet';
import RBSheet from 'react-native-raw-bottom-sheet';
import finance from '~/Util/finance';
import moment from 'moment';
import {SwipeablePanel} from 'rn-swipeable-panel';

const Container = Styled.View`
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

const SearchTickerModal = forwardRef(({ticker, setTicker, ...props}, ref) => {
  const navigation = useNavigation();
  const [suggestion, setSuggestion] = useState([]);
  const {colors} = useTheme();
  const isFocused = useIsFocused();

  // const [ticker, setTicker] = useState('');
  // const [submittedTicker, setSubmittedTicker] = useState('');
  // const [submitted, setSubmitted] = useState(false);
  // const {t} = useLocale();
  // const theme = useTheme();

  // const onPressSubmit = (symbol) => {
  //   if (!symbol) {
  //     return;
  //   }
  //   setSubmittedTicker(symbol);
  //   setSubmitted(true);
  // };

  const closeModal = () => {
    props.onDismiss();
    // ref.current.setModalVisible(false);
  };

  // const openModal = () => {
  //   ref.current?.open();
  // };

  // const resetInput = () => {
  //   setTicker('');
  //   setSubmittedTicker('');
  //   // setSuggestion([]);
  // };

  // useEffect(() => {
  //   if (!ticker) {
  //     return;
  //   }
  //   getSuggestion();
  // }, [ticker]);

  const getSuggestion = () => {
    finance
      .symbolSuggest(ticker)
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

  const renderHeader = () => {
    return (
      <View style={styles.inputWrapper}>
        <Input
          onChangeText={setTicker}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
          // value={ticker}
          autoFocus
        />
      </View>
    );
  };

  return (
    <Portal>
      <SwipeablePanel
        ref={ref}
        fullWidth
        isActive={props.visible}
        isFocused={isFocused}
        // openLarge
        closeOnTouchOutside
        onClose={props.onDismiss}
        style={{backgroundColor: colors.background}}
        >
        <Container>
          <View style={styles.inputWrapper}>
            <Input
              onChangeText={setTicker}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>
          <Suggestion
            symbol={ticker}
            closeModal={closeModal}
            navigation={navigation}
            visible={props.visible}
          />
        </Container>
      </SwipeablePanel>
    </Portal>
  );

  // return (
  //   <Portal>
  //     <ActionSheet ref={ref} bounceOnOpen gestureEnabled>
  //       <Container>
  //         <View style={styles.inputWrapper}>
  //           <Input
  //             onChangeText={setTicker}
  //             autoCapitalize="characters"
  //             autoCorrect={false}
  //             returnKeyType="done"
  //             // value={ticker}
  //             // autoFocus
  //           />
  //         </View>
  //         <Suggestion
  //           symbol={ticker}
  //           closeModal={closeModal}
  //           navigation={navigation}
  //         />
  //       </Container>
  //     </ActionSheet>
  //   </Portal>
  // );
});

const styles = StyleSheet.create({
  inputWrapper: {
    paddingVertical: 10,
    marginTop: 20,
  },
});

export default SearchTickerModal;
