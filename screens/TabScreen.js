import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class TabScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }
  go(){
    Actions.push("forgot")
  }
  render(){
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.go()}>
          <Text>AAAA</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
}

TabScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
