import React, {useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Linking,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import moment from 'moment';

const NewsRow = ({item}) => {
  const navigation = useNavigation();
  const {colors} = useTheme();

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
      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}>
        <View style={styles.row}>
          {item.urlToImage && (
            <View style={styles.thumbnailWrapper}>
              <Image source={{uri: item.urlToImage}} style={styles.thumbnail} />
            </View>
          )}
          <View style={styles.contentWrapper}>
            <Text
              style={[styles.title, {color: colors.text}]}
              numberOfLines={1}>
              {item.title}
            </Text>
            <Text numberOfLines={2} style={{color: colors.text}}>
              {item.description}
            </Text>
          </View>
        </View>
        <View style={[styles.row, styles.metadataRow]}>
          <Text style={{color: colors.text}}>Source: {item.source?.name}</Text>
          <Text style={{color: colors.text}}>
            Published at: {moment(item.publishedAt).fromNow()}
          </Text>
        </View>
      </View>
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
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metadataRow: {
    marginTop: 10,
  },
});

export default NewsRow;
