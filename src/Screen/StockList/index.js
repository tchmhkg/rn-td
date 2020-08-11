import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
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
import {useLocale} from '~/I18n';
import {useTheme} from '~/Theme';
// import SearchTickerModal from '~/Component/SearchTickerModal';

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
  const [stocks, setStocks] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const modalizeRef = useRef(null);
  const [screenIsFocused, setScreenIsFocused] = useState(false);
  const isFocused = useIsFocused();
  const {t} = useLocale();
  const theme = useTheme();

  useLayoutEffect(() => {
    const onPressSearch = () => {
      console.log('onPressSearch');
      modalizeRef.current?.open();
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
          setStocks(JSON.parse(data));
        }
      } catch (e) {
        console.log(e);
      }
    });

    return unsubscribe;
  }, [navigation]);

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
          setStocks(JSON.parse(data));
          setIsRefreshing(false);
        }
      } catch (e) {
        console.log(e);
        setIsRefreshing(false);
      }
    };
    if (isRefreshing) {
      fetchStocks();
    }
  }, [isRefreshing]);

  return (
    <>
      {stocks && stocks.length ? (
        <Container>
          <FlatList
            data={stocks}
            renderItem={renderItem}
            ItemSeparatorComponent={renderSeparator}
            keyExtractor={(item) => item.id.toString()}
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
      <SearchTickerModal ref={modalizeRef} />
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
