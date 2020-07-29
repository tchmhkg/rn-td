import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';

import NewsRow from '~/Component/News/Row';
import {HK_NEWS_API} from '~/Util/apiUrls';
import {useTheme} from '@react-navigation/native';

function News() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {colors} = useTheme();

  const fetchNews = () => {
    setIsLoading(true);

    setTimeout(() => {
      axios
        .get(HK_NEWS_API, {
          params: {
            country: 'hk',
            page,
            category: 'technology',
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
  }, [page]);

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
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <Text style={{color: colors.text}}>Fetched News: {news.length}</Text>
          <Text style={{color: colors.text}}>Total News: {totalCount}</Text>
        </View>
        <FlatList
          data={news}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          keyExtractor={(item) => item.title}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          onEndReachedThreshold={0.1}
          onEndReached={handleLoadMore}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  loadingWrapper: {
    paddingVertical: 20,
  },
});

export default News;
