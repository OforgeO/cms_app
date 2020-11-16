import React from 'react';
import { StyleSheet, Text, TouchableOpacity,  View, Platform, ScrollView, Picker} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Ionicons } from '@expo/vector-icons';
import { getEmployeeList } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { showToast } from './Global';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
export default class TimedetailsBook extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            employeeList:[],
            employee: '',
            employeeIndex: '',
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

        this.setState({loaded: false});
        await getEmployeeList(this.props.selDay, this.props.timeBook)
        .then((response) => {
            this.setState({loaded: true});
            if(response.data == false){
                return;
            }else{
                this.setState({employeeList: response.data})
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
        if(this.props.editBook == 1){
            this.setState({employee : this.props.assignId})
        }
    }

    gotoTimeBook(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const translator = TranslatorFactory.createTranslator();
        if(this.props.editBook == 1)
            translator.translate('確認画面').then(translated => {
                Actions.push("confirmbook", {selDay: this.props.selDay, bookName: this.props.bookName, phone: this.props.phone, email: this.props.email, numberOfPerson : this.props.numberOfPerson, timeBook: this.props.timeBook, employee: this.state.employee, employeeInfo: this.state.employeeList[this.state.employeeIndex-1], bookID: this.props.bookID, editBook: 1, personLabel: this.props.personLabel, title: translated, markedDates: this.props.markedDates});
            });
        else
            translator.translate('確認画面').then(translated => {
                Actions.push("confirmbook", {selDay: this.props.selDay, bookName: this.props.bookName, phone: this.props.phone, email: this.props.email, numberOfPerson : this.props.numberOfPerson, timeBook: this.props.timeBook, employee: this.state.employee, employeeInfo: this.state.employeeList[this.state.employeeIndex-1], personLabel: this.props.personLabel, title: translated, markedDates: this.props.markedDates});
            });
            
    }
    
    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={[styles.bookDetail]}>
                        {
                            this.props.bookName != '' ?
                            <PowerTranslator  style={[styles.detail]} text={'名前: ' + this.props.bookName}/>
                            :
                            null
                        }
                        {
                            this.props.phone != '' ?
                            <PowerTranslator  style={[styles.detail]} text={'電話番号: ' + this.props.phone}/>
                            :
                            null
                        }
                        {
                            this.props.email != '' ?
                            <PowerTranslator  style={[styles.detail]} text={'メールアドレス: ' + this.props.email}/>
                            :
                            null
                        }
                        {
                            this.props.numberOfPerson != '' ?
                            <PowerTranslator  style={[styles.detail]} text={this.props.personLabel + ': ' + this.props.numberOfPerson + '人'}/>
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
                            this.props.timeBook != '' && this.props.timeBook != undefined && this.props.timeBook != null ?
                            <PowerTranslator text={'予約時間: ' + this.props.timeBook}/>
                            :
                            null
                        }
                    </View>
                    <View style={{padding: 20}}>
                        <PowerTranslator  text={'担当者'}/>
                        <Picker 
                            selectedValue={this.state.employee}
                            onValueChange={(item, index) => {this.setState({employee: item});this.setState({employeeIndex: index})}}
                            itemStyle={{height: 50}}
                            >
                            <Picker.Item label='選択なし。' value='' />
                            {
                                this.state.employeeList.map((employee)=>{
                                    return <Picker.Item label={employee['NAME']} value={employee['ID']}/>
                                })
                            }
                        </Picker>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{backgroundColor: '#bcbcbc', padding: 15}}>
                            <PowerTranslator style={{color: 'white'}}  text={'戻る'}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.gotoTimeBook()} style={{backgroundColor: '#09888e', padding: 15}}>
                            <PowerTranslator style={{color: 'white'}}  text={'次へ'}/>
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