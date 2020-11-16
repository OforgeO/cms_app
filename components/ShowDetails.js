import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class ShowDetails extends React.Component {
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
        <Text>{this.props.details}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 10
  },
});