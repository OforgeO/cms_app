import React from 'react';
import { StyleSheet, Text, TouchableOpacity, FlatList, View, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Ionicons } from '@expo/vector-icons';
import { getCoupon } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
export default class StampList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            couponList: []
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.menuName == undefined ? 'クーポン' : navigation.state.params.menuName,
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

    UNSAFE_componentWillReceiveProps(){
        this.refresh()
    }

    async refresh(){
        let user_id = await SecureStore.getItemAsync('user_id');
        
        this.setState({loaded: false});
        getCoupon(`${moment().format("YYYY-MM-DD HH:mm:ss")}`, user_id)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                this.setState({couponList: response.data})
                return;
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    async componentDidMount(){
        this.refresh();
    }

    render(){
        let menu_name = this.props.navigation.state == undefined ? 'クーポン' : this.props.navigation.state.params.menuName
        return (
            <View style={styles.container}>
                <View>
                    <FlatList
                        data={this.state.couponList}
                        renderItem={(coupon) => <CouponItem couponInfo={coupon.item} menuName={menu_name}/>}
                        keyExtractor={coupon => coupon.ID}
                    />
                </View>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
}

class CouponItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            lang: 'auto'
        }
    }

    async componentDidMount(){
        let lang = await SecureStore.getItemAsync("language");
        if(lang == null)
            lang = 'auto';
        this.setState({lang: lang});
    }

    detail(id, couponid){
        Actions.push("coupon", {id : id, couponid: couponid, title: this.props.menuName})
    }

    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <TouchableOpacity onPress={() => this.detail(this.props.couponInfo.ID, this.props.couponInfo.COUPONID)}>
                <View style={[styles.couponList]}>
                    <PowerTranslator style={{paddingLeft: 10}} text={this.props.couponInfo.COUPON_TITLE} />
                    <Ionicons size={20} style={{paddingHorizontal: 10}} name={"ios-arrow-forward"}/>
                </View>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    couponList: {
        flexDirection: 'row', justifyContent: 'space-between', 
        paddingVertical: 10, 
        borderColor: 'gray', width: '100%', 
        borderBottomWidth: 1, alignItems: 'center'
    }
});