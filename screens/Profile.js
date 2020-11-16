import React from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, TouchableOpacity, Keyboard, Picker, Platform} from 'react-native';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Actions } from 'react-native-router-flux';
import Constants from 'expo-constants';
import { registerUser, deviceExist } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../components/Global';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import * as SecureStore from 'expo-secure-store';
let selDate = new Date();
export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            date : `${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`,
            mode : 'date',
            show : false,
            deviceId : '',
            deviceOS : Platform.OS,
            userID : Math.floor(Math.random() * 1000000) + 1,
            nickname : '',
            sex : 'M',
            loaded: true,
            pageLoad: true,
            token: ''
        }
    }

    async componentDidMount(){
        await this.registerForPushNotificationsAsync();
        await SecureStore.setItemAsync('user_id', this.state.userID.toString());
        if(this.state.token != ''){
            this.setState({loaded: false});
            deviceExist(this.state.deviceId)
            .then(async (response) => {
                this.setState({loaded: true});
                if(response.data == false || response.data.length == 0){
                    this.setState({pageLoad: false})    
                    return;
                }else{
                    if(this.props.title == undefined || this.props.title == null){
                        await SecureStore.setItemAsync('user_id', response.data[0].USER_ID.toString());
                        Actions.reset("home");
                    }
                    else{
                        await SecureStore.setItemAsync('user_id', response.data[0].USER_ID.toString());
                        this.setState({pageLoad: false})
                        this.setState({date : `${moment(response.data[0].BIRTHDAY).format('YYYY')}-${moment(response.data[0].BIRTHDAY).format('MM')}-${moment(response.data[0].BIRTHDAY).format('DD')}`})
                        this.setState({userID : response.data[0].USER_ID})
                        this.setState({sex: response.data[0].SEX})
                        this.setState({nickname: response.data[0].NICK_NAME})
                        selDate = new Date(this.state.date);
                    }
                        
                    return;
                }
                
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
        }
        
    }

    registerForPushNotificationsAsync = async () => {
        
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            
          return;
        }
        try {
          let token = await Notifications.getExpoPushTokenAsync(); 
          this.setState({token : token})
        } catch (error) {
          this.setState({token : ''})
        }
    };

    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.title == undefined ? '' : `${navigation.state.params.title}`,
        headerRight: navigation.state.params.title == undefined ? '' : <TouchableOpacity onPress={() => {navigation.navigate('home')}}><View><Ionicons size={25} style={{marginRight: 15}} name={Platform.OS === 'ios'?'ios-home' : 'md-home'}/></View></TouchableOpacity>,
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

    hideDatePicker = () => {
        this.setState({show: false});
        this.state.show = false;
    }

    handleConfirm = date => {
        selDate = date;
        this.state.show = false;
        this.setState({date : `${moment(date).format('YYYY')}-${moment(date).format('MM')}-${moment(date).format('DD')}`});
        this.hideDatePicker();
    }

    showDatePicker(){
        this.setState({show: true})
    }

    goToHome(){
        this.setState({loaded: false});
        registerUser(this.state.userID, this.state.nickname, this.state.date, this.state.sex, this.state.deviceId, this.state.deviceOS, this.state.token)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false){
                showToast('レジスタ障害!');
                return;
            }else{
                if(this.props.title == undefined || this.props.title == null)
                    Actions.reset("home");
                else
                    this.props.navigation.goBack();
                return;
            }
            
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
        
    }
    
    render(){
        return (
            <View style={styles.container}>
                {
                    this.state.pageLoad == true ?
                    null:
                    <KeyboardAvoidingView bebehavior="padding"  style={styles.container}>
                        <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
                            <View style={styles.logoContainer}>
                                <Text style={[styles.labelText, {textAlign: 'center', fontSize: 20}]}>プロフィール設定</Text>

                                <View style={styles.infoSection}>
                                    <Text>ニックネーム</Text>
                                    <TextInput  placeholder="ニックネーム"
                                        placeholderTextColor='rgba(0, 0, 0, 0.4 )'
                                        returnKeyType="next"
                                        style={styles.input}
                                        value={this.state.nickname}
                                        onChangeText={value=>this.setState({nickname : value})}
                                    />
                                </View>
                                
                                <View style={styles.infoSection}>
                                    <Text>生年月日</Text>
                                    <TouchableOpacity onPress={() => this.showDatePicker()} style={{width: '40%', borderWidth: 0}}>
                                        <Text>{this.state.date}</Text>
                                    </TouchableOpacity>
                                    {
                                        this.state.show && (
                                        <DateTimePickerModal
                                            isVisible = { this.state.show}
                                            date = { selDate }
                                            mode={'date'}
                                            onConfirm={this.handleConfirm}
                                            onCancel={this.hideDatePicker}
                                        />)
                                    }
                                    
                                </View>

                                <View style={[styles.infoSection, {borderBottomWidth: 1}]}>
                                    <Text>性別</Text>
                                    <Picker selectedValue={this.state.sex}  itemStyle={{height: 50}}
                                    style={{width: '40%', borderTopWidth: 0}}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({sex: itemValue})
                                    }>
                                        <Picker.Item label="男" value="M" />
                                        <Picker.Item label="女" value="F" />
                                    </Picker>
                                </View>

                                <View style={{height: 40}}></View>

                                <View style={[styles.infoSection, {borderBottomWidth: 1}]}>
                                    <Text>ユーザー</Text>
                                    <Text>{this.state.userID}</Text>
                                </View>

                                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20}}>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{backgroundColor: '#bcbcbc', padding: 15}}>
                                        <Text style={{color: 'white'}}>戻る</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.goToHome()} style={{backgroundColor: '#09888e', padding: 15}}>
                                        <Text style={{color: 'white'}}>保存</Text>
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                }
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eee',
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoSection: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        backgroundColor: 'white', 
        width: '100%', 
        alignItems: 'center', 
        padding: 10, 
        borderColor: '#bcbcbc', 
        borderTopWidth: 1,
        height: 50
    },
    input: {
        borderColor: '#bcbcbc',
        borderBottomWidth: 1,
        width: "40%",
        height: 40
    },
    btnText: {
        backgroundColor: '#000',
        padding: 15,
        width: "100%",
        borderRadius: 30,
        color: '#fff',
        textAlign: 'center',
    },
    labelText: {
        paddingBottom: 10,
        width: "80%",
        textAlign: "left"
    },
    invalid: {
      borderWidth: 1,
      borderColor: 'red'
    }
});