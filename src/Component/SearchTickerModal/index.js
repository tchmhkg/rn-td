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
import Suggestion from './Suggestion';
import ActionSheet from 'react-native-actions-sheet';
import BottomSheet from '../BottomSheet';

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

  // const resetInput = () => {
  //   setTicker('');
  //   setSubmittedTicker('');
  //   // setSuggestion([]);
  // };
  return (
    <BottomSheet visible={props.visible} onDismiss={props.onDismiss}>
      <Container>
        <View style={styles.inputWrapper}>
          <Input
            onChangeText={setTicker}
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="done"
            // value={ticker}
            // autoFocus
          />
        </View>
        <Suggestion
          symbol={ticker}
          closeModal={closeModal}
          navigation={navigation}
        />
      </Container>
    </BottomSheet>
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
    marginBottom: 20,
  },
});

export default SearchTickerModal;
