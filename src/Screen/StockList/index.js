import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext,
} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import StockItem from '~/Component/Stock/Item';
import Separator from '~/Component/Separator';
import Styled from 'styled-components/native';
import IconButton from '~/Component/IconButton';
import SearchTickerModal from '~/Component/SearchTickerModal';
import axios from 'axios';
import {useLocale} from '~/I18n';
import {useTheme} from '~/Theme';
import moment from 'moment';
import {TDA_QUOTES_API} from '~/Util/apiUrls';
import {TDContext} from '~/Context/TDA';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const Container = Styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

const EmptyContainer = Styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.background};
  justify-content: center;
  align-items: center;
`;

const EmptyDataText = Styled.Text`
  font-size: 24px;
  color: ${(props) => props.theme.text};
`;

function StockList() {
  const navigation = useNavigation();
  const {authInfo} = useContext(TDContext);
  const [stocks, setStocks] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const modalRef = useRef(null);
  const [screenIsFocused, setScreenIsFocused] = useState(false);
  const isFocused = useIsFocused();
  const {t} = useLocale();
  const theme = useTheme();
  let isCancelled = useRef(false);
  const [ticker, setTicker] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const onDismiss = () => {
    // setModalVisible(false);
      modalRef.current?.close();
  };

  useLayoutEffect(() => {
    const onPressSearch = () => {
      // setModalVisible(true);
      modalRef.current?.open();
    };
    navigation.setOptions({
      headerRight: (props) => (
        <IconButton iconName="search" onPress={onPressSearch} />
      ),
    });
  }, [navigation, isFocused]);

  useEffect(() => {
    console.log('isFocused', isFocused);
    setScreenIsFocused(isFocused);
  }, [isFocused]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const data = await AsyncStorage.getItem('symbols');
        if (data !== null) {
          console.log(JSON.parse(data));
          const jsonData = JSON.parse(data);
          if (jsonData?.length) {
            setStocks(jsonData);
            const symbolsString = jsonData.map(({symbol}) => symbol).join(',');
            getQuotes(symbolsString);
          }
        }
      } catch (e) {
        console.log(e);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const getQuotes = (symbols) => {
    axios
      .get(TDA_QUOTES_API, {
        cancelToken: source.token,
        headers: {
          Authorization: 'Bearer ' + authInfo?.access_token,
        },
        params: {
          symbol: symbols,
        },
      })
      .then((res) => {
        console.log('isCancelled.current', isCancelled.current);
        if (res?.data && !isCancelled.current) {
          setStocks(Object.values(res?.data));
          console.log(Object.values(res?.data));
        }
        setIsRefreshing(false);
      })
      .catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message);
        } else {
          console.log(thrown);
        }
        setIsRefreshing(false);
      });
  };

  const onPressSearchStock = () => {
    navigation.navigate('SearchTicker');
  };

  const onPressClear = async () => {
    try {
      await AsyncStorage.removeItem('symbols');
      setStocks([]);
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({item}) => {
    return <StockItem item={item} refreshing={isRefreshing} />;
  };

  const renderSeparator = () => {
    return <Separator />;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
  };

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await AsyncStorage.getItem('symbols');
        if (data !== null) {
          console.log(JSON.parse(data));
          const jsonData = JSON.parse(data);
          if (jsonData?.length) {
            const symbolsString = jsonData.map(({symbol}) => symbol).join(',');
            getQuotes(symbolsString);
          } else {
            setIsRefreshing(false);
          }
          // setStocks(JSON.parse(data));
        }
      } catch (e) {
        console.log(e);
        setIsRefreshing(false);
      }
    };
    if (isRefreshing) {
      fetchStocks();
    }
  }, [isRefreshing, authInfo?.access_token]);

  const renderKeyExtractor = React.useCallback(
    (item) => item.cusip || item.symbol,
    [],
  );

  return (
    <>
      {stocks && stocks.length ? (
        <Container>
          <FlatList
            data={stocks}
            renderItem={renderItem}
            ItemSeparatorComponent={renderSeparator}
            keyExtractor={renderKeyExtractor}
            refreshControl={
              <RefreshControl
                colors={[theme.colors.text]}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={theme.colors.text}
              />
            }
          />
          <TouchableOpacity onPress={onPressClear}>
            <Text style={styles.buttonText}>{t('Clear list')}</Text>
          </TouchableOpacity>
        </Container>
      ) : (
        <EmptyContainer>
          <EmptyDataText>{t('No any symbol saved')}</EmptyDataText>
          <EmptyDataText>
            {t('Click ')}
            <Text style={styles.touchableText} onPress={onPressSearchStock}>
              {t('here')}
            </Text>
            {t(' to search')}
          </EmptyDataText>
        </EmptyContainer>
      )}
      <SearchTickerModal
        ref={modalRef}
        visible={modalVisible}
        ticker={ticker}
        setTicker={setTicker}
        onDismiss={onDismiss}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 24,
    color: '#fff',
    opacity: 0.87,
  },
  button: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    opacity: 0.87,
    fontSize: 16,
    fontWeight: 'bold',
  },
  symbol: {
    color: '#fff',
    opacity: 0.87,
  },
  companyName: {
    color: '#fff',
    opacity: 0.87,
    fontSize: 18,
  },
  touchableText: {
    textDecorationLine: 'underline',
  },
  symbolWrapper: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockInfo: {
    flex: 0.7,
  },
  stockPrice: {
    flex: 0.3,
  },
});

export default StockList;
