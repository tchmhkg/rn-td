import React, {forwardRef, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';
import favIcon from '~/Asset/heart.json';

const LottieFav = forwardRef(({size = 40, onPress = () => {}, style = {}, progress, saved, ...props}, ref) => {

  return (
    <TouchableOpacity
      style={[{width: size, height: size}, style]}
      onPress={onPress}>
      <LottieView
        ref={ref}
        source={favIcon}
        progress={saved ? 1 : 0}
        loop={false}
      />
    </TouchableOpacity>
  );
});

export default LottieFav;
