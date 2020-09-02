import React, {useState, forwardRef, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Dimensions,
  Animated,
  PanResponder,
  KeyboardAvoidingView
} from 'react-native';

const BottomSheet = forwardRef(({...props}, ref) => {
  const panY = useRef(new Animated.Value(Dimensions.get('screen').height))
    .current;

  let _resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false,
  });

  let _closeAnim = Animated.timing(panY, {
    toValue: Dimensions.get('screen').height,
    duration: 500,
    useNativeDriver: false,
  });

  let top = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  let _panResponders = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => false,
    onPanResponderMove: Animated.event([null, {dy: panY}], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (e, gs) => {
      if (gs.dy > 0 && gs.vy > 2) {
        return _closeAnim.start(() => props.onDismiss());
      }
      return _resetPositionAnim.start();
    },
  });

  useEffect(() => {
    if (props.visible) {
      _resetPositionAnim.start();
    }
  }, [props.visible]);

  const _handleDismiss = () => {
    _closeAnim.start(() => props.onDismiss());
  };

  return (
    <Modal
      animated
      visible={props.visible}
      transparent
      onRequestClose={_handleDismiss}>
      <KeyboardAvoidingView style={styles.overlay} behavior="padding">
        <Animated.View
          {..._panResponders.panHandlers}
          style={[styles.container, {top}]}>
          {props.children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    paddingTop: 12,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
});

export default BottomSheet;
