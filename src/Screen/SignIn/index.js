import React, {useContext} from 'react';
import Styled from 'styled-components/native';

import {UserContext} from '~/Context/User';
import Button from '~/Component/Button';

const Container = Styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.background};
`;
const Label = Styled.Text`
  color: ${(props) => props.theme.text};
`;

const ButtonContainer = Styled.View`
  flex-direction: row;
  margin-top: 20px;
`;

const SignIn = ({navigation}) => {
  const {login} = useContext(UserContext);

  return (
    <Container>
      <Label>This is SignIn Screen</Label>
      <Button
        label="SignIn"
        onPress={() => login('peter@email.com', 'password')}
      />

      <ButtonContainer>
        <Button label="SignUp" onPress={() => navigation.navigate('SignUp')} />
        <Button
          label="Reset Password"
          onPress={() => navigation.navigate('ResetPassword')}
        />
      </ButtonContainer>
    </Container>
  );
};

export default SignIn;
