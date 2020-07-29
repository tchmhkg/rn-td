import React from 'react';
import Styled from 'styled-components/native';
import Button from '~/Component/Button';
import {useNavigation} from '@react-navigation/native';

const Container = Styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Label = Styled.Text``;

const ResetPassword = () => {
  const navigation = useNavigation();
  const onPressReset = () => {
    navigation.popToTop();
  };

  return (
    <Container>
      <Label>This is ResetPassword Screen</Label>
      <Button label="Reset" onPress={onPressReset} />
    </Container>
  );
};

export default ResetPassword;
