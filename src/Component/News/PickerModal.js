import React, {useState, forwardRef} from 'react';
import {StyleSheet, Pressable, Dimensions} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import Styled from 'styled-components/native';
import {Picker} from '@react-native-community/picker';

import {useLocale} from '~/I18n';
import {useTheme} from '~/Theme';

const {width} = Dimensions.get('window');

const Container = Styled.View`
  flex: 1;
  padding: 15px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.background};
`;

const ActionsRow = Styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.backgroundAlt};
`;

const ActionLabel = Styled.Text`
  font-size: 18px;
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
  color: ${(props) => props.theme.primary};
  opacity: ${(props) => (props.pressed ? 0.2 : 1)}
`;

const PickerModal = forwardRef(({selectedValue, onValueChange, data}, ref) => {
  const {t} = useLocale();
  const theme = useTheme();
  const [currentValue, setCurrentValue] = useState(selectedValue);

  const closeModal = () => {
    resetPicker();
    ref.current?.close();
  };

  const resetPicker = () => {
    setCurrentValue(selectedValue);
  };

  const onPressDone = () => {
    if (currentValue !== selectedValue) {
      onValueChange(currentValue);
    }
    ref.current?.close();
  };

  return (
    <Portal>
      <Modalize
        ref={ref}
        adjustToContentHeight
        withHandle={false}
        modalStyle={{
          backgroundColor: theme.colors.background,
        }}
        handleStyle={{backgroundColor: theme.colors.text, opacity: 0.7}}
        onOverlayPress={resetPicker}>
        <>
          <ActionsRow>
            <Pressable
              style={styles.pressable}
              onPress={closeModal}
              hitSlop={1150}>
              {({pressed}) => (
                <ActionLabel pressed={pressed}>{t('Close')}</ActionLabel>
              )}
            </Pressable>
            <Pressable
              style={styles.pressable}
              onPress={onPressDone}
              hitSlop={15}>
              {({pressed}) => (
                <ActionLabel pressed={pressed} bold>
                  {t('Done')}
                </ActionLabel>
              )}
            </Pressable>
          </ActionsRow>
          <Container>
            <Picker
              selectedValue={currentValue}
              style={{height: 150, width, marginBottom: 60}}
              itemStyle={{color: theme.colors.text}}
              onValueChange={(itemValue, itemIndex) =>
                setCurrentValue(itemValue)
              }>
              {data.map((cate) => (
                <Picker.Item
                  key={cate}
                  label={t(cate?.toUpperCase())}
                  value={cate?.toLowerCase()}
                />
              ))}
            </Picker>
          </Container>
        </>
      </Modalize>
    </Portal>
  );
});

const styles = StyleSheet.create({
  pressable: {
    padding: 15,
    marginHorizontal: 5,
  },
});

export default PickerModal;
