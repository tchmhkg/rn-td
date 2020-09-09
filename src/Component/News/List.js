import React, {useRef, useEffect} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import NewsRow from '~/Component/News/Row';
import Spinner from '~/Component/Spinner';
import {useTheme} from '~/Theme';
import {useNewsApi} from '~/Hook';

function News({country, category, index, currentIndex, prevCountry}) {
  const flatListRef = useRef(null);
  const theme = useTheme();
  const [
    {data, isLoading, totalCount, page, isRefreshing},
    setPage,
    setIsRefreshing,
  ] = useNewsApi(country, category, prevCountry, index, currentIndex);

//   useEffect(() => {
//     if(!isLoading) {
//         handleRefresh();
//         if(page > 1){
//             flatListRef.current?.scrollToIndex({animated: true, index: 0});
//         }
//     }
//   }, [country])

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

  return (
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
  );
}

export default React.memo(News);
