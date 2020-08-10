import React from 'react';
import Styled from 'styled-components/native';
import {ActivityIndicator} from 'react-native';

const Container = Styled.View`
  justify-content: center;
  align-items: center;
`;

const FullscreenContainer = Styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Spinner = ({fullscreen = true, size = 'small', color = '#999999'}) => {
  if (fullscreen) {
    <FullscreenContainer>
      <ActivityIndicator size={size} color={color} />
    </FullscreenContainer>;
  }
  return (
    <Container>
      <ActivityIndicator size={size} color={color} />
    </Container>
  );
};

export default Spinner;
