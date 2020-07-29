import moment from 'moment';

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

export const chartOptionFormatter = (data) => {
  let values = [];
  let dates = [];
  data?.t?.forEach((d, i) => {
    dates.push(timestampToDate(d));
    values.push([data?.o[i], data?.c[i], data?.l[i], data?.h[i]]);
  });
  const option = {
    backgroundColor: '#121212',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false,
        type: 'cross',
        lineStyle: {
          color: '#f3f3f3',
          width: 2,
          opacity: 0.87,
        },
        label: {color: '#121212'},
      },
      confine: true,
    },
    legend: {
      data: ['MA5', 'MA10', 'MA20', 'MA30'],
      inactiveColor: '#777',
      textStyle: {
        color: '#fff',
        opacity: 0.87,
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
        axisLine: {lineStyle: {color: '#fff', opacity: 0.87}},
      },
    ],
    yAxis: [
      {
        scale: true,
        axisLine: {
          lineStyle: {color: '#fff', opacity: 0.87},
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
          color: '#fff',
          opacity: 0.87,
        },
        handleIcon:
          'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        dataBackground: {
          areaStyle: {
            color: '#8392A5',
          },
          lineStyle: {
            opacity: 0.8,
            color: '#8392A5',
          },
        },
        handleStyle: {
          color: '#fff',
          opacity: 0.87,
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
            color: '#FD1050',
            color0: '#0CF49B',
            borderColor: '#FD1050',
            borderColor0: '#0CF49B',
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
