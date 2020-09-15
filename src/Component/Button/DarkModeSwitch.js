import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Animated, {interpolateColors, spring} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RNSwitch = ({
  handleOnPress,
  activeTrackColor,
  inActiveTrackColor,
  thumbColor,
  value,
}) => {
  const [switchTranslate] = useState(new Animated.Value(0));
  const [iconTranslate] = useState(new Animated.Value(0));
  useEffect(() => {
    if (value) {
      spring(switchTranslate, {
        toValue: 28,
        mass: 1,
        damping: 15,
        stiffness: 120,
        overshootClamping: false,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
      }).start();
      spring(iconTranslate, {
        toValue: -24,
        mass: 1,
        damping: 15,
        stiffness: 120,
        overshootClamping: false,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
      }).start();
    } else {
      spring(switchTranslate, {
        toValue: 0,
        mass: 1,
        damping: 15,
        stiffness: 120,
        overshootClamping: false,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
      }).start();
      spring(iconTranslate, {
        toValue: 3,
        mass: 1,
        damping: 15,
        stiffness: 120,
        overshootClamping: false,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
      }).start();
    }
  }, [value, switchTranslate, iconTranslate]);
  const interpolateBackgroundColor = {
    backgroundColor: interpolateColors(switchTranslate, {
      inputRange: [0, 28],
      outputColorRange: [inActiveTrackColor, activeTrackColor],
    }),
  };
  const memoizedOnSwitchPressCallback = React.useCallback(() => {
    handleOnPress(!value);
  }, [handleOnPress, value]);

  return (
    <Pressable onPress={memoizedOnSwitchPressCallback}>
      <Animated.View
        style={[styles.containerStyle, interpolateBackgroundColor]}>
        <Animated.View
          style={[
            styles.circleStyle,
            {backgroundColor: thumbColor},
            {
              transform: [
                {
                  translateX: switchTranslate,
                },
              ],
            },
            styles.shadowValue,
          ]}
        />
        <Animated.View
          style={[
            {
              transform: [
                {
                  translateX: iconTranslate,
                },
              ],
            },
          ]}>
          <Icon
            name={value ? 'moon-waning-crescent' : 'white-balance-sunny'}
            size={24}
            color={value ? '#ffffff' : '#f9d71c'}
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  circleStyle: {
    width: 27,
    height: 27,
    borderRadius: 27,
  },
  containerStyle: {
    width: 60,
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 36.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shadowValue: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});

RNSwitch.defaultProps = {
  activeTrackColor: '#007AFF',
  inActiveTrackColor: '#b2b2b2',
  thumbColor: '#FFFFFF',
};

export default RNSwitch;
