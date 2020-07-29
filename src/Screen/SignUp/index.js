import React, {useContext} from 'react';
import Styled from 'styled-components/native';
import Button from '~/Component/Button';
import {useNavigation} from '@react-navigation/native';
import {UserContext} from '~/Context/User';

const Container = Styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Label = Styled.Text``;

const SignUp = () => {
  const navigation = useNavigation();
  const {login} = useContext(UserContext);
  
  const onPressSubmit = () => {
    navigation.pop();
    login();
  };

  return (
    <Container>
      <Label>This is SignUp Screen</Label>
      <Button label="Submit" onPress={onPressSubmit} />
    </Container>
  );
};

export default SignUp;
