import React from 'react';
import { StyleSheet, View, Text, } from 'react-native';
import Drawer from 'react-native-drawer'
import { Actions } from 'react-native-router-flux';
export default class DrawerLayout extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userErr : false,
            pwdErr : false,
            token: '',
            login_id: '',
            password: '',
            loaded: false,
            type: 0
        } 
    }

    componentWillReceiveProps(){
        
    }

    render(){
        return (
            <View>
                <Text>aaa</Text>
            </View>
        );
    }
}
DrawerLayout.navigationOptions = {
    header: null
}
const styles = StyleSheet.create({
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
    main: {paddingLeft: 3},
});
