import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Text, TouchableWithoutFeedback, TextInput, TouchableOpacity, Keyboard, Platform, ScrollView} from 'react-native';
import moment from 'moment';

import { Actions } from 'react-native-router-flux';
import { updateUser } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../components/Global';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
const keyboardVerticalOffset = Platform.OS === 'ios' ? 85 : 0

let selDate = new Date();
export default class Signup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            date : `${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`,
            mode : 'date',
            show : false,
            deviceId : '',
            deviceOS : Platform.OS,
            userID : '',
            loginID : '',
            password: '',
            cpassword: '',
            nickname : '',
            sex : 'M',
            loaded: true,
            pageLoad: false,
            token: '',
            passwordErr: false,
            existUser: false,
            memeber: true,
            lang: 'auto',
            male: '男',
            female: '女',
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.title,
        headerTitleStyle: {
            textAlign: 'center',
            flexGrow:1,
            alignSelf:'center',
        },
        headerStyle: {
            backgroundColor: 'white',
        },
        headerTintColor: 'black',
        headerRight: <Text></Text>
    });

    async componentDidMount(){
        let lang = await SecureStore.getItemAsync("language");
        if(lang == null)
            lang = 'auto'
        this.setState({lang: lang});
        let userID = await SecureStore.getItemAsync("user_id");
        this.setState({userID : userID})
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, lang);
        const translator = TranslatorFactory.createTranslator();
        translator.translate(this.state.male).then(translated => {
            this.setState({male : translated})
        });
        translator.translate(this.state.female).then(translated => {
            this.setState({female : translated})
        });
               
    }

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
        this.setState({passwordErr: false})
        this.setState({existUser: false})
        if(this.state.password != this.state.cpassword || this.state.password == ''){
            this.setState({passwordErr: true})
        }else{
            this.setState({loaded: false});
            updateUser(this.state.userID, this.state.loginID, this.state.password)
            .then(async (response) => {
                this.setState({loaded: true});
                if(response.data == false){
                    showToast('同一なユーザーIDが既に存在してます。');
                    this.setState({existUser: true})
                    return;
                }else{
                    Actions.reset("login");
                }
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
        }
    }

    toggleSwitch(v){
        this.setState({memeber: v})
    }
    
    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <View style={styles.container}>
                {
                    this.state.pageLoad == true ?
                    null:
                    <KeyboardAvoidingView bebehavior="padding"  style={styles.container} keyboardVerticalOffset={keyboardVerticalOffset}>
                        <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
                            <ScrollView style={{paddingTop: 10}}>
                                <View style={styles.logoContainer}>
                                    <View style={[styles.labelText]}>
                                        <PowerTranslator style={{textAlign: 'center', fontSize: 20}} text={"プロフィール設定"} />
                                    </View>

                                    <View style={styles.infoSection}>
                                        <PowerTranslator text={"ユーザーID"} />
                                        <TextInput  
                                            returnKeyType="next"
                                            style={this.state.existUser == true ? [styles.input, styles.invalid]: styles.input}
                                            value={this.state.loginID}
                                            onChangeText={value=>this.setState({loginID : value})}
                                        />
                                    </View>

                                    <View style={styles.infoSection}>
                                        <PowerTranslator text={"パスワード"} />
                                        <TextInput  
                                            returnKeyType="next"
                                            secureTextEntry={true}
                                            style={this.state.passwordErr ? [styles.input, styles.invalid] : [styles.input]}
                                            value={this.state.password}
                                            onChangeText={value=>this.setState({password : value})}
                                        />
                                    </View>

                                    <View style={styles.infoSection}>
                                        <PowerTranslator text={"パスワードの確認"} />
                                        <TextInput  
                                            returnKeyType="next"
                                            secureTextEntry={true}
                                            style={this.state.passwordErr ? [styles.input, styles.invalid] : [styles.input]}
                                            value={this.state.cpassword}
                                            onChangeText={value=>this.setState({cpassword : value})}
                                        />
                                    </View>

                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20}}>
                                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{backgroundColor: '#bcbcbc', padding: 15}}>
                                            <PowerTranslator style={{color: 'white'}} text={"戻る"} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.goToHome()} style={{backgroundColor: '#09888e', padding: 15}}>
                                            <PowerTranslator style={{color: 'white'}} text={"保存"} />
                                        </TouchableOpacity>
                                    </View>
                                    
                                </View>
                            </ScrollView>
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
        borderBottomColor: '#bcbcbc',
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
      borderBottomWidth: 1,
      borderBottomColor: 'red'
    }
});