import React from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, TouchableOpacity, Keyboard, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { getBookInput, getBookDescription } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from './Global';
import { Ionicons } from '@expo/vector-icons';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
export default class AddReservation extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            name: '',
            phone: '',
            email: '',
            numberOfPerson: '1',
            description: '',
            entrySetting: [],
            nameErr: false,
            phoneErr: false,
            emailErr: false,
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
        let lang = await SecureStore.getItemAsync("language")
        if(lang == null)
            lang = 'auto'
        this.setState({lang: lang});

        this.setState({loaded: false});
        await getBookInput()
        .then(async (response) => {
            if(response.data == false){
                return;
            }else{
                this.setState({entrySetting : response.data[0]})
            }
        })
        .catch((error) => {
            showToast();
        });
        await getBookDescription()
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false){
                return;
            }else{
                this.setState({description : response.data[0]['DESCRIPTION']})
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
        if(this.props.editBook == 1){
            this.setState({name: this.props.bookName})
            this.setState({phone: this.props.phone})
            this.setState({email: this.props.email})
            this.setState({numberOfPerson: this.props.numberofperson.toString()})
        }
    }

    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    gotoTimeBook(){
        if(this.state.name == ''){
            this.setState({nameErr : true})
            this.state.nameErr = true
        }else{
            this.setState({nameErr : false})
            this.state.nameErr = false
        }
        if(this.state.phone == ''){
            this.setState({phoneErr : true})
            this.state.phoneErr = true
        }else{
            this.setState({phoneErr : false})
            this.state.phoneErr = false
        }
        if(this.state.email != '' && !this.validateEmail(this.state.email)){
            this.setState({emailErr : true})
            this.state.emailErr = true
        }else{
            this.setState({emailErr : false})
            this.state.emailErr = false
        }
        
        if(this.state.nameErr == false && this.state.phoneErr == false && this.state.emailErr == false){
            TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
            const translator = TranslatorFactory.createTranslator();
            if(this.props.type == 2){
                translator.translate('確認画面').then(translated => {
                    Actions.push("confirmbook", {email: this.state.email, phone: this.state.phone, bookName: this.state.name, numberOfPerson: this.state.numberOfPerson, type: 2, personLabel: this.state.entrySetting['PERSON_NAME'], title: translated})
                });
            }else{
                if(this.props.editBook == 1)
                    translator.translate('日付指定').then(translated => {
                        Actions.push("timebook", {email: this.state.email, phone: this.state.phone, bookName: this.state.name, numberOfPerson: this.state.numberOfPerson, personLabel: this.state.entrySetting['PERSON_NAME'],editBook: 1, assignId: this.props.assignId, bookDate: this.props.bookDate, bookEndDate: this.props.bookEndDate, bookTime: this.props.bookTime, bookID: this.props.bookID, title: translated})
                    });
                else
                    translator.translate('日付指定').then(translated => {
                        Actions.push("timebook", {email: this.state.email, phone: this.state.phone, bookName: this.state.name, numberOfPerson: this.state.numberOfPerson, personLabel: this.state.entrySetting['PERSON_NAME'], title: translated})
                    });
            }
            
        }
            
    }
    
    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView bebehavior="padding"  style={styles.container}>
                    <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
                        <View style={styles.logoContainer}>
                            {
                                this.state.entrySetting['NAME_YN'] == 'Y' ?
                                <View style={styles.infoSection}>
                                    <PowerTranslator text={'名前'}/>
                                    <TextInput  
                                        returnKeyType="next"
                                        style={this.state.nameErr == false ? styles.input : [styles.input, {borderColor: 'red'}]}
                                        defaultValue={this.state.name}
                                        value={this.state.name}
                                        onChangeText={value=>this.setState({name : value})}
                                    />
                                </View>
                                :
                                null
                            }
                            {
                                this.state.entrySetting['PHONE_YN'] == 'Y' ?
                                <View style={styles.infoSection}>
                                    <PowerTranslator text={'電話番号'}/>
                                    <TextInput  
                                        returnKeyType="next"
                                        style={this.state.phoneErr == false ? styles.input : [styles.input, {borderColor: 'red'}]}
                                        keyboardType={'phone-pad'}
                                        defaultValue={this.state.phone}
                                        value={this.state.phone}
                                        onChangeText={value=>this.setState({phone : value})}
                                    />
                                </View>
                                :
                                null
                            }
                            {
                                this.state.entrySetting['EMAIL_YN'] == 'Y' ?
                                <View style={styles.infoSection}>
                                    <PowerTranslator text={'メールアドレス'}/>
                                    <TextInput  
                                        returnKeyType="next"
                                        style={this.state.emailErr == false ? styles.input : [styles.input, {borderColor: 'red'}]}
                                        keyboardType={'email-address'}
                                        defaultValue={this.state.email}
                                        value={this.state.email}
                                        onChangeText={value=>this.setState({email : value})}
                                    />
                                </View>
                                :
                                null
                            }
                            {
                                this.state.entrySetting['PERSON_YN'] == 'Y' ?
                                <View style={styles.infoSection}>
                                    <PowerTranslator text={this.state.entrySetting['PERSON_NAME']}/>
                                    <TextInput  
                                        returnKeyType="next"
                                        style={styles.input}
                                        keyboardType={'numeric'}
                                        defaultValue={this.state.numberOfPerson}
                                        value={this.state.numberOfPerson}
                                        onChangeText={value=>this.setState({numberOfPerson : value})}
                                    />
                                </View>
                                :
                                null
                            }

                            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20}}>
                                
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{backgroundColor: '#bcbcbc', padding: 15}}>
                                    <PowerTranslator style={{color: 'white'}} text={'戻る'} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.gotoTimeBook()} style={{backgroundColor: '#09888e', padding: 15}}>
                                    <PowerTranslator style={{color: 'white'}} text={'次へ'} />
                                </TouchableOpacity>
                            </View>

                            {
                                this.state.entrySetting['DESCRIPTION_YN'] == 'Y' && this.state.description != '' ?
                                <View style={[styles.infoSection, {height: 100, borderTopWidth: 1}]}>
                                    <PowerTranslator text={'説明文'} />
                                    <PowerTranslator text={this.state.description}/>
                                </View>
                                :
                                null
                            }
                            
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
    },
    infoSection: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        backgroundColor: 'white', 
        width: '100%', 
        alignItems: 'center', 
        padding: 10, 
        borderColor: '#bcbcbc', 
        borderBottomWidth: 1,
        height: 50
    },
    input: {
        borderColor: '#bcbcbc',
        borderBottomWidth: 1,
        width: "60%",
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