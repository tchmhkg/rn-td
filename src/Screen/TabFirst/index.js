import React from 'react';
import Styled from 'styled-components/native';

import Button from '~/Component/Button';

const Container = Styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Label = Styled.Text``;

const TabFirst = ({navigation}) => {
  return (
    <Container>
      <Label>This is First Tab</Label>
      <Button label="Open Modal" onPress={() => navigation.navigate('Modal')} />
      <Button
        label="Open Full Modal"
        onPress={() => navigation.navigate('FullModal')}
      />
    </Container>
  );
};

export default TabFirst;
