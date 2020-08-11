import React from 'react';
import Styled from 'styled-components/native';
import {ActivityIndicator} from 'react-native';
import {useTheme} from '~/Theme';

const Container = Styled.View`
  justify-content: center;
  align-items: center;
`;

const FullscreenContainer = Styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Spinner = ({fullscreen = true, size = 'small', color}) => {
  const theme = useTheme();
  color = color || theme.colors.text;
  if (fullscreen) {
    return (
      <FullscreenContainer>
        <ActivityIndicator size={size} color={color} />
      </FullscreenContainer>
    );
  }
  return (
    <FullscreenContainer>
      <ActivityIndicator size={size} color={color} />
    </FullscreenContainer>
  );
};

export default Spinner;
