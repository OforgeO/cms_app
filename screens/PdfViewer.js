import React from 'react';
import { StyleSheet, View, WebView, Dimensions, Text, TouchableOpacity } from 'react-native';
import PDFReader from 'rn-pdf-reader-js';
import { Ionicons } from '@expo/vector-icons';

export default class PDFViewer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.title}`,
    headerRight: <TouchableOpacity onPress={() => {navigation.navigate('home')}}><View><Ionicons size={25} style={{marginRight: 15}} name={Platform.OS === 'ios'?'ios-home' : 'md-home'}/></View></TouchableOpacity>,
    headerTitleStyle: {
        textAlign: 'center',
        flexGrow:1,
        alignSelf:'center',
    },
    headerStyle: {
        backgroundColor: 'white',
    },
    headerTintColor: 'black',
  });

  render() {
    return (
      
      <View style={styles.container}>
        <PDFReader
          source={{ uri: this.props.link }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});