import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Platform, FlatList, Linking} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCatalogue } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../components/Global';
import Layout from '../constants/Layout';
import { Actions } from 'react-native-router-flux';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import * as SecureStore from 'expo-secure-store';

export default class Catalogue extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            loaded: true,
            catalogs: []
        };
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
        await getCatalogue(type)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                var catalogueList = response.data;
                var temp = {
                    TYPE: -1
                }
                if(catalogueList.length % 3 == 1){
                    catalogueList.push(temp)
                    catalogueList.push(temp)
                }
                if(catalogueList.length % 3 == 2){
                    catalogueList.push(temp)
                }
                this.setState({catalogs: catalogueList})
            }
            
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }
    
    render(){
        return (
            <View>
                <FlatList
                    data={this.state.catalogs}
                    renderItem={(catalog) => <Catalog catalogInfo={catalog.item} index={catalog.index}/>}
                    keyExtractor={catalog => catalog.ID}
                    horizontal = {false}
                    numColumns = { 3 }
                />
                
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
            
        );
    }
    
}

class Catalog extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            lang: 'auto'
        };
    }

    async componentDidMount(){
        let lang = await SecureStore.getItemAsync("language");
        if(lang == null)
            lang = 'auto';
        this.setState({lang: lang});
    }

    goto(title, type, link, catalogID){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const translator = TranslatorFactory.createTranslator();
        if(type == 1){
            translator.translate(title).then(translated => {
                //Actions.push('pdfviewer',{ title : translated, link : Layout.serverUrl + link});
                Linking.openURL(Layout.serverUrl + link)
            });
            
        }
        if(type == 2){
            translator.translate(title).then(translated => {
                Actions.push('gallery',{ title : translated, ID: catalogID});
            });
        }
    }

    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <View style={{  flex: 1, marginBottom: 10 }}>
                <TouchableOpacity onPress={() => this.goto(this.props.catalogInfo.TITLE,this.props.catalogInfo.TYPE,this.props.catalogInfo.PDF, this.props.catalogInfo.ID)}>
                    <Image resizeMode="contain" style={{width: (Layout.window.width - 20) * 0.3, height: 150}} source={{uri: Layout.serverUrl + this.props.catalogInfo.THUMBNAIL}}/>
                    {
                        this.props.catalogInfo.TITLE != '' && this.props.catalogInfo.TITLE != undefined ?
                        <PowerTranslator style={{textAlign: 'center'}} text={this.props.catalogInfo.TITLE} />
                        :
                        null
                    }
                    
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 10,
    alignItems: 'center',
  },
});
