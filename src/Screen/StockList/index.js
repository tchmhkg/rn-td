import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import {StyleSheet, Text, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import StockItem from '~/Component/Stock/Item';
import Separator from '~/Component/Separator';
import Styled from 'styled-components/native';
import IconButton from '~/Component/IconButton';
import SearchTickerModal from '~/Component/SearchTickerModal';
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

function StockList() {
  const navigation = useNavigation();
  const [stocks, setStocks] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const modalizeRef = useRef(null);

  useLayoutEffect(() => {
    const onPressSearch = () => {
      modalizeRef.current?.open();
    };
    navigation.setOptions({
      headerRight: (props) => (
        <IconButton iconName="search" onPress={onPressSearch} />
      ),
    });
  }, [navigation]);

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
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
          <TouchableOpacity onPress={onPressClear}>
            <Text style={styles.buttonText}>Clear list</Text>
          </TouchableOpacity>
        </Container>
      ) : (
        <EmptyContainer>
          <Text style={styles.noDataText}>No any symbol saved.</Text>
          <Text style={styles.noDataText}>
            Click{' '}
            <Text style={styles.touchableText} onPress={onPressSearchStock}>
              here
            </Text>{' '}
            to search stock
          </Text>
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
