import React from 'react';
import Styled from 'styled-components/native';

const Container = Styled.TouchableOpacity`
  border-radius: 50px;
  padding: 10px 16px;
  margin: 0px 8px;
  background-color: ${props => props.theme.primary};
  justify-content: center;
  align-items: center;
`;
const Label = Styled.Text`
  color: ${props => props.theme.buttonText};
  font-size: 16px;
`;

const Button = ({label, onPress, style}) => {
  return (
    <Container onPress={onPress} style={style}>
      <Label>{label}</Label>
    </Container>
  );
};

export default Button;
