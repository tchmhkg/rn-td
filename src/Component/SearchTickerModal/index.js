// import React, {useState, forwardRef} from 'react';
// import {StyleSheet, View, Text, SafeAreaView, TextInput} from 'react-native';
// import {Modalize} from 'react-native-modalize';
// import {Portal} from 'react-native-portalize';
// import {useNavigation} from '@react-navigation/native';
// import {TouchableOpacity} from 'react-native-gesture-handler';

// const SearchTickerModal = forwardRef((props, ref) => {
//   const navigation = useNavigation();
//   const [ticker, setTicker] = useState('');

//   const renderModalContent = () => {
//     const onPressSubmit = () => {
//       console.log(ticker);
//       if (!ticker) {
//         return;
//       }
//       ref.current?.close();
//       navigation.navigate('Stock', {ticker});
//     };
//     return (
//       <SafeAreaView style={styles.modalContainer}>
//         <View style={styles.inputWrapper}>
//           <TextInput
//             onChangeText={setTicker}
//             style={styles.input}
//             autoCapitalize="characters"
//             autoCorrect={false}
//             value={ticker}
//           />
//         </View>
//         <TouchableOpacity onPress={onPressSubmit} style={styles.button}>
//           <Text style={styles.buttonText}>Search</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   };

//   return (
//     <Portal>
//       <Modalize ref={ref} adjustToContentHeight tapGestureEnabled={false}>
//         {renderModalContent()}
//       </Modalize>
//     </Portal>
//   );
// });

// const styles = StyleSheet.create({
//   input: {
//     borderWidth: 1,
//     padding: 10,
//     marginHorizontal: 10,
//     borderColor: '#fff',
//     color: '#fff',
//     opacity: 0.87,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   inputWrapper: {
//     backgroundColor: '#1f1f1f',
//     paddingVertical: 10,
//   },
//   button: {
//     alignSelf: 'center',
//     marginVertical: 20,
//   },
//   buttonText: {
//     color: '#fff',
//     opacity: 0.87,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   modalContainer: {
//     backgroundColor: '#1f1f1f',
//     // height: 150,
//   },
// });

// export default SearchTickerModal;
