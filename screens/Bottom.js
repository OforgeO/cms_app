import React from 'react';
import { StyleSheet, View, } from 'react-native';
import BottomTabNavigator from '../navigation/BottomTabNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../components/Header';

import Shop from './Shop';
import Menu from '../components/Menu';
import Banner from '../components/Banner';
const Stack = createStackNavigator();
export default class Bottom extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
    }
    /*static navigationOptions = ({navigation}) => ({
        headerTitle: <Header navigation={navigation} />,
    });*/
    
    render(){
        
        return (
            <View style={styles.container}>
                <Header type={this.props.type} />
                {
                    this.props.type == 1 || this.props.type == 4 || this.props.type == 5 || this.props.type == 7 || this.props.type == 9 || this.props.type == 10?
                    <NavigationContainer >
                        <Stack.Navigator screenOptions={{headerShown: false}}>
                            <Stack.Screen name={this.props.type} component={BottomTabNavigator}  />
                        </Stack.Navigator> 
                    </NavigationContainer>
                    :
                    null 
                }
                {
                    this.props.type == 2 || this.props.type == 3 || this.props.type == 8 || this.props.type == 11 ?
                    <Shop type={this.props.type} />
                    :
                    null
                }
                {
                    this.props.type == 6 ?
                    <View style={{height: '100%', flex: 1}}>
                        <Banner />
                        <Menu type={this.props.type} />
                    </View>
                    :
                    null
                }
            </View>
        );
    }
}

Bottom.navigationOptions = {
    header: null
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
});