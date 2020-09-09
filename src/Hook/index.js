import {useState, useEffect} from 'react';
import axios from 'axios';
import {HK_NEWS_API} from '~/Util/apiUrls';
import {showMessage} from 'react-native-flash-message';

export const useNewsApi = (country = 'hk', category = 'general', prevCountry, index, currentIndex) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  // const [category, setCategory] = useState('general');
  // const [country, setCountry] = useState('hk');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!isLoading && index === currentIndex && prevCountry !== country) {
      fetchData();
    }
  }, [page, category, prevCountry, country, index, currentIndex]);

  useEffect(() => {
    if (isRefreshing) {
      fetchData();
    }
  }, [isRefreshing]);

  const fetchData = async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const res = await axios.get(HK_NEWS_API, {
        params: {
          country,
          page,
          category,
          pageSize: 15,
        },
      });

      const resData = res.data?.articles || [];
      console.log(res);
      setData(page === 1 ? resData : [...data, ...resData]);
      setTotalCount(res.data?.totalResults);
      setIsRefreshing(false);
      setIsLoading(false);
    } catch (error) {
      setIsRefreshing(false);
      setIsError(true);
      showMessage({
        message: error.response?.data?.message,
        type: 'danger',
        icon: 'auto',
        duration: 2000,
      });
    }
    setIsLoading(false);
  };

  return [
    {
      data,
      isLoading,
      isError,
      totalCount,
      page,
      // country,
      // category,
      isRefreshing,
    },
    setPage,
    // setCategory,
    // setCountry,
    setIsRefreshing,
  ];
};
