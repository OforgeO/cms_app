import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, Text, FlatList} from 'react-native';
import { Actions } from 'react-native-router-flux';

import { getNews } from '../constants/Api';
import { showToast } from '../components/Global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { Ionicons } from '@expo/vector-icons';

export default class Notice extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            layout_type: 0,
            loaded: true,
            no_data : 0,
            news: []
        }
    }
    static navigationOptions = ({navigation}) => ({
        title: '新着情報',
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

    async componentDidMount(){
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={{paddingTop: 10, width: '100%', alignItems: 'center'}}>
                    <Text>通知はありません。</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    item: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        paddingLeft: 15
    }
});