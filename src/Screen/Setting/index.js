import React, {useRef, useEffect, useState} from 'react';
import Styled from 'styled-components/native';
import {StyleSheet, ScrollView, Switch, Pressable, View} from 'react-native';
import {useTheme} from '~/Theme';
import {useLocale} from '~/I18n';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useIsFocused} from '@react-navigation/native';
import {Transitioning, Transition} from 'react-native-reanimated';
import DarkModeSwitch from '~/Component/Button/DarkModeSwitch';

const languages = ['en', 'zh-hk'];

const Container = Styled(Transitioning.View)`
  flex: 1;
  justify-content: center;
  background-color: #fafafa;
`;

const Row = Styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 0 0 10px 0;
  background-color: ${(props) => props.theme.border};
  min-height: 50px;
`;

const ItemLebel = Styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 16px;
`;

const LangButton = Styled.TouchableOpacity`
  background-color: ${(props) =>
    props.selected ? props.theme.border : 'transparent'};
  padding: 15px;
  justify-content: center;
  align-items: center;
  margin: 5px 10px;
`;

const LangButtonText = Styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 16px;
  opacity: ${(props) => (props.pressed ? 0.2 : 1)}
`;

const Setting = () => {
  const ref = useRef(null);
  const theme = useTheme();
  const [screenIsFocused, setScreenIsFocused] = useState(false);
  const {setLocale, t, locale} = useLocale();
  const bottomSheetRef = useRef(null);
  const isFocused = useIsFocused();

  const transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={80} />
      <Transition.Out type="fade" durationMs={80} />
    </Transition.Together>
  );

  useEffect(() => {
    setScreenIsFocused(isFocused);
  }, [isFocused]);

  const onPressLanguage = (lang) => {
    if (!lang) {
      return;
    }
    bottomSheetRef.current?.close();
    setTimeout(() => {
      setLocale(lang);
    }, 200);
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.open();
  };

  const renderItem = ({item}) => {
    return (
      <LangButton
        selected={item === locale}
        onPress={() => onPressLanguage(item)}>
        <LangButtonText>{t(item)}</LangButtonText>
      </LangButton>
    );
  };

  return (
    <Container {...{ref, transition}}>
      {theme.mode === 'dark' && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: theme.colors.background,
          }}
        />
      )}
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Row>
          <ItemLebel>{t('Dark Mode')}</ItemLebel>
          <DarkModeSwitch
            handleOnPress={(value) => {
              if (ref.current) {
                ref.current.animateNextTransition();
              }
              theme.setMode(value ? 'dark' : 'light');
            }}
            activeTrackColor={theme.colors.primary}
            value={theme.mode === 'dark'}
          />
        </Row>
        <Row>
          <ItemLebel>{t('Languages')}</ItemLebel>
          <Pressable onPress={openBottomSheet} hitSlop={10}>
            {({pressed}) => (
              <LangButtonText pressed={pressed}>{t(locale)}</LangButtonText>
            )}
          </Pressable>
        </Row>
      </ScrollView>
      <Portal>
        <Modalize
          ref={bottomSheetRef}
          modalHeight={170}
          flatListProps={{
            data: languages,
            keyExtractor: (item) => item,
            renderItem: renderItem,
            scrollEnabled: false,
          }}
          handlePosition="inside"
          modalStyle={{
            paddingTop: 25,
            backgroundColor: theme.colors.background,
          }}
          handleStyle={{backgroundColor: theme.colors.text, opacity: 0.7}}
        />
      </Portal>
    </Container>
  );
};

const styles = StyleSheet.create({
  settingItemRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollView: {
    padding: 15,
  },
});

export default Setting;
