import React, {useState, useRef, useContext, useEffect} from 'react';
import Styled from 'styled-components/native';
import axios from 'axios';

import Button from '~/Component/Button';
import {TDAWebView} from '~/Component/Modal/TDAWebView';
import {TDContext} from '~/Context/TDA';
import {TDA_BASE_URL} from '~/Util/config';

const Container = Styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.background};
`;

const Label = Styled.Text`
  color: ${(props) => props.theme.text};
`;
const url =
  'https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=https%3A%2F%2Fchmtdsapi.herokuapp.com%2Fauth&client_id=1AQTLQTIRXA05MXOGHCE96NC5BFRTQFH%40AMER.OAUTHAP';
const TabFirst = ({navigation}) => {
  const {tdToken} = useContext(TDContext);

  const modalizeRef = useRef(null);

  const openTDWeb = () => {
    modalizeRef.current.open();
  };

  useEffect(() => {
    if (tdToken) {
      getTDAccounts();
    }
  }, []);

  const getTDAccounts = async () => {
    try {
      const res = await axios.get(TDA_BASE_URL + '/accounts', {
        headers: {
          Authorization: 'Bearer ' + tdToken,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error.response);
      // setLoading(false);
      // showMessage({
      //   message: error.response?.data,
      //   type: 'danger',
      //   icon: 'auto',
      //   duration: 2000,
      // });
    }
  };

  return (
    <Container>
      <Label>This is First Tab</Label>
      <Button
        style={{marginBottom: 20}}
        label="Login TD Ameritrade"
        onPress={openTDWeb}
      />
      <Button
        style={{marginBottom: 20}}
        label="Get TD Accounts"
        onPress={getTDAccounts}
      />
      {/* <Button label="Open Modal" onPress={() => navigation.navigate('Modal')} />
      <Button
        label="Open Full Modal"
        onPress={() => navigation.navigate('FullModal')}
      /> */}
      <TDAWebView ref={modalizeRef} url={url} />
    </Container>
  );
};

export default TabFirst;
