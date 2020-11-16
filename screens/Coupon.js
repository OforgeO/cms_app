import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, Platform} from 'react-native';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { useCoupon, getCouponDetail } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../components/Global';
import Layout from '../constants/Layout';
import { Actions } from 'react-native-router-flux';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import * as SecureStore from 'expo-secure-store';
export default class Coupon extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            //eventDate:moment.duration().add({days:1,hours:3,minutes:40,seconds:50}), 
            eventDate: '',
            years: 0,
            months: 0,
            days:0,
            hours:0,
            mins:0,
            secs:0,
            loaded: true,
            couponDetail: [],
            lang: 'auto'
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

    updateTimer=()=>{
        
        const x = setInterval(()=>{
          let { eventDate} = this.state
    
          if(eventDate <=0){
            clearInterval(x)
          }else {
            eventDate = eventDate.subtract(1,"s")
            const years = eventDate.years();
            const months = eventDate.months();
            const days = eventDate.days()
            const hours = eventDate.hours()
            const mins = eventDate.minutes()
            const secs = eventDate.seconds()
            this.setState({
              years,
              months,
              days,
              hours,
              mins,
              secs,
              eventDate
            })
          }
        },1000)
    
    }

    async componentDidMount(){
        let lang = await SecureStore.getItemAsync("language");
        if(lang == null)
            lang = 'auto';
        this.setState({lang: lang});
        this.setState({loaded: false});
        await getCouponDetail(this.props.id)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                this.setState({couponDetail : response.data[0]})
                const date1 = moment();
                const date2 = moment(response.data[0]['COUPON_END_DATE'])
                this.setState({eventDate : moment.duration(date2.diff(date1))})
                this.updateTimer()
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    useCoupon(){
        
        this.setState({loaded: false});
        useCoupon(this.props.couponid)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                Actions.push("couponlist",{menuName: this.props.navigation.state.params.menuName});
                return;
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }
    
    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const { years, months, days, hours, mins, secs } = this.state
        return (
            <ScrollView style={{backgroundColor: this.state.couponDetail.PAGE_BACK_COLOR}}>
                <View style={[styles.container, {backgroundColor: this.state.couponDetail.PAGE_BACK_COLOR}]}>
                    {
                        this.state.couponDetail.COUPON_TITLE != '' ?
                        <View style={styles.couponTitle}>
                            <PowerTranslator text={this.state.couponDetail.COUPON_TITLE}/>
                        </View>
                        :
                        null
                    }
                    <View style={{backgroundColor: 'white', width: '100%', padding: 10}}>
                        {
                            this.state.couponDetail.DISCOUNT != '' ?
                            <View style={{alignItems: 'center'}}>
                                <PowerTranslator style={{color: 'red'}} text={this.state.couponDetail.DISCOUNT}/>
                            </View>
                            :
                            null
                        }
                        {
                            this.state.couponDetail.COUPON_DETAIL != '' ?
                            <View style={{marginTop: 10}}>
                                <PowerTranslator text={this.state.couponDetail.COUPON_DETAIL}/>
                            </View>
                            :
                            null
                        }
                        {
                            this.state.couponDetail.COUPON_IMAGE != '' && this.state.couponDetail.COUPON_IMAGE != null ?
                            <Image style={{ height: 200}} resizeMode="contain" source={{uri: Layout.serverUrl + this.state.couponDetail.COUPON_IMAGE}}/>
                            :
                            null
                        }

                        <View style={styles.expire}>
                            <PowerTranslator text={'有効期限'}/>
                            <PowerTranslator text={moment(this.state.couponDetail.COUPON_END_DATE).zone('+0900').format('YYYY')+'年'+moment(this.state.couponDetail.COUPON_END_DATE).zone('+0900').format('MM')+'月'+moment(this.state.couponDetail.COUPON_END_DATE).zone('+0900').format('DD')+'日'+moment(this.state.couponDetail.COUPON_END_DATE).zone('+0900').format('HH')+'時'+moment(this.state.couponDetail.COUPON_END_DATE).zone('+0900').format('mm')+'分まで'} />
                        </View>
                        <View style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 4}}>
                            {
                                this.state.couponDetail.COUPON_NOTICE_CHK1 == 'Y' ?
                                <PowerTranslator style={{color: '#525252'}} text={'※他特典割引券、他サービス併用不可'}/>
                                :
                                null
                            }
                            {
                                this.state.couponDetail.COUPON_NOTICE_CHK2 == 'Y' ?
                                <PowerTranslator style={{color: '#525252'}} text={'※なくなり次第終了とさせていただきます'}/>
                                :
                                null
                            }
                            {
                                this.state.couponDetail.COUPON_NOTICE_CHK3 == 'Y' ?
                                <PowerTranslator style={{color: '#525252'}} text={'※お一人様１回限り有効。'}/>
                                :
                                null
                            }
                            
                        </View>
                    </View>
                    {
                        this.state.couponDetail.COUNTDOWN_DISP_YN == 'Y' ?
                        <View style={ styles.timeCount }>
                            <View>
                                {
                                    years > 0 ?
                                    <PowerTranslator style={{color : 'red', fontSize: 17}} text={years+'年'+months+'月'+days+'日'+hours+'時間'+mins+'分'+secs+'秒'}/>
                                    :
                                    months > 0 ?
                                    <PowerTranslator style={{color : 'red', fontSize: 17}} text={months+'月'+days+'日'+hours+'時間'+mins+'分'+secs+'秒'}/>
                                    :
                                    days > 0 ?
                                    <PowerTranslator style={{color : 'red', fontSize: 17}} text={days+'日'+hours+'時間'+mins+'分'+secs+'秒'}/>
                                    :
                                    hours == 0 && mins == 0 && secs == 0 ?
                                    <PowerTranslator text={'終了しました'}/>
                                    :
                                    <PowerTranslator style={{color : 'red', fontSize: 17}} text={hours+'時間'+mins+'分'+secs+'秒' }/>
                                }
                                
                            </View>
                        </View>
                        :
                        null
                    }
                    
                    {
                        this.state.couponDetail.USE_SETTING_YN == 'Y' ?
                        <View style={{width: '100%', padding: 10, backgroundColor: 'white', alignItems: 'center'}}>
                            <TouchableOpacity onPress={()=>this.useCoupon(this.state.couponDetail.ID)} style={[styles.useBtn, { backgroundColor: this.state.couponDetail.BUTTON_BACK_COLOR}]}>
                                <PowerTranslator style={{color: 'white'}} text={'使用する'}/>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                    }
                    
                </View>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </ScrollView>
        );
    }
    
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 10,
    alignItems: 'center',
    marginBottom: 20
  },
  couponTitle: {
      backgroundColor: '#d4d4d4',
      padding: 10,
      width: '100%',
      alignItems: 'center'
  },
  expire: {
      backgroundColor: '#d4d4d4',
      width: '100%',
      alignItems: 'center',
      padding: 5
  },
  timeCount: {
    width: '100%', 
    alignItems: 'center', 
    backgroundColor: '#fdfff0', 
    paddingTop: 5, 
    paddingBottom: 10
  },
  useBtn: {
    backgroundColor: '#eee',
    width: '100%', 
    textAlign: 'center', 
    borderRadius: 5,
    padding: 10,
    alignItems: 'center'
  }
});
