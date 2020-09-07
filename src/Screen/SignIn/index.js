import React, {useContext, useRef} from 'react';
import Styled from 'styled-components/native';

// import {UserContext} from '~/Context/User';
import Button from '~/Component/Button';
import {TDAWebView} from '~/Component/Modal/TDAWebView';
// import {TDContext} from '~/Context/TDA';
import {TDA_BASE_URL, TDA_LOGIN_URL, TDA_CLIENT_ID} from '~/Util/config';


const Container = Styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.background};
`;
// const Label = Styled.Text`
//   color: ${(props) => props.theme.text};
// `;

// const ButtonContainer = Styled.View`
//   flex-direction: row;
//   margin-top: 20px;
// `;

const SignIn = ({navigation}) => {
  // const {login} = useContext(UserContext);
  const modalizeRef = useRef(null);


  const openTDWeb = () => {
    modalizeRef.current?.open();
  };

  return (
    <Container>
      {/* <Label>This is SignIn Screen</Label> */}
      <Button
        label="SignIn"
        onPress={openTDWeb}
      />

      {/* <ButtonContainer>
        <Button label="SignUp" onPress={() => navigation.navigate('SignUp')} />
        <Button
          label="Reset Password"
          onPress={() => navigation.navigate('ResetPassword')}
        />
      </ButtonContainer> */}
      <TDAWebView ref={modalizeRef} url={TDA_LOGIN_URL} />
    </Container>
  );
};

export default SignIn;
