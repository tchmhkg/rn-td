import {ECharts} from 'react-native-echarts-wrapper';
import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import {useRoute, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import LatestPrice from '~/Component/LatestPrice';
import {getAdvancedStatsApi, CANDLES_API} from '~/Util/apiUrls';
import {IEX_SANDBOX_API_KEY, FINNHUB_API_KEY} from '~/Util/config';
import {chartOptionFormatter} from '~/Helper';

export default function Stock() {
  const route = useRoute();
  const navigation = useNavigation();
  const {ticker} = route.params;
  const [selectedStock, setSelectedStock] = useState({data: [], info: null});
  const [loading, setLoading] = useState(true);
  const [chartOption, setChartOption] = useState({});
  const {data, info} = selectedStock;
  const chartRef = useRef(null);

  const onPressSaveSymbol = async () => {
    try {
      const existing = await AsyncStorage.getItem('symbols');

      const existingJson = existing ? JSON.parse(existing) : [];
      const isExisted = _.find(existingJson, ['symbol', ticker]);
      if (isExisted) {
        showMessage({
          message: 'Saved already!',
          type: 'warning',
          icon: 'auto',
          duration: 2000,
        });
        return;
      }
      const newList = [
        ...existingJson,
        {name: info['companyName'], symbol: ticker},
      ];

      await AsyncStorage.setItem('symbols', JSON.stringify(newList));
      showMessage({
        message: 'Saved successfully!',
        type: 'success',
        icon: 'auto',
        duration: 2000,
      });
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={loading ? () => {} : onPressSaveSymbol}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, loading]);

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
    }
  };

  useEffect(() => {
    const {option} = chartOptionFormatter(data);
    setChartOption(option);
    chartRef.current?.setOption(option);
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        {info && (
          <Text style={styles.title}>
            {info['companyName']} <Text style={styles.ticker}>({ticker})</Text>
          </Text>
        )}
      </View>
      <LatestPrice />
      {!loading && data ? (
        <ECharts ref={chartRef} option={chartOption} />
      ) : (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator animating size="large" />
        </View>
      )}
      <View style={styles.container} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },

  titleView: {
    marginTop: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
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
  loadingWrapper: {
    paddingVertical: 20,
    backgroundColor: '#121212',
  },
});
