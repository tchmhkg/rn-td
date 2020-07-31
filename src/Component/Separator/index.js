import React from 'react';
import Styled from 'styled-components/native';

const Separator = Styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.border};
`;

export default () => {
  return <Separator />;
};
