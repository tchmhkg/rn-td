import React from 'react';
import Styled from 'styled-components/native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const Container = Styled.TouchableOpacity`
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`;

const IconButton = ({iconName, color, size = 24, onPress, style = {}}) => {
  return (
    <Container onPress={onPress} style={style}>
      <Icon name={iconName} color={color ? color : 'white'} size={size} />
    </Container>
  );
};

export default IconButton;
