import {ECharts} from 'react-native-echarts-wrapper';
import React, {useEffect, useState, forwardRef} from 'react';
import {candleChartOptionFormatter, lineChartOptionFormatter} from '~/Helper';
import {useTheme} from '~/Theme';

export const CandleChart = forwardRef(({data}, ref) => {
  const [chartOption, setChartOption] = useState({});
  const {mode} = useTheme();

  useEffect(() => {
    const {option} = candleChartOptionFormatter(data, mode);
    setChartOption(option);
    ref.current?.setOption(option);
  }, [data, mode]);

  return <ECharts ref={ref} option={chartOption} />;
});

export default CandleChart;
