import React, {useRef} from 'react';
import {FlatList, RefreshControl, StatusBar, StyleSheet} from 'react-native';
import Styled from 'styled-components/native';

import NewsRow from '~/Component/News/Row';
import Spinner from '~/Component/Spinner';
import {useTheme} from '~/Theme';
import PickerModal from '~/Component/News/PickerModal';
import {useLocale} from '~/I18n';
import {NEWS_CATEGORIES, NEWS_COUNTRIES} from '~/Helper/constraint';
import {useNewsApi} from '~/Hook';

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
  const categoryPickerRef = useRef(null);
  const countryPickerRef = useRef(null);
  const flatListRef = useRef(null);
  const theme = useTheme();
  const {t} = useLocale();
  const [
    {data, isLoading, totalCount, page, country, category, isRefreshing},
    setPage,
    setCategory,
    setCountry,
    setIsRefreshing,
  ] = useNewsApi();

  const renderItem = ({item}) => {
    return <NewsRow item={item} />;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (isLoading || data.length >= totalCount) {
      return false;
    }
    setPage(page + 1);
  };

  const renderFooter = () => {
    if (!isLoading || isRefreshing) {
      return null;
    }
    return <Spinner />;
  };

  const openCategoryPicker = () => {
    categoryPickerRef.current?.open();
  };

  const openCountryPicker = () => {
    countryPickerRef.current?.open();
  };

  const handleChangeCategory = (cate) => {
    setCategory(cate);
    handleRefresh();
    flatListRef.current?.scrollToIndex({animated: true, index: 0});
  };

  const handleChangeCountry = (cty) => {
    setCountry(cty);
    handleRefresh();
    flatListRef.current?.scrollToIndex({animated: true, index: 0});
  };

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
          <FilterItemWrapper>
            <Label>{t('Category')}:</Label>
            <SelectedFilter onPress={openCategoryPicker}>
              <Label numberOfLines={1}>{t(category.toUpperCase())}</Label>
            </SelectedFilter>
          </FilterItemWrapper>
        </FilterWrapper>
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          keyExtractor={(item) => item.title}
          onEndReachedThreshold={0.1}
          onEndReached={handleLoadMore}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.text}
              colors={[theme.colors.text]}
            />
          }
        />
      </Container>
      <PickerModal
        ref={categoryPickerRef}
        data={NEWS_CATEGORIES}
        selectedValue={category}
        onValueChange={handleChangeCategory}
      />
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
