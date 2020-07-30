import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {useRoute, useNavigation} from '@react-navigation/native';

function Webview() {
  const route = useRoute();
  const navigation = useNavigation();
  const {url, title} = route.params;

  useEffect(() => {
    navigation.setOptions({title});
  }, []);

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <WebView source={{uri: url}} />
      </SafeAreaView>
    </>
  );
}

export default Webview;
