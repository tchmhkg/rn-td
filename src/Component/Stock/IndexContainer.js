import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, SwipeableListView, Text, View} from 'react-native';
import SegmentedControl from '@react-native-community/segmented-control';
import {TDA_CLIENT_ID} from '~/Util/config';
import axios from 'axios';
import Styled from 'styled-components/native';
import {useLocale} from '~/I18n';
import {TDA_QUOTES_API} from '~/Util/apiUrls';
import {useTheme} from '~/Theme';
import IndexPrice from './IndexPrice';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const Wrapper = Styled.View`
  margin: 5px 10px;
  flex: 1;
`;

const Container = Styled.View`
  background-color: ${(props) => props.theme.background}
`;

const Label = Styled.Text`
  color: ${(props) => props.theme.text}
`;

export default ({isFocused}) => {
  const [prices, setPrices] = useState([]);
  const [viewIndex, setViewIndex] = useState(0);
  let isCancelled = useRef(false);
  const {t} = useLocale();
  const {colors, mode} = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      getQuotes();
    }, 500);
    if (!isFocused) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isFocused]);

  const getQuotes = () => {
    axios
      .get(TDA_QUOTES_API, {
        cancelToken: source.token,
        params: {
          apikey: TDA_CLIENT_ID,
          symbol: '$DJI,$COMPX,$SPX.X,/YM,/NQ,/ES',
        },
      })
      .then((res) => {
        if (res?.data && !isCancelled.current) {
          // console.log(Object.values(res?.data));
          setPrices(Object.values(res?.data));
        }
        // setIsRefreshing(false);
      })
      .catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message);
        } else {
          console.log(thrown);
        }
        // setIsRefreshing(false);
      });
  };

  const renderIndexContent = (priceObj) => (
    <Wrapper key={priceObj?.symbol}>
      <Label numberOfLines={2}>{priceObj?.description}</Label>
      <IndexPrice priceObj={priceObj}/>
    </Wrapper>
  );

  const renderFutureContent = (priceObj) => (
    <Wrapper key={priceObj?.symbol}>
      <Label numberOfLines={2}>{priceObj?.description}</Label>
      <IndexPrice priceObj={priceObj} isFuture/>
    </Wrapper>
  );

  return (
    <Container>
      <SegmentedControl
        style={{backgroundColor: colors.background}}
        fontStyle={{color: colors.text}}
        activeFontStyle={{
          color: mode === 'dark' ? colors.background : colors.text,
        }}
        values={[t('Index'), t('Future')]}
        selectedIndex={viewIndex}
        onChange={(event) =>
          setViewIndex(event.nativeEvent.selectedSegmentIndex)
        }
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {viewIndex === 0
          ? prices?.slice(0, 3).map(renderIndexContent)
          : prices?.slice(3, 6).map(renderFutureContent)}
      </View>
    </Container>
  );
};
