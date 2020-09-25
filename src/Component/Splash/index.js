import React, {createRef, useRef, useEffect, useState} from 'react';
import {View, Image, Animated, StatusBar, StyleSheet} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import logo from '~/Asset/pug.png';

const App = ({isLoaded, children}) => {
  const [animationDone, setAnimationDone] = useState(false);
  const loadingProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoaded) {
      Animated.timing(loadingProgress, {
        toValue: 100,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => setAnimationDone(true));
    }
  }, [isLoaded]);

  const opacityClearToVisible = {
    opacity: loadingProgress.interpolate({
      inputRange: [0, 15, 30],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
      // clamp means when the input is 30-100, output should stay at 1
    }),
  };

  const imageScale = {
    transform: [
      {
        scale: loadingProgress.interpolate({
          inputRange: [0, 10, 20, 100],
          outputRange: [1, 0.8, 100, 500],
        }),
      },
    ],
  };

  // StatusBar Bug
  // const appScale = {
  //   transform: [
  //     {
  //       scale: loadingProgress.interpolate({
  //         inputRange: [0, 7, 100],
  //         outputRange: [1.1, 1.03, 1],
  //       }),
  //     },
  //   ],
  // };

  const fullScreenBlueLayer = animationDone ? null : (
    <View style={[StyleSheet.absoluteFill, {backgroundColor: '#1de9b6'}]} />
  );
  const fullScreenWhiteLayer = animationDone ? null : (
    <View style={[StyleSheet.absoluteFill, {backgroundColor: '#ffffff'}]} />
  );

  return (
    <View style={{flex: 1}}>
      <StatusBar animated hidden={!animationDone} />
      {fullScreenBlueLayer}
      <MaskedView
        style={{flex: 1}}
        maskElement={
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Animated.Image
              style={[{width: 200, height: 200}, imageScale]}
              source={logo}
            />
          </View>
        }>
        {fullScreenWhiteLayer}
        <Animated.View style={[opacityClearToVisible, {flex: 1}]}>
          {children}
        </Animated.View>
      </MaskedView>
    </View>
  );
};

export default App;
