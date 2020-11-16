import React from 'react';
import { StyleSheet, Text, TouchableOpacity, FlatList, View, Image, Dimensions, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Ionicons } from '@expo/vector-icons';
import { getWebviewList } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../components/Global';
import * as SecureStore from 'expo-secure-store';
import Layout from '../constants/Layout';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
export default class WebviewList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            no_webview: -1,
            webview_link: [],
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
        this.setState({lang : lang})
        this.setState({loaded: false});
        getWebviewList(this.state.deviceId)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                this.setState({no_webview: 0})
                return;
            }else{
                this.setState({no_webview: 1})
                this.setState({webview_link: response.data})
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
                    this.state.no_webview == 0 ?
                    <View style={{width: '100%', paddingTop: 10, alignItems: 'center'}}>
                        <PowerTranslator text={'ウェブビューのリンクがない'}/>
                    </View>
                    :
                    <FlatList
                        data={this.state.webview_link}
                        renderItem={webview => <Item webview={webview} />}
                        keyExtractor={webview => webview.ID}
                    />
                }
                
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
}

class Item extends React.Component {
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
        this.setState({lang : lang})
    }

    goto(webview_link, title){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const translator = TranslatorFactory.createTranslator();
        translator.translate(title).then(translated => {
            Actions.push("webviewlink", { menuName: translated, link : webview_link})
        });
    }

    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <TouchableOpacity onPress={() => this.goto(this.props.webview.item.LINK, this.props.webview.item.TITLE)}>
                <View style={styles.item}>
                    <PowerTranslator style={styles.title} text={this.props.webview.item.TITLE}/>
                    <Ionicons size={18} style={{marginRight: 10}} name={'ios-arrow-forward'} />
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
    item: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});