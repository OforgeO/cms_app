import React from 'react';
import { StyleSheet, View, Image, Platform, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../constants/Layout';
export default class Photo extends React.Component {
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
    
    render(){
        return (
            <View style={styles.container}>
                <Image resizeMode="contain" style={{width: '100%', height: '100%'}} source={{uri: Layout.serverUrl + this.props.link}}/>
            </View>
        );
    }
    
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
});
