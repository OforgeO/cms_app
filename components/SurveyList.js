import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, FlatList} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSurveyList } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
export default class SurveyList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            surveyList: null,
            type: 0
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

    UNSAFE_componentWillReceiveProps(){
        this.refresh()
    }

    async refresh(){
        this.setState({loaded: false});
        
        getSurveyList(moment().utcOffset(-540).format('YYYY-MM-DD'))
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                this.setState({surveyList: response.data})
                return;
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    async componentDidMount(){
        this.refresh()
    }

    render(){
        
        return (
            <View style={styles.container}>
                {
                    this.state.surveyList != null?
                    <FlatList
                        data={this.state.surveyList}
                        renderItem={(survey) => <SurveyItem surveyInfo={survey.item}/>}
                        keyExtractor={survey => survey.ID}
                    />
                    :
                    null
                }
                
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
}

class SurveyItem extends React.Component {
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

    detail(id, title){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const translator = TranslatorFactory.createTranslator();
        translator.translate(title).then(translated => {
            Actions.push("surveydetail", {id : id, title: translated})
        });
        
    }

    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <TouchableOpacity onPress={() => this.detail(this.props.surveyInfo.ID,this.props.surveyInfo.TITLE)}>
                <View style={[styles.couponList]}>
                    <PowerTranslator style={{paddingLeft: 10}} text={this.props.surveyInfo.TITLE} />
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