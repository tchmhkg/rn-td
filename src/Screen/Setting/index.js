import React from 'react';
import Styled from 'styled-components/native';
import {StyleSheet, View, ScrollView, Switch} from 'react-native';
import {useTheme} from '../../Theme';

const Container = Styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  background: ${(props) => props.theme.background};
`;

const Label = Styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 28px;
  margin: 0 10px;
  font-weight: bold;
`;

const ItemLebel = Styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 16px;
`;

const Setting = () => {
  const theme = useTheme();

  return (
    <Container>
      <Label>Setting</Label>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.settingItemRow}>
          <ItemLebel>Dark mode</ItemLebel>
          <Switch
            value={theme.mode === 'dark'}
            onValueChange={(value) => theme.setMode(value ? 'dark' : 'light')}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  settingItemRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollView: {
    padding: 10,
  },
});

export default Setting;
