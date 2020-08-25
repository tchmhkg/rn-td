import moment from 'moment';
import _ from 'lodash';
import lightTheme from '~/Theme/light';
import darkTheme from '~/Theme/dark';

function calculateMA(dayCount, data) {
  var result = [];
  for (var i = 0, len = data.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += data[i - j][1];
    }
    result.push((sum / dayCount).toFixed(2));
  }
  return result;
}

export const timestampToDate = (timestamp, format = 'YYYY-MM-DD') =>
  moment.unix(timestamp).format(format);

export const candleChartOptionFormatter = (data, mode = 'dark') => {
  const theme = mode === 'dark' ? darkTheme.theme : lightTheme.theme;
  let values = [];
  let dates = [];
  data?.t?.forEach((d, i) => {
    dates.push(timestampToDate(d));
    values.push([data?.o[i], data?.c[i], data?.l[i], data?.h[i]]);
  });
  const option = {
    backgroundColor: theme?.background,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false,
        type: 'cross',
        lineStyle: {
          color: theme?.chartLine,
          width: 0.5,
        },
        label: {color: theme?.tooltipLabel},
      },
      confine: true,
    },
    legend: {
      data: ['MA5', 'MA10', 'MA20', 'MA30'],
      inactiveColor: theme?.inactiveLegend,
      textStyle: {
        color: theme?.text,
      },
    },
    toolbox: {
      orient: 'vertical',
      show: true,
      showTitle: true,
    },
    xAxis: [
      {
        type: 'category',
        data: dates,
        axisLine: {lineStyle: {color: theme?.chartLine}},
      },
    ],
    yAxis: [
      {
        scale: true,
        axisLine: {
          lineStyle: {color: theme?.chartLine},
        },
        splitLine: {show: false},
      },
    ],
    grid: [
      {
        left: '10%',
        right: '8%',
        height: '55%',
      },
      {
        left: '10%',
        right: '8%',
        bottom: '10%',
        height: '15%',
      },
    ],

    dataZoom: [
      {
        textStyle: {
          color: theme?.text,
        },
        handleIcon:
          'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        dataBackground: {
          areaStyle: {
            color: theme?.chartDataZoomBackground,
          },
          lineStyle: {
            opacity: 0.8,
            color: theme?.chartDataZoomBackground,
          },
        },
        handleStyle: {
          color: theme?.text,
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        start: 90,
        end: 100,
      },
      {
        type: 'inside',
      },
    ],
    color: ['#ed972d', '#03befc', '#f578f3', '#2b34e0'],
    animation: true,
    series: [
      {
        type: 'candlestick',
        name: 'Daily',
        data: values,
        itemStyle: {
          normal: {
            color: '#4DBD33',
            color0: '#FD1050',
            borderColor: '#4DBD33',
            borderColor0: '#FD1050',
          },
        },
      },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5, values),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1,
          },
        },
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(10, values),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1,
          },
        },
      },
      {
        name: 'MA20',
        type: 'line',
        data: calculateMA(20, values),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1,
          },
        },
      },
      {
        name: 'MA30',
        type: 'line',
        data: calculateMA(30, values),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1,
          },
        },
      },
    ],
  };
  return {option, values, dates};
};

export const lineChartOptionFormatter = (data, mode = 'dark') => {
  const theme = mode === 'dark' ? darkTheme.theme : lightTheme.theme;
  let values = [];
  let dates = [];
  data?.forEach((d, i) => {
    const timestamp = moment(d.datetime).format('YYYY-MM-DD HH:mm');
    dates.push(timestamp);
    values.push(d?.close);
  });

  const option = {
    backgroundColor: theme?.background,
    legend: {
      show: false,
    },
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      },
      axisPointer: {
        animation: false,
        type: 'cross',
        lineStyle: {
          color: theme?.chartLine,
          width: 0.5,
        },
        label: {color: theme?.tooltipLabel},
      },
      confine: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: {lineStyle: {color: theme?.chartLine}},
    },
    yAxis: {
      scale: true,
      axisLine: {
        lineStyle: {color: theme?.chartLine},
      },
      splitLine: {show: false},
      type: 'value',
    },
    // dataZoom: [
    //   {
    //     textStyle: {
    //       color: theme?.text,
    //     },
    //     handleIcon:
    //       'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
    //     handleSize: '80%',
    //     dataBackground: {
    //       areaStyle: {
    //         color: theme?.chartDataZoomBackground,
    //       },
    //       lineStyle: {
    //         opacity: 0.8,
    //         color: theme?.chartDataZoomBackground,
    //       },
    //     },
    //     handleStyle: {
    //       color: theme?.text,
    //       shadowBlur: 3,
    //       shadowColor: 'rgba(0, 0, 0, 0.6)',
    //       shadowOffsetX: 2,
    //       shadowOffsetY: 2,
    //     },
    //     start: 0,
    //     end: 100,
    //   },
    //   {
    //     type: 'inside',
    //   },
    // ],
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'none',
        sampling: 'average',
        itemStyle: {
          color: theme?.primary,
        },
        areaStyle: {
          color: theme?.primary,
        },
        data: values,
      },
    ],
    grid: [
      {
        top: 30,
        left: '10%',
        right: '8%',
        height: '65%',
      },
      {
        left: '10%',
        right: '8%',
        bottom: 20,
      },
    ],
  };
  return {option, values, dates};
};
