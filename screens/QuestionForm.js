import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, TextInput, KeyboardAvoidingView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sendInquiry, getInquirySetting } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../components/Global';
import { ScrollView } from 'react-native-gesture-handler';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
export default class QuestionForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            setting: [],
            settingValue: [],
            lang: 'auto'
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: `${navigation.state.params.menuName}`,
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
        getInquirySetting()
        .then((response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                this.setState({setting: response.data})
                for(var i = 0;i<response.data.length;i++){
                    this.state.settingValue.push([response.data[i]['ID'],''])
                }
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    async sendInquiry(){
        let user_id = await SecureStore.getItemAsync("user_id")
        sendInquiry(this.state.settingValue, user_id)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                this.props.navigation.goBack();
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    renderField(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return this.state.setting.map((item) => {
            return <View>
                <PowerTranslator text={item['NAME']}/>
                <TextInput 
                    returnKeyType="next"
                    style={styles.item}
                    onChangeText={value=>{
                        for(var i = 0;i<this.state.settingValue.length;i++){
                            if(this.state.settingValue[i][0] == item['ID']){
                                this.state.settingValue[i][1] = value;
                            }
                        }
                    }}
                />
            </View>
        })
    }

    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <View style={styles.container}>
                {
                    this.state.setting != null ?
                    <KeyboardAvoidingView  behavior="height" >
                        <ScrollView>
                            <View style={{padding: 10}}>
                                {
                                    this.renderField()
                                }
                                <TouchableOpacity onPress={() => this.sendInquiry()} style={{width: '100%', justifyContent: 'center', backgroundColor: '#457730', alignItems: 'center', paddingVertical: 10, borderRadius: 20}}>
                                    <PowerTranslator style={{color: 'white'}} text={'送信'} />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    :
                    null
                }
                
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    item: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#a9a9a9',
        marginTop: 5,
        padding: 10,
        marginBottom: 10
    }
});