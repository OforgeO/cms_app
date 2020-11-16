import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, ScrollView, Alert} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Ionicons } from '@expo/vector-icons';
import { getRservableDay } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import { showToast } from './Global';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
LocaleConfig.locales['zh-Hans'] = {
    monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    dayNames: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
    amDesignator: '上午',
    pmDesignator: '下午',
};

LocaleConfig.defaultLocale = 'zh-Hans';
let DISABLED_DAYS = []
let startDay = false
let dates = {}
let startDate = ''
export default class TimeBook extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentDay: moment().format(),
            markedDates: {
                
            },
            selMonth: moment().month(),
            selYear: moment().year(),
            selDay : '',
            loaded: true,
            timeunit: 0,
            startTime: '',
            endTime: '',
            lang: 'auto',
            markingType: 'simple',

            start: {},
            end: {}, 
            period: {},
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
        await getRservableDay()
        .then((response) => {
            this.setState({loaded: true});
            if(response.data == false){
                //showToast();
                return;
            }else{
                if(response.data[0]['TIME_WEEK_MON'] == 'N'){
                    DISABLED_DAYS.push("Monday")
                }
                if(response.data[0]['TIME_WEEK_TUE'] == 'N'){
                    DISABLED_DAYS.push("Tuesday")
                }
                if(response.data[0]['TIME_WEEK_WED'] == 'N'){
                    DISABLED_DAYS.push("Wednesday")
                }
                if(response.data[0]['TIME_WEEK_THU'] == 'N'){
                    DISABLED_DAYS.push("Thursday")
                }
                if(response.data[0]['TIME_WEEK_Friday'] == 'N'){
                    DISABLED_DAYS.push("Friday")
                }
                if(response.data[0]['TIME_WEEK_SAT'] == 'N'){
                    DISABLED_DAYS.push("Saturday")
                }
                if(response.data[0]['TIME_WEEK_SUN'] == 'N'){
                    DISABLED_DAYS.push("Sunday")
                }
                this.setState({timeunit : response.data[0]['TIME_UNIT']})
                this.setState({startTime : response.data[0]['START_HOUR']})
                this.setState({endTime: response.data[0]['END_HOUR']})
                if(response.data[0]['TIME_UNIT'] == 1440)
                    this.setState({markingType: 'period'})
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });

        if(this.props.editBook == 1){
            this.setState({selDay : this.props.bookDate})
            this.getDaysInMonth(moment().month(), moment().year(),  DISABLED_DAYS, this.props.bookDate);
        }
        else
            this.getDaysInMonth(moment().month(), moment().year(),  DISABLED_DAYS);
    }

    getDaysInMonth(month, year, days, selDay = '', day = '') {
        if(month != null && year != null && days != null && selDay == ''){
            this.setState({selMonth: month})
            this.setState({selYear: year})
            this.state.selMonth = month;
            this.state.selYear = year;
        } 
        let pivot = moment().month(this.state.selMonth).year(this.state.selYear).startOf('month')
        const end = moment().month(this.state.selMonth).year(this.state.selYear).endOf('month')
        
        const disabled = { disabled: true, disableTouchEvent: true}
        while(pivot.isBefore(end)) {
            days.forEach((day) => {
            dates[pivot.day(day).format("YYYY-MM-DD")] = disabled
            })
            pivot.add(7, 'days')
        }
        days.forEach((day) => {
            dates[pivot.day(day).format("YYYY-MM-DD")] = disabled
        })
        if(selDay != ''){
            let selDate = selDay;
            if(this.state.timeunit != 1440){
                dates = [];
                dates[selDate] = { selected: true}
                this.setState({markedDates: dates})
            }else{
                if(day != '')
                    this.setDay(day)
            }
        }
    }

    getDateString(timestamp) {
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
    
        let dateString = `${year}-`
        if (month < 10) {
          dateString += `0${month}-`
        } else {
          dateString += `${month}-`
        }
        if (day < 10) {
          dateString += `0${day}`
        } else {
          dateString += day
        }
    
        return dateString
    }
    
    getPeriod(startTimestamp, endTimestamp) {
        const period = {}
        let currentTimestamp = startTimestamp
        while (currentTimestamp < endTimestamp) {
          const dateString = this.getDateString(currentTimestamp)
          period[dateString] = {
            color: '#2E66E7',
            startingDay: currentTimestamp === startTimestamp,
            selected: true
          }
          currentTimestamp += 24 * 60 * 60 * 1000
        }
        const dateString = this.getDateString(endTimestamp)
        period[dateString] = {
          color: '#2E66E7',
          endingDay: true,
          selected: true
        }
        return period
    }
    
    setDay(dayObj) {
        const { start, end } = this.state
        const {
          dateString, day, month, year,
        } = dayObj
        // timestamp returned by dayObj is in 12:00AM UTC 0, want local 12:00AM
        const timestamp = new Date(year, month - 1, day).getTime()
        const newDayObj = { ...dayObj, timestamp }
        // if there is no start day, add start. or if there is already a end and start date, restart
        
        if (startDay == false) {
            
          const period = {
            [dateString]: {
              color: '#2E66E7',
              startingDay: false,
              selected: true
            },
          }
          this.setState({ start: newDayObj, markedDates:period, end: {} })
          startDay = true
        } else {
          // if end date is older than start date switch
          const { timestamp: savedTimestamp } = start
          if (savedTimestamp > timestamp) {
            const period = this.getPeriod(timestamp, savedTimestamp)
            this.setState({ start: newDayObj, end: start, markedDates:period })
          } else {
            const period = this.getPeriod(savedTimestamp, timestamp)
            this.setState({ end: newDayObj, start, markedDates:period })
          }
          startDay = false 
        }
    }

    gotoTimeBook(){
        if(this.state.selDay != ''){
            TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
            const translator = TranslatorFactory.createTranslator();
            if(this.props.editBook == 1){
                translator.translate('時間選択').then(translated => {
                    Actions.push("timedetailsbook", {selDay: this.state.selDay, bookName: this.props.bookName, phone: this.props.phone, email: this.props.email, numberOfPerson : this.props.numberOfPerson, timeUnit: this.state.timeunit, startTime: this.state.startTime, endTime: this.state.endTime,
                        editBook: 1, assignId: this.props.assignId,bookTime: this.props.bookTime, bookID: this.props.bookID, personLabel: this.props.personLabel, title: translated});
                });
            }else{
                translator.translate('時間選択').then(translated => {
                    if(this.state.timeunit != 1440)
                        Actions.push("timedetailsbook", {selDay: this.state.selDay, bookName: this.props.bookName, phone: this.props.phone, email: this.props.email, numberOfPerson : this.props.numberOfPerson, timeUnit: this.state.timeunit, startTime: this.state.startTime, endTime: this.state.endTime, personLabel: this.props.personLabel, title: translated});
                    else
                        Actions.push("chooseassign", {selDay: this.state.selDay, bookName: this.props.bookName, phone: this.props.phone, email: this.props.email, numberOfPerson : this.props.numberOfPerson, timeUnit: this.state.timeunit, startTime: this.state.startTime, endTime: this.state.endTime, personLabel: this.props.personLabel, title: translated, markedDates: this.state.markedDates});
                });
            }
        }
        else
            Alert.alert(
                '警告！',
                '予約日付を選択してください。',
                [
                    { text: '確認', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
            );
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
                            <PowerTranslator style={[styles.detail]} text={this.props.personLabel + ': ' + this.props.numberOfPerson + '人'} />
                            :
                            null
                        }
                    </View>
                    <View>
                        <CalendarList style={{ width: '100%',height: 380,}}
                        current={this.state.currentDay}
                        minDate={this.state.currentDay}
                        horizontal
                        pastScrollRange={0}
                        pagingEnabled
                        onDayPress={day => {
                            this.setState({selDay : day.dateString})
                            this.getDaysInMonth(null, null, DISABLED_DAYS,day.dateString, day)
                        }}
                        disableMonthChange={true}
                        onVisibleMonthsChange={(date) => {
                            if(date.length == 1)
                                this.getDaysInMonth(date[0].month - 1, date[0].year, DISABLED_DAYS, this.state.selDay)
                        }}
                        monthFormat="yyyy年 MMMM"
                        markingType={this.state.markingType}
                        theme={{
                            selectedDayBackgroundColor: '#2E66E7',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#2E66E7',
                            backgroundColor: '#eaeef7',
                            calendarBackground: '#eee',
                            textDisabledColor: '#d9dbe0',
                        }}
                        markedDates={this.state.markedDates}
                        />
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20}}>
                        
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{backgroundColor: '#bcbcbc', padding: 15}}>
                            <PowerTranslator style={{color: 'white'}} text={'戻る'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.gotoTimeBook()} style={{backgroundColor: '#09888e', padding: 15}}>
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
    }
});