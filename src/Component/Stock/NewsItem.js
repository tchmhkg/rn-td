import React, {useCallback} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Linking,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import Styled from 'styled-components/native';
import {useLocale} from '~/I18n';

const Container = Styled.View`
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.text};
  background-color: ${(props) => props.theme.background};
`;

const Title = Styled.Text`
  font-weight: bold;
  margin-bottom: 5px;
  color: ${(props) => props.theme.text};
`;

const Text = Styled.Text`
  color: ${(props) => props.theme.text};
`;

const NewsItem = ({item}) => {
  const navigation = useNavigation();
  const {t} = useLocale();

  const handlePress = useCallback(
    async (url) => {
        console.log(url)
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        navigation.navigate('WebView', {url, title: item.title});
        // await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    },
    [navigation, item.title],
  );

  return (
    <TouchableOpacity onPress={() => handlePress(item?.links?.[0]?.url)}>
      <Container>
        <View style={styles.row}>
          <View style={styles.contentWrapper}>
            <Title numberOfLines={1}>{item.title}</Title>
            <Text numberOfLines={2}>{item.description}</Text>
          </View>
        </View>
        <View style={[styles.row, styles.metadataRow]}>
          <Text>
            {t('Published at:')} {moment(item.published).fromNow()}
          </Text>
        </View>
      </Container>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thumbnailWrapper: {
    flex: 1,
    marginRight: 10,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  contentWrapper: {
    flex: 2,
  },
  metadataRow: {
    marginTop: 10,
  },
});

export default NewsItem;
