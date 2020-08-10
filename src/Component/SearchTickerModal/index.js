import React, {useState, forwardRef} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import Styled from 'styled-components/native';
import Button from '~/Component/Button';
import TickerPreview from '~/Component/Stock/Preview';
import {useLocale} from '~/I18n';
import {useTheme} from '~/Theme';

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
  const {t} = useLocale();
  const theme = useTheme();

  const onPressSubmit = () => {
    if (!ticker) {
      return;
    }
    setSubmittedTicker(ticker);
    setSubmitted(true);
  };

  const closeModal = () => {
    ref.current.close();
  };

  const resetInput = () => {
    setTicker('');
    setSubmittedTicker('');
  };

  return (
    <Portal>
      <Modalize
        ref={ref}
        adjustToContentHeight
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
                onChangeText={setTicker}
                autoCapitalize="characters"
                autoCorrect={false}
                // value={ticker}
                autoFocus
              />
            </View>
            <Button label={t('Search')} onPress={onPressSubmit} />
            {submitted && submittedTicker ? (
              <TickerPreview ticker={submittedTicker} closeModal={closeModal} />
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
  },
});

export default SearchTickerModal;
