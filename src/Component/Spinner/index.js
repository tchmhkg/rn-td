import React from 'react';
import Styled from 'styled-components/native';
import {ActivityIndicator} from 'react-native';
import {useTheme} from '~/Theme';

const Container = Styled.View`
  justify-content: center;
  align-items: center;
  margin: 12px 0;
`;

const FullscreenContainer = Styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Spinner = ({
  fullscreen = false,
  size = 'small',
  color,
  containerStyle = {},
  style = {},
}) => {
  const theme = useTheme();
  color = color || theme.colors.text;
  if (fullscreen) {
    return (
      <FullscreenContainer style={containerStyle}>
        <ActivityIndicator size={size} color={color} style={style} />
      </FullscreenContainer>
    );
  }
  return (
    <Container style={containerStyle}>
      <ActivityIndicator size={size} color={color} style={style} />
    </Container>
  );
};

export default Spinner;
