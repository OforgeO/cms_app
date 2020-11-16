import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, TextInput, Platform, Picker } from 'react-native';
import { HFImage, getTopMenu, getHeaderIcon, getLanguages } from '../constants/Api';
import { showToast } from './Global';
import Layout from '../constants/Layout';
import { Icon } from 'native-base';
import { Actions } from 'react-native-router-flux'; 
import Constants from "expo-constants";
import { ScrollView } from 'react-native-gesture-handler';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import * as SecureStore from 'expo-secure-store';
export default class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            header_exist: 0,
            image_link: '',
            opened: 0,
            menuList: [],
            headerIcon: [],
            search: '',
            languages: null,
            is_lang: 0,
            select_lang: 'auto',
            loaded: true,
        }
    }
    async componentDidMount(){
        let lang = await SecureStore.getItemAsync("language");
        if(lang != '' && lang != undefined)
            this.setState({select_lang : lang})
        this.setState({company: ''})
        if(this.props.type != 3 && this.props.type != 5){
            await HFImage()
            .then((response) => {
                if(response.data == false){
                    showToast();
                    return;
                }else{
                    if(response['data'][0].HEADER_IMAGE_DEL_YN == 'N' && response['data'][0].HEADER_IMAGE != ''){
                        this.setState({header_exist : 1})
                        this.setState({image_link : Layout.serverUrl + response['data'][0].HEADER_IMAGE})
                    }
                    else
                        this.setState({company: ''})
                }
                
            })
        }else{
            await getHeaderIcon()
            .then((response) => {
                if(response.data == false || response.data.length == 0){
                    return;
                }else{
                    this.setState({headerIcon: response.data})
                }
                
            })
        }
        if(this.props.type == 11){
            await getLanguages()
            .then((response) => {
                if(response.data == false){
                    showToast();
                    return;
                }else{
                    var temp = [];
                    temp.push(["言語選択", 'auto']);
                    if(response.data[0]['ENGLISH'] == 'Y')
                        temp.push(["ENGLISH", 'en']);
                    if(response.data[0]['JAPANESE'] == 'Y')
                        temp.push(["日本語", 'ja']);
                    if(response.data[0]['CHINESE1'] == 'Y')
                        temp.push(["中国語(簡体)", 'zh-cn']);
                    if(response.data[0]['CHINESE2'] == 'Y')
                        temp.push(["中国語(繁体)", 'zh-tw']);
                    if(response.data[0]['THAI'] == 'Y')
                        temp.push(["THAI", 'th']);
                    this.setState({languages: temp});
                    this.setState({is_lang : 1})
                }
            })
        }
        
        if(this.props.type != 1){
            let type = await SecureStore.getItemAsync('all_app');
            await getTopMenu(Platform.OS, type)
            .then((response) => {
                if(response.data == false){
                    return;
                }else{
                    this.setState({menuList : response.data})
                    this.renderTopMenu();
                }
            })
            .catch((error) => {
            });
        }

    }

    openDrawer(){
        this.setState({opened : !this.state.opened})
    }

    openMenu(menu_type, type, subtype, menuName, isMember){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.select_lang);
        const translator = TranslatorFactory.createTranslator();
        translator.translate(menuName).then(async menuName => {
            this.setState({opened: false})
            let is_login = await SecureStore.getItemAsync("is_login")
            if(menu_type == 2 && type == 0 || type == 3){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('couponlist', {menuName: menuName});
            }else if(type == 6 && subtype == 11){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('webviewlist', {menuName: menuName});
            }
            else if(type == 6 && subtype == 10){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('social', {menuName: menuName});
            }
            else if(menu_type == 3 && type == 0){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('news', {menuName: menuName});
            }
            else if(type == 8 || menu_type == 9 && type == 0){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('questionform', {menuName: menuName});
            }
            else if(menu_type == 4 && type == 0 || type == 2){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('video', {menuName: menuName});
            }
            else if(menu_type == 5 && type == 0 || type == 5){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('stamplist', {menuName: menuName});
            }
            else if(menu_type == 6 && type == 0){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('catalogue', {type : 0, menuName: menuName}); // all
            }
            else if(menu_type == 7 && type == 0 || type == 9){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('reservation', {menuName: menuName});
            }
            else if(menu_type == 8 || type == 11){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('webviewlink', {type: subtype, menuName: menuName});
            }
            else if(type == 1 && subtype == 1){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('catalogue', {type : 1, menuName: menuName}); // pdf
            }
            else if(type == 1 && subtype == 2){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('catalogue', {type : 2, menuName: menuName}); //photo gallery
            }
            else if(menu_type == 1 && type == 0){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('bottom', {menuName: menuName});
            }
            else if(type == 7){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push("freecontent", {id : subtype, title: menuName})
                //Actions.push('freecontentlist', {menuName: menuName});
            }
            else if(type == 6 && subtype > 0){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('maincontent', { type: subtype, menuName: menuName});
            }
            else if(type == 4 && subtype > 0){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('postcontentlist', { type: subtype, menuName: menuName});
            }
            else if(type == 10){
                if(isMember == 'Y' && is_login != '1')
                    Actions.push("login")
                else
                    Actions.push('surveylist', {menuName: menuName});
            }
        });
    }

    renderTopMenu(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.select_lang);
        return this.state.menuList.map((menu) => {
            return <TouchableOpacity key={menu.ID} onPress={() => this.openMenu(menu.MENU_TYPE, menu.TYPE, menu.SUBTYPE, menu.MENU_NAME, menu.IS_MEMBER)} style={{padding: 10, borderBottomWidth:1, borderBottomColor: 'gray', zIndex: 9999}}>
                <PowerTranslator text={menu.MENU_NAME} />
            </TouchableOpacity>
        })
    }

    renderHeaderIcon(){
        return this.state.headerIcon.map((header) => {
            return <TouchableOpacity onPress={() => this.openMenu(header.MENU_TYPE, header.TYPE, header.SUBTYPE, header.MENU_NAME, menu.IS_MEMBER)} style={{marginHorizontal: 5}}>
                <Image style={{width: 30, height: 30, borderRadius: 15}} source={{uri: Layout.serverUrl+header.HEADER_IMAGE_ICON}} />
            </TouchableOpacity>
        })
    }

    renderLang(){
        return <Picker selectedValue={this.state.select_lang} itemStyle={{height: 50}} style={{width: 170}}
            onValueChange={(item, index) => {this.changeLang(item)}}>
            {
                this.state.languages.map((lang)=>{
                    return <Picker.Item label={lang[0]} value={lang[1]}/>
                })
            }
        </Picker>
    }

    async changeLang(lang){
        this.setState({select_lang : lang});
        await SecureStore.setItemAsync("language", lang);
        Actions.reset("home");
    }

    render(){
        
        return (
            
            <View style={styles.header}>
                {
                    this.props.type != 1?
                    
                    this.state.opened ?
                    <Icon name="close" style={{width: '15%', paddingLeft: 15}} onPress={() => this.openDrawer()} />
                    :
                    <Icon name="menu" style={{width: '15%', paddingLeft: 15}} onPress={() => this.openDrawer()} />
                    
                    :
                    null
                }
                
                
                {
                    this.state.header_exist == 1 && this.props.type != 3 && this.props.type != 5 && this.props.type != 9 && this.props.type != 11 ?
                    <Image source={{uri: this.state.image_link }} style={{height:60, width: '100%'}} resizeMode="stretch"/>
                    :
                    <View style={{width: '100%',height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1, paddingRight: 10}}>
                        {this.renderHeaderIcon()}
                    </View>
                }
                {
                    this.props.type == 11 && this.state.is_lang == 1 && this.state.languages != null ?
                    <View style={{flexDirection: 'row'}}>
                        {this.renderLang()}
                        
                    </View>
                    :
                    null
                }
                {
                    this.props.type == 9 ?
                    <View>
                        <TextInput  
                            returnKeyType="next"
                            style={{borderWidth: 1, borderColor: 'gray', width: Layout.window.width*0.7, marginRight: 10, paddingLeft: 5}}
                            value={this.state.search}
                            onChangeText={value=>this.setState({search : value})}
                        />
                        <Icon name="search" style={{position: 'absolute', right: 15, color: 'gray '}} onPress={() => this.openDrawer()} />
                    </View>
                    :
                    null
                }
                {    
                    this.state.opened ?
                    <View style={{position: 'absolute', top: 60, width: '100%', backgroundColor: '#ececec', height: 200, zIndex: 99999}}>
                        <ScrollView>
                        {
                            this.renderTopMenu()
                        }
                        </ScrollView>
                    </View>
                    :
                    null
                }
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    header: {
        marginTop: Constants.statusBarHeight,
        alignItems: 'center',
        flexDirection: 'row',
        height: 60,
        
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'lightgray',
    },  
});
