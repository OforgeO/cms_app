import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSurveyDetail } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../components/Global';
import Layout from '../constants/Layout';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import * as SecureStore from 'expo-secure-store';
export default class SurveyDetail extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            surveyDetail: null,
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

    async componentDidMount(){ 
        let lang = await SecureStore.getItemAsync("language");
        if(lang == null)
            lang = 'auto';
        this.setState({lang: lang});
        this.setState({loaded: false});
        await getSurveyDetail(this.props.id)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                this.setState({ surveyDetail : response.data[0] })
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    goSurveyQuestion(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const translator = TranslatorFactory.createTranslator();
        translator.translate(this.props.title).then(translated => {
            Actions.push('surveyquestion', { id: this.props.id, title: translated, surveyno: 1});
        });
    }
    
    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <ScrollView style={{backgroundColor: '#eee'}}>
                <View style={styles.container}>
                    {
                        this.state.surveyDetail != null ?
                        <View style={{width: '100%'}}>
                            <View style={{width: '100%', alignItems: 'center'}}>
                                <PowerTranslator  style={{fontWeight: 'bold', fontSize: 20, marginTop: 20, alignItems: 'center'}} text={this.state.surveyDetail['TITLE']}/>
                            </View>
                            <View style={{width: '100%', marginTop: 20}}>
                                <PowerTranslator  style={{alignItems: 'flex-start'}} text={this.state.surveyDetail['DESCRIPTION']}/>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20}}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{backgroundColor: '#bcbcbc', padding: 15}}>
                                    <PowerTranslator style={{color: 'white'}} text={'戻る'} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.goSurveyQuestion()} style={{backgroundColor: '#09888e', padding: 15}}>
                                    <PowerTranslator style={{color: 'white'}} text={'スタート'} />
                                </TouchableOpacity>
                            </View>
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
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  
});
