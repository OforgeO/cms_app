import React from 'react';
import { View, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { getMemberInfo, deviceExist, registerUser } from '../constants/Api';
import { showToast } from '../components/Global';
import * as SecureStore from 'expo-secure-store';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import Spinner_bar from 'react-native-loading-spinner-overlay';
export default class Initial extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            token: '',
            login_id: '',
            password: '',
            type: 0,
            token: ''
        }
    }

    async componentDidMount(){
            
        getMemberInfo()
        .then(async (response) => {
            if(response.data == false || response.data.length == 0){
                showToast();
            }else{
                if(response.data[0]['MEMBER_FUNCTION'] == "OFF" || response.data[0]['MEMBER_FUNCTION'] == null){
                    await SecureStore.setItemAsync("memberFunc", 'off')
                } else if(response.data[0]['MEMBER_FUNCTION'] == 'ON'){
                    await SecureStore.setItemAsync("memberFunc", 'on')

                    if(response.data[0]['MEMBER_DETAIL'] == 1)
                        await SecureStore.setItemAsync("memberDetail", '1')
                    else
                        await SecureStore.setItemAsync("memberDetail", '2')
                    
                    if(response.data[0]['ALL_APP'] == 1)
                        await SecureStore.setItemAsync("all_app", '1')
                    else
                        await SecureStore.setItemAsync("all_app", '0')
                }
                this.registerForPushNotificationsAsync()
            }
        })
        .catch((error) => {
            showToast();
        });
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
            deviceExist(token)
            .then(async (response) => { 
                if(response.data == false || response.data.length == 0){
                    let user_id = Math.floor(Math.random() * 100000000) + 1
                    await SecureStore.setItemAsync("user_id", user_id.toString())
                    registerUser(user_id, Platform.OS, token).then(async (response) => {
                        let memberFunc = await SecureStore.getItemAsync("memberFunc")
                        let is_login = await SecureStore.getItemAsync("is_login")
                        let all_app = await SecureStore.getItemAsync("all_app")
                        if(memberFunc == 'off' || is_login == '1' || all_app == '0')
                            Actions.reset("home");
                        else
                            Actions.reset("login");
                    })
                    
                }else{
                    await SecureStore.setItemAsync('user_id', response.data[0]['USER_ID'])
                    let memberFunc = await SecureStore.getItemAsync("memberFunc")
                    let is_login = await SecureStore.getItemAsync("is_login")
                    let all_app = await SecureStore.getItemAsync("all_app")
                    if(memberFunc == 'off' || is_login == '1' || all_app == '0')
                        Actions.reset("home");
                    else
                        Actions.reset("login");
                }
            })
            .catch((error) => {
                showToast();
            });
            
          
        } catch (error) {}
    };
    
    
    render(){
        return (
            <View>
                <Spinner_bar color={'#27cccd'} visible={true} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
}

Initial.navigationOptions = {
    header: null
}