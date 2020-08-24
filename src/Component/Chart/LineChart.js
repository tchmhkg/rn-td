import {ECharts} from 'react-native-echarts-wrapper';
import React, {useEffect, useState, forwardRef} from 'react';
import {lineChartOptionFormatter} from '~/Helper';
import {useTheme} from '~/Theme';
import axios from 'axios';
import moment from 'moment';
import {CANDLES_API} from '~/Util/apiUrls';
import {FINNHUB_API_KEY} from '~/Util/config';
import {showMessage} from 'react-native-flash-message';

export const LineChart = forwardRef(({ticker}, ref) => {
  const [chartOption, setChartOption] = useState({});
  const [selectedStock, setSelectedStock] = useState({data: []});
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
      if (!ticker) {
        return;
      }
      // setLoading(true);
      const res = await axios.get(CANDLES_API, {
        params: {
          symbol: ticker.toUpperCase(),
          from: moment().subtract(5, 'days').format('X'),
          to: moment().unix(),
          resolution: '1',
          token: FINNHUB_API_KEY,
        },
      });

      console.log(res);
      setSelectedStock({
        data: res.data,
      });
      // setLoading(false);
    } catch (error) {
      console.log(error.response);
      // setLoading(false);
      showMessage({
        message: error.response?.data,
        type: 'danger',
        icon: 'auto',
        duration: 2000,
      });
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
