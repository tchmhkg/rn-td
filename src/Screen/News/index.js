import React, {useRef, useState} from 'react';
import {FlatList, RefreshControl, StatusBar, StyleSheet, Dimensions} from 'react-native';
import Styled from 'styled-components/native';

// import NewsRow from '~/Component/News/Row';
// import Spinner from '~/Component/Spinner';
import {useTheme} from '~/Theme';
import PickerModal from '~/Component/News/PickerModal';
import {useLocale} from '~/I18n';
import {NEWS_CATEGORIES, NEWS_COUNTRIES} from '~/Helper/constraint';
// import {useNewsApi} from '~/Hook';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import NewsList from '~/Component/News/List';

const Label = Styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.text};
`;

const FilterWrapper = Styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const FilterItemWrapper = Styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const SelectedFilter = Styled.TouchableOpacity`
  flex: 1;
  margin-left: 10px;
  padding: 10px;
  border-width: 1px;
  border-color: ${(props) => props.theme.border};
  justify-content: center;
  align-items: center;
`;

const Container = Styled.SafeAreaView`
  flex: 1;
  background: ${(props) => props.theme.background};
`;

function News(props) {
  const countryPickerRef = useRef(null);
  const theme = useTheme();
  const {t} = useLocale();
  const [country, setCountry] = useState('hk');
  const [prevCountry, setPrevCountry] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const routes = NEWS_CATEGORIES.map((cate, idx) => ({key: cate, title: t(cate), index: idx}));

  const openCountryPicker = () => {
    countryPickerRef.current?.open();
  };

  const handleChangeCountry = (cty) => {
    setPrevCountry(country);
    setCountry(cty);
  };

  const _handleIndexChange = (index) => setTabIndex(index);

  const renderScene = ({route}) => {
    switch (route.key) {
      default:
        return <NewsList category={route.key} prevCountry={prevCountry} country={country} index={route.index} currentIndex={tabIndex} />;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      scrollEnabled
      tabStyle={{width: 'auto'}}
      indicatorStyle={{backgroundColor: theme.colors.primary}}
      labelStyle={{color: theme.colors.text}}
      style={{backgroundColor: theme.colors.background}}
    />
  );

  return (
    <>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Container>
        <FilterWrapper>
          <FilterItemWrapper>
            <Label>{t('Country')}:</Label>
            <SelectedFilter
              onPress={openCountryPicker}
              style={styles.leftFilterButton}>
              <Label numberOfLines={1}>{t(country.toUpperCase())}</Label>
            </SelectedFilter>
          </FilterItemWrapper>
        </FilterWrapper>
        <TabView
            lazy
            navigationState={{index: tabIndex, routes}}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={_handleIndexChange}
            initialLayout={{width: Dimensions.get('window').width}}
            style={styles.container}
          />
      </Container>
      <PickerModal
        ref={countryPickerRef}
        data={NEWS_COUNTRIES}
        selectedValue={country}
        onValueChange={handleChangeCountry}
      />
    </>
  );
}

const styles = StyleSheet.create({
  leftFilterButton: {
    marginRight: 10,
  },
});

export default News;
