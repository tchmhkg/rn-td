import React, {forwardRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {Portal} from 'react-native-portalize';
import {SwipeablePanel} from 'rn-swipeable-panel';
import Styled from 'styled-components/native';
import {useTheme} from '~/Theme';
import Suggestion from './Suggestion';

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
  const {colors} = useTheme();
  const isFocused = useIsFocused();
  const closeModal = () => {
    props.onDismiss();
    // ref.current.setModalVisible(false);
  };

  const renderHeader = React.useCallback(() => {
    return (
      <View style={styles.inputWrapper}>
        <Input
          onChangeText={setTicker}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
          // value={ticker}
        />
      </View>
    );
  }, []);

  return (
    <Portal>
      <SwipeablePanel
        ref={ref}
        fullWidth
        isActive={props.visible}
        isFocused={isFocused}
        flatList
        closeOnTouchOutside
        onClose={props.onDismiss}
        style={{backgroundColor: colors.background}}>
        <Container>
          <Suggestion
            symbol={ticker}
            closeModal={closeModal}
            navigation={navigation}
            visible={props.visible}
            headerComponent={renderHeader}
          />
        </Container>
      </SwipeablePanel>
    </Portal>
  );
});

const styles = StyleSheet.create({
  inputWrapper: {
    paddingVertical: 10,
    marginTop: 20,
  },
});

export default SearchTickerModal;
