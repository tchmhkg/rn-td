import React, {useRef} from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {useRoute, useNavigation} from '@react-navigation/native';
import 'react-native-url-polyfill/auto';
const base_url = 'https://chmtdsapi.herokuapp.com';

function TDAWebview() {
  const route = useRoute();
  const navigation = useNavigation();
  const {url, setAuthData} = route.params;
  const webViewRef = useRef(null);
  const INJECTED_JAVASCRIPT = `
    try {
      function loadPageEnd() {
        window.ReactNativeWebView.postMessage(document.getElementsByTagName('pre')[0].innerText)
      }
      window.onload = loadPageEnd();
    } catch(e) {
      true;
    }
    true;
  `;

  const onLoadEnd = (syntheticEvent) => {
    const {nativeEvent} = syntheticEvent;
    const currentUrl = new URL(nativeEvent.url);
    if (currentUrl && currentUrl.origin === base_url) {
      webViewRef.current.injectJavaScript(INJECTED_JAVASCRIPT);
      navigation.pop();
    }
  };

  const onMessage = (event) => {
    const data = event.nativeEvent.data;
    setAuthData(data);
    // console.log('Received: ', event.nativeEvent.data);
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <WebView
          ref={webViewRef}
          source={{uri: url}}
          onLoadEnd={onLoadEnd}
          javaScriptEnabledAndroid
          onMessage={onMessage}
        />
      </SafeAreaView>
    </>
  );
}

export default TDAWebview;
