import React from 'react';
import Styled from 'styled-components/native';

const Container = Styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.background}
`;

const Label = Styled.Text`
  color: ${(props) => props.theme.text}
`;

const Modal = () => {
  return (
    <Container>
      <Label>Modal!</Label>
    </Container>
  );
};

export default Modal;
