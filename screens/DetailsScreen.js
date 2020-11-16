//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet, Button, Share } from 'react-native';
//import all the basic component we have used

export default class DetailsScreen extends React.Component {
  //Detail Screen to show from any Open detail button
  static navigationOptions = {
    //To set the header image and title for the current Screen
    //Title
    headerRight:( 
      <View style={{marginRight:10}}>
        <Button
          onPress={() => 
            Share.share({
              title: 'Share via',
              url: 'any link'
            })
          }
          title="Condividi"
          color="#000"
        />
      </View>
      )
  };
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Details!</Text>
      </View>
    );
  }
}