import React from 'react';
import { StyleSheet, Text, TouchableOpacity, FlatList, View, Image, Dimensions, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Ionicons } from '@expo/vector-icons';
import { getPhilosophy, getIntroduction, getHistory} from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../components/Global';

export default class InformationMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            philosophy: '',
            introduction: '',
            history: '',
            loaded: true
        }
    }

    async componentDidMount(){
        this.setState({loaded: false})
        await getPhilosophy()
        .then((response) => {  
            if(response.data == false){
                return;
            }else{
                this.setState({philosophy : response.data[0]['COMMENT']})
            }
        })
        await getIntroduction()
        .then((response) => {  
            if(response.data == false){
                return;
            }else{
                this.setState({introduction : response.data[0]['COMMENT']})
            }
        })
        await getHistory()
        .then((response) => { 
            this.setState({loaded: true})
            if(response.data == false){
                return;
            }else{
                this.setState({history : response.data[0]['HISTORY']})
            }
        })
        .catch((error) => {
            this.setState({loaded: true})
            showToast();
        });
    }

    static navigationOptions = ({navigation}) => ({
        title: 'インフォ',
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

    goPage(title, text){
        Actions.push('showdetails', {title: title, details: text});
    }

    goProfile(title){
        Actions.push('profile', { title : title})
    }
    goStaff(title){
        Actions.push('staff', { title : title})
    }

    render(){
        return (
            <View style={styles.container}>
                {
                    /*
                <TouchableOpacity onPress={() => this.goPage('企業理念', this.state.philosophy)}>
                    <View style={styles.item}>
                            <Text style={styles.title}>企業理念</Text>
                            <Ionicons size={18} style={{marginRight: 10}} name={'ios-arrow-forward'} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goPage('事業紹介', this.state.introduction)}>
                    <View style={styles.item}>
                        <Text style={styles.title}>事業紹介</Text>
                        <Ionicons size={18} style={{marginRight: 10}} name={'ios-arrow-forward'} />
                    </View>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => this.goStaff('スタッフ')}>
                    <View style={styles.item}>
                        <Text style={styles.title}>スタッフ</Text>
                        <Ionicons size={18} style={{marginRight: 10}} name={'ios-arrow-forward'} />
                    </View>
                </TouchableOpacity>*/
                }
                <TouchableOpacity onPress={() => this.goProfile('イソフォ')}>
                    <View style={styles.item}>
                        <Text style={styles.title}>インフォ</Text>
                        <Ionicons size={18} style={{marginRight: 10}} name={'ios-arrow-forward'} />
                    </View>
                </TouchableOpacity>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
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
    }
});