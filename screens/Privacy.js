import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class Privacy extends React.Component {
    constructor(props){
        super(props);
        this.state = {       
        };
    }
    
    render(){
        return (
        
            <View style={styles.container}>
                
            </View>
        );
    }
    
}

Privacy.navigationOptions = {
    title: '規約',
    headerRight: <View><Ionicons size={25} style={{marginRight: 15}} name={Platform.OS === 'ios'?'ios-share' : 'md-share'}/></View>,
    headerTitleStyle: {
        textAlign: 'center',
        flexGrow:1,
        alignSelf:'center',
    },
    headerStyle: {
        backgroundColor: 'white',
    },
    headerTintColor: '#fff',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 20
  },
  
});
