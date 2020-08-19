import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, StatusBar} from 'react-native';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import Styled from 'styled-components/native';

import NewsRow from '~/Component/News/Row';
import {HK_NEWS_API} from '~/Util/apiUrls';
import Spinner from '~/Component/Spinner';
import {useTheme} from '~/Theme';

// const Label = Styled.Text`
//   color: ${(props) => props.theme.text};
// `;

// const LabelWrapper = Styled.View`
//   flex-direction: row;
//   justify-content: space-around;
// `;

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
  const theme = useTheme();

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
    return <Spinner />;
  };

  return (
    <>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Container>
        {/* <LabelWrapper>
          <Label>Fetched News: {news.length}</Label>
          <Label>Total News: {totalCount}</Label>
        </LabelWrapper> */}
        <FlatList
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
    </>
  );
}

export default News;
