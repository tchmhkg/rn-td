import React, {useRef} from 'react';
import Styled from 'styled-components/native';
import {StyleSheet, ScrollView, Switch, FlatList} from 'react-native';
import {useTheme} from '~/Theme';
import {useLocale} from '~/I18n';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import Button from '~/Component/Button';

const languages = ['en', 'zh-hk'];

const Container = Styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  background: ${(props) => props.theme.background};
`;

const Label = Styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 28px;
  margin: 0 15px;
  font-weight: bold;
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
`;

const Setting = () => {
  const theme = useTheme();
  const {setLocale, t, locale} = useLocale();
  const bottomSheetRef = useRef(null);

  const onPressLanguage = (lang) => {
    if (!lang) {
      return;
    }
    bottomSheetRef.current.close();
    setTimeout(() => {
      setLocale(lang);
    }, 200);
  };

  const openBottomSheet = () => {
    bottomSheetRef.current.open();
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

  const renderContent = () => {
    return (
      <FlatList
        data={languages}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    );
  };

  return (
    <Container>
      <Label>{t('Setting')}</Label>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Row>
          <ItemLebel>{t('Dark Mode')}</ItemLebel>
          <Switch
            value={theme.mode === 'dark'}
            onValueChange={(value) => theme.setMode(value ? 'dark' : 'light')}
          />
        </Row>
        <Row>
          <ItemLebel>{t('Languages')}</ItemLebel>
          <TouchableOpacity onPress={openBottomSheet}>
            <LangButtonText>{t(locale)}</LangButtonText>
          </TouchableOpacity>
        </Row>
      </ScrollView>
      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown
        customStyles={{
          container: {
            backgroundColor: theme.colors.background,
            height: 170,
          },
        }}>
        {renderContent()}
      </RBSheet>
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
