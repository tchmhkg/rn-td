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

const NewsRow = ({item}) => {
  const navigation = useNavigation();

  const handlePress = useCallback(
    async (url) => {
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
    <TouchableOpacity onPress={() => handlePress(item.url)}>
      <Container>
        <View style={styles.row}>
          {item.urlToImage && (
            <View style={styles.thumbnailWrapper}>
              <Image source={{uri: item.urlToImage}} style={styles.thumbnail} />
            </View>
          )}
          <View style={styles.contentWrapper}>
            <Title numberOfLines={1}>{item.title}</Title>
            <Text numberOfLines={2}>{item.description}</Text>
          </View>
        </View>
        <View style={[styles.row, styles.metadataRow]}>
          <Text>Source: {item.source?.name}</Text>
          <Text>Published at: {moment(item.publishedAt).fromNow()}</Text>
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

export default NewsRow;
