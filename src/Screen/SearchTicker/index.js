import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Styled from 'styled-components/native';
import Button from '~/Component/Button';
import { useLocale } from '~/I18n';

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

function SearchTicker() {
  const navigation = useNavigation();
  const [ticker, setTicker] = useState('');
  const {t} = useLocale();

  const onPressSubmit = () => {
    if (!ticker) {
      return;
    }
    navigation.pop();
    navigation.navigate('Stock', {ticker});
  };

  return (
    <>
      <Container>
        <View style={styles.inputWrapper}>
          <Input
            onChangeText={setTicker}
            autoCapitalize="characters"
            autoCorrect={false}
            value={ticker}
            autoFocus
          />
        </View>
        <Button label={t('Search')} onPress={onPressSubmit} />
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    paddingVertical: 10,
  },
});

export default SearchTicker;
