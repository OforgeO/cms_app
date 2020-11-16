import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, ScrollView} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Ionicons } from '@expo/vector-icons';
import { addBook, updateBook, getBookOrder, addBookOrder } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { showToast } from './Global';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';

export default class ConfirmBook extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            employeeName: '',
            bookOrder: 0,
            lang: 'auto'
        }
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

    async componentDidMount(){
        let lang = await SecureStore.getItemAsync("language");
        if(lang == null)
            lang = 'auto';
        this.setState({lang: lang});
        if(this.props.type == 2){
            this.setState({loaded: false});
            getBookOrder(moment().format('YYYY-MM-DD'))
            .then(async (response) => {
                
                this.setState({loaded: true});
                this.setState({bookOrder : response.data.length+1})
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
        }else{
            this.setState({employeeName: this.props.employeeInfo['NAME']})
        }
        
    }

    async addBook(){
        let user_id = await SecureStore.getItemAsync('user_id');
        if(this.props.type == 2 ){
            this.setState({loaded: false});
            addBookOrder(this.props.bookName, this.props.phone, this.props.email, this.props.numberOfPerson, this.state.bookOrder,  moment().format('YYYY-MM-DD'), this.props.type, user_id)
            .then(async (response) => {
                this.setState({loaded: true});
                if(response.data == false){
                    return;
                }else{
                    //Actions.popTo('reservation',{ refresh: {} })
                    //Actions.refresh()
                    Actions.reset("home")
                }
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
        }else{
            if(this.props.editBook == 1){
                this.setState({loaded: false});
                updateBook(this.props.bookName, this.props.phone, this.props.email, this.props.numberOfPerson, this.props.selDay, this.props.timeBook, this.props.employee, user_id, this.props.bookID, this.props.markedDates)
                .then(async (response) => {
                    this.setState({loaded: true});
                    if(response.data == false){
                        return;
                    }else{
                        Actions.popTo('reservation',{ refresh: {} })
                        Actions.refresh()
                    }
                })
                .catch((error) => {
                    this.setState({loaded: true});
                    showToast();
                });
            }
            else{
                this.setState({loaded: false});
                addBook(this.props.bookName, this.props.phone, this.props.email, this.props.numberOfPerson, this.props.selDay, this.props.timeBook, this.props.employee, user_id, this.props.markedDates)
                .then(async (response) => {
                    this.setState({loaded: true});
                    if(response.data == false){
                        return;
                    }else{
                        //Actions.popTo('reservation',{ refresh: {} })
                        //Actions.refresh()
                        Actions.reset("home")
                    }
                })
                .catch((error) => {
                    this.setState({loaded: true});
                    showToast();
                });
            }
        }    
    }

    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={[styles.bookDetail]}>
                        {
                            this.props.bookName != '' ?
                            <PowerTranslator style={[styles.detail]} text={'名前: ' + this.props.bookName} />
                            :
                            null
                        }
                        {
                            this.props.phone != '' ?
                            <PowerTranslator style={[styles.detail]} text={'電話番号: ' + this.props.phone} />
                            :
                            null
                        }
                        {
                            this.props.email != '' ?
                            <PowerTranslator style={[styles.detail]} text={'メールアドレス: ' + this.props.email} />
                            :
                            null
                        }
                        {
                            this.props.numberOfPerson != '' ?
                            <PowerTranslator style={[styles.detail]} text={this.props.personLabel + ': ' + this.props.numberOfPerson+'人'} />
                            :
                            null
                        }
                        {
                            this.props.markedDates == undefined || this.props.markedDates == null || Object.keys(this.props.markedDates).length == 0 ?
                            this.props.selDay != null ?
                            <PowerTranslator  style={[styles.detail]} text={'予約日付: '+moment(this.props.selDay).format('YYYY')+'年'+moment(this.props.selDay).format('MM')+'月'+moment(this.props.selDay).format('DD')+'日'}/>
                            :
                            null
                            :
                            <PowerTranslator  style={[styles.detail]} text={'予約日付: '+moment(Object.keys(this.props.markedDates)[0]).format('YYYY')+'年'+moment(Object.keys(this.props.markedDates)[0]).format('MM')+'月'+moment(Object.keys(this.props.markedDates)[0]).format('DD')+'日　～　'+moment(Object.keys(this.props.markedDates)[Object.keys(this.props.markedDates).length-1]).format('YYYY')+'年'+moment(Object.keys(this.props.markedDates)[Object.keys(this.props.markedDates).length-1]).format('MM')+'月'+moment(Object.keys(this.props.markedDates)[Object.keys(this.props.markedDates).length-1]).format('DD')+'日'}/>
                        }
                        {
                            this.props.timeBook != '' && this.props.timeBook != undefined ?
                            <PowerTranslator style={[styles.detail]} text={'予約時間: ' + this.props.timeBook} />
                            :
                            null
                        }
                        {
                            this.state.employeeName != '' && this.state.employeeName != undefined ?
                            <PowerTranslator style={[styles.detail]} text={'担当者: ' + this.state.employeeName} />
                            :
                            null
                        }
                        {
                            this.props.type == 2?
                            <PowerTranslator style={[styles.detail]} text={'順番: ' + this.props.bookOrder+'番目'} />
                            :
                            null
                        }
                    </View>
                    
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20}}>
                        
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{backgroundColor: '#bcbcbc', padding: 15}}>
                            <PowerTranslator style={{color: 'white'}} text={'戻る'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.addBook()} style={{backgroundColor: '#09888e', padding: 15}}>
                            <PowerTranslator style={{color: 'white'}} text={'次へ'} />
                        </TouchableOpacity>
                    </View>
                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
                </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    bookDetail:{
        backgroundColor: '#eee',
        padding: 10
    },
    detail: {
        paddingBottom: 7
    },
    time: {
        backgroundColor: 'white',
        borderColor: '#7d7d7d',
        borderTopWidth: 1,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    booktimeBtn: {
        backgroundColor: '#efefef',
        borderRadius: 30,
        width: 150,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});