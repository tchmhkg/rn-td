import React, {useEffect, useState, useRef} from 'react';
import {FlatList, RefreshControl, StatusBar, StyleSheet} from 'react-native';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import Styled from 'styled-components/native';

import NewsRow from '~/Component/News/Row';
import {HK_NEWS_API} from '~/Util/apiUrls';
import Spinner from '~/Component/Spinner';
import {useTheme} from '~/Theme';
import PickerModal from '~/Component/News/PickerModal';
import {useLocale} from '~/I18n';
import {NEWS_CATEGORIES, NEWS_COUNTRIES} from '~/Helper/constraint';

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
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [category, setCategory] = useState('general');
  const [country, setCountry] = useState('hk');
  const categoryPickerRef = useRef(null);
  const countryPickerRef = useRef(null);
  const flatListRef = useRef(null);
  const theme = useTheme();
  const {t} = useLocale();

  const fetchNews = () => {
    setIsLoading(true);

    setTimeout(() => {
      axios
        .get(HK_NEWS_API, {
          params: {
            country,
            page,
            category,
            pageSize: 15,
          },
        })
        .then((res) => {
          const data = res.data?.articles || [];
          setNews(page === 1 ? data : [...news, ...data]);
          setTotalCount(res.data?.totalResults);
          setIsRefreshing(false);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsRefreshing(false);
          setIsLoading(false);
          showMessage({
            message: err.response?.data?.message,
            type: 'danger',
            icon: 'auto',
            duration: 2000,
          });
          console.log(err.response);
        });
    }, 100);
  };

  useEffect(() => {
    if (!isLoading) {
      fetchNews();
    }
  }, [page, category, country]);

  useEffect(() => {
    if (isRefreshing) {
      fetchNews();
    }
  }, [isRefreshing]);

  const renderItem = ({item}) => {
    return <NewsRow item={item} />;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (isLoading || news.length >= totalCount) {
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
          data={news}
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
