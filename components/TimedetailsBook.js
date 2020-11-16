import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, ScrollView} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Ionicons } from '@expo/vector-icons';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
export default class TimedetailsBook extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            timeList:[],
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

        let timeUnit = parseInt(this.props.timeUnit)
        let pivot = moment(this.props.selDay+' '+this.props.startTime)
        let end = moment(this.props.selDay+' '+this.props.endTime)
        if(this.props.startTime > this.props.endTime){
            var date = new Date(this.props.selDay)
            date.setDate(date.getDate() + 1)
            end = moment(date.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 10)+' '+this.props.endTime)
        }
        
        var tempTime = []
        var isSet = 0;
        
        while(pivot.isBefore(end)) {
            var temp = [moment(pivot).format('HH:mm'), false]
            tempTime.push(temp);
            pivot.add(timeUnit, 'minutes')
            isSet ++;
        }
        if(isSet > 1){
            var temp = [moment(pivot).format('HH:mm'), false]
            tempTime.push(temp);
        }
        if(this.props.editBook == 1){
            var selTimeArr = this.props.bookTime.split(',');
            if(selTimeArr.length > 0){
                for(var i = 0;i<selTimeArr.length;i++){
                    for(var j = 0;j<tempTime.length;j++){
                        if(tempTime[j][0] == selTimeArr[i])
                            tempTime[j][1] = true
                    }
                }
            }
            
            this.setState({timeList : tempTime})
        }
        else
            this.setState({timeList : tempTime})
    }

    gotoTimeBook(){
        let time = this.state.timeList
        let timeVal = '';
        let index = 0;
        time.map((value) => {
            if(value[1]){
                if(index > 0)
                    timeVal += ',';
                timeVal += value[0]
                index++;
            }
        })
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const translator = TranslatorFactory.createTranslator();
        if(this.props.editBook == 1){
            translator.translate('担当者選択').then(translated => {
                Actions.push("chooseassign", {selDay: this.props.selDay, bookName: this.props.bookName, phone: this.props.phone, email: this.props.email, numberOfPerson : this.props.numberOfPerson, timeBook: timeVal, editBook: 1, assignId: this.props.assignId, bookID: this.props.bookID, personLabel: this.props.personLabel, title: translated});
            });
        }
        else
            translator.translate('担当者選択').then(translated => {
                Actions.push("chooseassign", {selDay: this.props.selDay, bookName: this.props.bookName, phone: this.props.phone, email: this.props.email, numberOfPerson : this.props.numberOfPerson, timeBook: timeVal, personLabel: this.props.personLabel, title: '担当者選択'});
            });
            
    }
    bookTime(index){
        var temp = this.state.timeList;
        temp[index][1] = !temp[index][1];
        this.setState({timeList : temp})
    }

    renderTime(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return this.state.timeList.map((time,index) => {
            return <View key={time[0]} style={styles.time}>
                <Text style={{fontSize: 20, color: '#5a5a5a'}} >{time[0]}</Text>
                {
                    time[1] == false ?
                    <TouchableOpacity style={styles.booktimeBtn} onPress={() => {this.bookTime(index)}}>
                        <PowerTranslator style={{color: '#8b8b8b'}} text={'この時間で予約'}/>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={[styles.booktimeBtn, {backgroundColor:'#6eac61'}]} onPress={() => {this.bookTime(index)}}>
                        <PowerTranslator style={{color: 'white'}} text={'この時間で予約'}/>
                    </TouchableOpacity>
                }

            </View>
        })
    }

    
    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={[styles.bookDetail]}>
                        {
                            this.props.bookName != '' ?
                            <PowerTranslator style={[styles.detail]} text={'名前: '+this.props.bookName} />
                            :
                            null
                        }
                        {
                            this.props.phone != '' ?
                            <PowerTranslator style={[styles.detail]} text={'電話番号: '+this.props.phone} />
                            :
                            null
                        }
                        {
                            this.props.email != '' ?
                            <PowerTranslator style={[styles.detail]} text={'メールアドレス: '+this.props.email} />
                            :
                            null
                        }
                        {
                            this.props.numberOfPerson != '' ?
                            <PowerTranslator style={[styles.detail]} text={this.props.personLabel + ': '+this.props.numberOfPerson+'人'} />
                            :
                            null
                        }
                        {
                            this.props.selDay != null ?
                            <PowerTranslator text={'予約日付: '+moment(this.props.selDay).format('YYYY')+'年'+moment(this.props.selDay).format('MM')+'月'+moment(this.props.selDay).format('DD')+'日'}/>
                            :
                            null
                        }
                    </View>
                    <View style={{borderBottomWidth: 1}}>
                        {
                            this.renderTime()
                        }
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{backgroundColor: '#bcbcbc', padding: 15}}>
                            <PowerTranslator style={{color: 'white'}} text={'戻る'}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.gotoTimeBook()} style={{backgroundColor: '#09888e', padding: 15}}>
                            <PowerTranslator style={{color: 'white'}} text={'次へ'}/>
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
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    booktimeBtn: {
        backgroundColor: '#efefef',
        borderRadius: 30,
        width: 150,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    }
});