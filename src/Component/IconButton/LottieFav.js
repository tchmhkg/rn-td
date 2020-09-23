import React, {forwardRef, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';
import lightFavIcon from '~/Asset/heart-light.json';
import darkFavIcon from '~/Asset/heart-dark.json';
import { useTheme } from '~/Theme';

const LottieFav = forwardRef(({size = 40, onPress = () => {}, style = {}, progress, saved, ...props}, ref) => {
  const {mode} = useTheme();
  return (
    <TouchableOpacity
      style={[{width: size, height: size}, style]}
      onPress={onPress}>
      <LottieView
        ref={ref}
        source={mode === 'dark' ? darkFavIcon : lightFavIcon}
        duration={800}
        progress={saved ? 1 : 0}
        loop={false}
      />
    </TouchableOpacity>
  );
});

export default LottieFav;
