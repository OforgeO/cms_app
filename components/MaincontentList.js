import React from 'react';
import { StyleSheet, Text, TouchableOpacity, FlatList, View, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Ionicons } from '@expo/vector-icons';
import { getMaincontentList } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
import { showToast } from '../components/Global';
export default class MaincontentList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            maincontentList: [],
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
        let type = this.props.type;
        if(type == undefined){
            type = this.props.route.name.split("-");
            type = type[1];
        }
        this.setState({loaded: false});
        getMaincontentList(type)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                //this.setState({maincontentList: response.data})
                let lastMainContent = response.data[0];
                this.detail(lastMainContent['ID'], lastMainContent['TITLE'])
                return;
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    detail(id, title){
        console.log(id)
        console.log(title)
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const translator = TranslatorFactory.createTranslator();
        translator.translate(title).then(translated => {
            Actions.push("maincontent", {id : id, title: translated})
        });
    }

    render(){
        
        return (
            <View style={styles.container}>
                <View>
                    <FlatList
                        data={this.state.maincontentList}
                        renderItem={(free) => <FreeItem freeInfo={free.item}/>}
                        keyExtractor={free => free.ID}
                    />
                </View>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
}

class FreeItem extends React.Component {
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
            Actions.push("maincontent", {id : id, title: translated})
        });
    }

    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <TouchableOpacity onPress={() => this.detail(this.props.freeInfo.ID,this.props.freeInfo.TITLE)}>
                <View style={[styles.couponList]}>
                    <PowerTranslator style={{paddingLeft: 10}} text={this.props.freeInfo.TITLE} />
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