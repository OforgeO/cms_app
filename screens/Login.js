import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, TouchableOpacity, Keyboard, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { loginUser, updateLoginTime} from '../constants/Api';
import { showToast } from '../components/Global';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userErr : false,
            pwdErr : false,
            token: '',
            login_id: '',
            password: '',
            loaded: false,
            lang: 'auto',
            token: '',
            type : null
        }
    }

    async componentDidMount(){
        let type = await SecureStore.getItemAsync("memberDetail")
        this.setState({type : type})
        let lang = await SecureStore.getItemAsync("language");
        if(lang == null)
            lang = 'auto'
        this.setState({lang: lang});
        this.setState({loaded: true})
    }
    
    signup(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const translator = TranslatorFactory.createTranslator();
        translator.translate('新規会員登録').then(translated => {
            Actions.push('signup', {title: translated});
        });
        
    }

    async loginUser(){
        let user_id = await SecureStore.getItemAsync('user_id');
        loginUser(this.state.login_id, this.state.password, this.state.type, user_id)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                showToast("入力情報が間違いました。再度確認してください。");
                return;
            }else{
                updateLoginTime(user_id);
                await SecureStore.setItemAsync("is_login", '1')
                Actions.reset("home");
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }
    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <View style={styles.container}>
                {
                    this.state.loaded == false ?
                    null:
                    <KeyboardAvoidingView bebehavior="height"  style={styles.container}>
                        <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
                                <View style={styles.logoContainer}>
                                    {
                                        this.state.type == 1 ?
                                        <View style={[styles.labelText]}>
                                            <PowerTranslator text={"ユーザーID"} />
                                        </View>
                                        :
                                        null
                                    }
                                    {
                                        this.state.type == 1 ?
                                        <TextInput 
                                            placeholderTextColor='rgba(0, 0, 0, 0.4 )'
                                            returnKeyType="next"
                                            autoCapitalize="none"
                                            keyboardType='email-address'
                                            autoCorrect={false}
                                            style={this.state.userErr? [styles.input, styles.invalid] : [styles.input]} 
                                            onChangeText={value=>this.setState({login_id: value})}
                                            onSubmitEditing={() => this.txtPwd.focus()}
                                        />
                                        :
                                        null
                                    }
                                    <View style={[styles.labelText]}>
                                        <PowerTranslator text={"パスワード"} />
                                    </View>
                                    <TextInput 
                                        placeholderTextColor='rgba(0, 0, 0, 0.4 )'
                                        secureTextEntry
                                        returnKeyType="go"
                                        autoCapitalize="none"
                                        style={this.state.pwdErr? [styles.input, styles.invalid] : [styles.input]} 
                                        ref={ref => {this.txtPwd = ref;}}
                                        onChangeText={value=>this.setState({password: value})}    
                                    />
                                    
                                    <View style={{width: "80%"}}>
                                        <View style={{borderRadius: 30, overflow: 'hidden'}}>
                                            <TouchableOpacity onPress={() => this.loginUser()} style={{justifyContent: 'center', alignItems: 'center'}}>
                                                <View style={[styles.btnText, {backgroundColor:'#343335'}]}>
                                                    <PowerTranslator style={{color: 'white', textAlign: 'center'}} text={"ログイン"} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{height: 20}}></View>
                                        {
                                            this.state.type == 1 ?
                                            <View style={{borderRadius: 30, overflow: 'hidden'}}>
                                                <TouchableOpacity onPress={() => this.signup()} style={{justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
                                                    <View style={[styles.btnText, {backgroundColor:'#e65c5c'}]}>
                                                        <PowerTranslator style={{color: 'white', textAlign: 'center'}} text={"新規会員登録"} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            null
                                        }
                                    </View>
                                </View>
                            
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                }
                
            </View>
        );
    }
}

Login.navigationOptions = {
    header: null
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eee',
    },
    logoContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        height: 40,
        backgroundColor: 'white',
        marginBottom: 20,
        paddingHorizontal: 10,
        borderColor: '#bcbcbc',
        borderWidth: 1,
        width: "80%"
    },
    btnText: {
        backgroundColor: '#000',
        padding: 15,
        width: "100%",
        borderRadius: 30,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    labelText: {
        paddingBottom: 10,
        width: "80%",
        textAlign: "left",
    },
    invalid: {
      borderWidth: 1,
      borderColor: 'red'
    }
});