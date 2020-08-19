import React, {useState, forwardRef} from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import Styled from 'styled-components/native';
import {Picker} from '@react-native-community/picker';

import {useLocale} from '~/I18n';
import {useTheme} from '~/Theme';

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
  font-size: 16px;
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
  color: ${(props) => props.theme.primary};
  opacity: ${(props) => (props.pressed ? 0.2 : 1)}
`;

const CATEGORIES = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
];

const CategoryPicker = forwardRef(({category, setCategory, ...props}, ref) => {
  const {t} = useLocale();
  const theme = useTheme();
  const [currentCategory, setCurrentCategory] = useState(category);

  const closeModal = () => {
    ref.current.close();
  };

  const onPressDone = () => {
    setCategory(currentCategory);
    ref.current.close();
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
        handleStyle={{backgroundColor: theme.colors.text, opacity: 0.7}}>
        <>
          <ActionsRow>
            <Pressable
              style={styles.pressable}
              onPress={closeModal}
              hitSlop={10}>
              {({pressed}) => (
                <ActionLabel pressed={pressed}>Close</ActionLabel>
              )}
            </Pressable>
            <Pressable
              style={styles.pressable}
              onPress={onPressDone}
              hitSlop={10}>
              {({pressed}) => (
                <ActionLabel pressed={pressed} bold>
                  Done
                </ActionLabel>
              )}
            </Pressable>
          </ActionsRow>
          <Container>
            <Picker
              selectedValue={currentCategory}
              style={{height: 150, width: 300}}
              itemStyle={{color: theme.colors.text}}
              onValueChange={(itemValue, itemIndex) =>
                setCurrentCategory(itemValue)
              }>
              {CATEGORIES.map((cate) => (
                <Picker.Item key={cate} label={t(cate)} value={cate} />
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

export default CategoryPicker;
