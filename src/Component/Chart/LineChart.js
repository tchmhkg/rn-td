import {ECharts} from 'react-native-echarts-wrapper';
import React, {useEffect, useState, forwardRef, useContext} from 'react';
import {lineChartOptionFormatter} from '~/Helper';
import {useTheme} from '~/Theme';
import axios from 'axios';
import moment from 'moment';
import {CANDLES_API, TDA_REFRESH_TOKEN_API} from '~/Util/apiUrls';
import {FINNHUB_API_KEY, TDA_BASE_URL, TDA_CLIENT_ID} from '~/Util/config';
import {showMessage} from 'react-native-flash-message';
import {TDContext} from '~/Context/TDA';

export const LineChart = forwardRef(({ticker}, ref) => {
  const [chartOption, setChartOption] = useState({});
  const [selectedStock, setSelectedStock] = useState({data: []});
  const {authInfo, logout, refreshAccessToken} = useContext(TDContext);
  // const [loading, setLoading] = useState(true);
  const {data} = selectedStock;
  const {mode} = useTheme();

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
      if (!ticker || !authInfo?.access_token) {
        return;
      }
      // setLoading(true);
      const todayOpen = moment(
        moment().format('YYYY-MM-DD') + 'T16:00:00+08:00',
      ).valueOf();

      const res = await axios.get(
        `${TDA_BASE_URL}/marketdata/${ticker}/pricehistory`,
        {
          headers: {
            Authorization: 'Bearer ' + authInfo?.access_token,
          },
          params: {
            // apikey: TDA_CLIENT_ID,
            // periodType: 'day',
            // period: 5,
            // frequencyType: 'minute',
            // frequency: 1,
            // needExtendedHoursData: false,
            startDate: todayOpen,
            endDate: moment().valueOf(),
          },
        },
      );

      console.log(res);
      setSelectedStock({
        data: res.data?.candles,
      });
      // setLoading(false);
    } catch (error) {
      console.log(error.response);
      if (error.response?.status === 401) {
        refreshToken();
        showMessage({
          message: error.response?.data?.error,
          type: 'danger',
          icon: 'auto',
          duration: 2000,
        });
      }
    }
  };

  const refreshToken = async (callback) => {
    try {
      console.log('refreshToken');
      let bodyData = new URLSearchParams();
      bodyData.append('grant_type', 'refresh_token');
      bodyData.append('refresh_token', authInfo?.refresh_token);
      bodyData.append('client_id', TDA_CLIENT_ID);
      const res = await axios.post(TDA_REFRESH_TOKEN_API, bodyData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      // console.log(res.data);
      if (res.data && res.data) {
        refreshAccessToken(res.data.access_token);
        if (typeof callback === 'function') {
          callback();
        }
      }
    } catch (error) {
      console.log(error.response);
      showMessage({
        message: error.response?.data?.error,
        type: 'danger',
        icon: 'auto',
        duration: 2000,
      });
      logout();
    }
  };

  useEffect(() => {
    const {option} = lineChartOptionFormatter(data, mode);
    setChartOption(option);
    ref.current?.setOption(option);
  }, [data, mode]);

  return <ECharts ref={ref} option={chartOption} />;
});

export default LineChart;
