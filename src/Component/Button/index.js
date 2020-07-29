import React from 'react';
import Styled from 'styled-components/native';
import {useTheme} from '@react-navigation/native';

const Container = Styled.TouchableOpacity`
  border-radius: 50px;
  padding: 8px 16px;
  margin: 0px 8px;
  background-color: #e3116c;
`;
const Label = Styled.Text`
  color: white;
`;

const Button = ({label, onPress}) => {
  const {colors} = useTheme();
  return (
    <Container onPress={onPress} style={{backgroundColor: colors.primary}}>
      <Label>{label}</Label>
    </Container>
  );
};

export default Button;
