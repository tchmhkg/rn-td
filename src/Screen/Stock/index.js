import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-community/async-storage';
import {useRoute, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import LatestPrice from '~/Component/LatestPrice';
import {getAdvancedStatsApi, CANDLES_API} from '~/Util/apiUrls';
import {IEX_SANDBOX_API_KEY, FINNHUB_API_KEY} from '~/Util/config';
import {useTheme} from '~/Theme';
import Styled from 'styled-components/native';
import {useLocale} from '~/I18n';
import Spinner from '~/Component/Spinner';
import CandleChart from '~/Component/Chart/CandleChart';
import LineChart from '~/Component/Chart/LineChart';
import {TabView, TabBar} from 'react-native-tab-view';
import IconButton from '~/Component/IconButton';
import finance from '~/Util/finance';
import NewsItem from '~/Component/Stock/NewsItem';
import Separator from '~/Component/Separator';
import LottieView from 'lottie-react-native';
import LottieFav from '~/Component/IconButton/LottieFav';

const CompanyName = Styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 22px;
  font-weight: bold;
`;

export default function Stock() {
  const route = useRoute();
  const navigation = useNavigation();
  const {ticker} = route.params;
  const [selectedStock, setSelectedStock] = useState({data: [], info: null});
  const [loading, setLoading] = useState(true);
  const {data, info} = selectedStock;
  const chartRef = useRef(null);
  const lineChartRef = useRef(null);
  const {colors} = useTheme();
  const [saved, setSaved] = useState(false);
  const {t, locale} = useLocale();
  const [tabIndex, setTabIndex] = useState(0);
  const [news, setNews] = useState([]);
  const heartRef = useRef(null);

  const routes = [
    {key: 'candleStick', title: t('CandleStick Chart')},
    {key: 'line', title: t('Line Chart')},
  ];

  const onPressSaveSymbol = async () => {
    try {
      const existing = await AsyncStorage.getItem('symbols');

      const existingJson = existing ? JSON.parse(existing) : [];
      const isExisted = _.find(existingJson, ['symbol', ticker]);
      if (isExisted) {
        showMessage({
          message: t('Saved already!'),
          type: 'warning',
          icon: 'auto',
          duration: 2000,
        });
        return;
      }
      const newList = [
        ...existingJson,
        {id: moment().unix(), name: info['companyName'], symbol: ticker},
      ];

      await AsyncStorage.setItem('symbols', JSON.stringify(newList));
      setSaved(true);
      heartRef?.current?.play();
    } catch (e) {
      console.log(e);
      showMessage({
        message: t('Something went wrong!'),
        type: 'danger',
        icon: 'auto',
        duration: 2000,
      });
    }
  };

  const onPressRemoveSymbol = async () => {
    try {
      const existing = await AsyncStorage.getItem('symbols');

      const existingJson = existing ? JSON.parse(existing) : [];
      const newList = _.filter(
        existingJson,
        (stock) => stock.symbol !== ticker,
      );

      await AsyncStorage.setItem('symbols', JSON.stringify(newList));
      setSaved(false);
      heartRef?.current?.reset();
    } catch (e) {
      console.log(e);
      showMessage({
        message: 'Something went wrong!',
        type: 'danger',
        icon: 'auto',
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    const getNews = async () => {
      const news = await finance.getNews(ticker);
      //  console.log('news',news);
      setNews(news);
    };
    getNews();
  }, []);

  useEffect(() => {
    const getStatusFromStorage = async () => {
      const existing = await AsyncStorage.getItem('symbols');

      const existingJson = existing ? JSON.parse(existing) : [];
      const isExisted = _.find(existingJson, ['symbol', ticker]);
      setSaved(isExisted);
    };
    getStatusFromStorage();
  }, []);

  useEffect(() => {
    fetchStock();
  }, [ticker]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStock();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchStock = async () => {
    try {
      if (!ticker) {
        return;
      }
      // setLoading(true);
      const res = await axios.get(CANDLES_API, {
        params: {
          symbol: ticker.toUpperCase(),
          from: moment().subtract(1, 'years').format('X'),
          to: moment().unix(),
          resolution: 'D',
          token: FINNHUB_API_KEY,
        },
      });
      const infoRes = await axios.get(getAdvancedStatsApi(ticker), {
        params: {
          token: IEX_SANDBOX_API_KEY,
        },
      });
      // console.log(res)
      setSelectedStock({
        data: res.data,
        info: {...infoRes.data, symbol: ticker.toUpperCase()},
      });
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      setLoading(false);
      showMessage({
        message: error.response?.data,
        type: 'danger',
        icon: 'auto',
        duration: 2000,
      });
      if (error?.response?.status === 404) {
        navigation.pop();
      }
    }
  };

  const _handleIndexChange = (index) => setTabIndex(index);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'candleStick':
        return <CandleChart ref={chartRef} data={data} />;
      case 'line':
        return <LineChart ref={lineChartRef} data={data} ticker={ticker} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: colors.primary}}
      labelStyle={{color: colors.text}}
      style={{backgroundColor: colors.background}}
    />
  );

  const onPressClose = () => {
    navigation.pop();
  };

  const renderItem = useCallback(({item}) => {
    return <NewsItem item={item} navigation={navigation} />;
  }, []);

  const renderSeparator = React.memo(() => {
    return <Separator />;
  });

  const renderKeyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={[styles.container, {backgroundColor: colors?.background}]}>
      <IconButton
        style={{alignSelf: 'flex-end'}}
        iconName="cancel"
        color={colors?.inactiveLegend}
        size={26}
        onPress={onPressClose}
      />
      <View style={styles.titleView}>
        {info && (
          <>
            <CompanyName>
              {info['companyName']}{' '}
              <Text style={styles.ticker}>({ticker})</Text>
            </CompanyName>
            <LottieFav 
              saved={saved}
              ref={heartRef}
              onPress={loading ? () => {} : (saved ? onPressRemoveSymbol : onPressSaveSymbol)}
            />
          </>
        )}
      </View>
      <LatestPrice />
      {/* <View style={styles.chartTypeRow}>
        <ChartTypeButton
          selected={chartType === 'candleStick'}
          onPress={() => setChartType('candleStick')}>
          <ChartTypeButtonText selected={chartType === 'candleStick'}>
            {t('CandleStick Chart')}
          </ChartTypeButtonText>
        </ChartTypeButton>
        <ChartTypeButton
          selected={chartType === 'line'}
          onPress={() => setChartType('line')}>
          <ChartTypeButtonText selected={chartType === 'line'}>
            {t('Line Chart')}
          </ChartTypeButtonText>
        </ChartTypeButton>
      </View> */}
      <View style={{height: '55%'}}>
        {!loading && data ? (
          <TabView
            lazy
            navigationState={{index: tabIndex, routes}}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={_handleIndexChange}
            initialLayout={{width: Dimensions.get('window').width}}
            style={styles.tabViewContainer}
          />
        ) : (
          <Spinner fullscreen />
        )}
      </View>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={renderKeyExtractor}
        ItemSeparatorComponent={renderSeparator}
      />
      {/* <Container /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  tabViewContainer: {
    flex: 1,
  },

  titleView: {
    marginTop: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    opacity: 0.87,
    fontSize: 22,
    fontWeight: 'bold',
  },
  ticker: {
    fontWeight: 'normal',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 10,
    borderColor: '#fff',
    color: '#fff',
    opacity: 0.87,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  button: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    opacity: 0.87,
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
