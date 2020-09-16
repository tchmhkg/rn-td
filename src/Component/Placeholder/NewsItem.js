import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import Styled from 'styled-components/native';

const Container = Styled.View`
  padding: 5px 10px 10px 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.text};
`;

const NewsItemPlaceholder = () => {
  return (
    <Placeholder Animation={Fade}>
      <Container>
        <View style={styles.row}>
          <PlaceholderMedia
            style={{marginHorizontal: 15, width: 100, height: 55}}
          />
          <View style={styles.contentWrapper}>
            <PlaceholderLine style={{marginTop: 5}} />
            <PlaceholderLine style={{marginBottom: 5}} />
            <PlaceholderLine style={{marginBottom: 8}} />
          </View>
        </View>
        <View style={[styles.row, styles.metadataRow]}>
          <PlaceholderLine width={40} style={{marginBottom: 5}} />
          <PlaceholderLine width={40} style={{marginBottom: 5}} />
        </View>
      </Container>
    </Placeholder>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flex: 2,
  },
  metadataRow: {
    marginTop: 10,
  },
});

export default React.memo(NewsItemPlaceholder);
