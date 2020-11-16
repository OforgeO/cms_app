import React from 'react';
import { StyleSheet, Text, TouchableOpacity, FlatList, View, Platform, Image} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Ionicons } from '@expo/vector-icons';
import { getTopMenu } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Layout from '../constants/Layout';
import { ScrollView } from 'react-native-gesture-handler';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import * as SecureStore from 'expo-secure-store';
export default class Menu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            menuList1: [],
            menuList2: [],
            lang: 'auto'
        }
    }

    async componentDidMount(){
      let lang = await SecureStore.getItemAsync("language");
      if(lang == null)
        lang = 'auto';
      this.setState({lang: lang});
      let type = await SecureStore.getItemAsync('all_app');
        await getTopMenu(Platform.OS, type)
        .then(async (response) => {
            if(response.data == false || response.data.length == 0){
                return;
            }else{
              var temp = [];
              for(var i = 0;i<3;i++){
                temp.push(response.data[i])
              }
              this.setState({menuList1: temp})
              temp = [];
              for(var i = 3;i<response.data.length;i++){
                temp.push(response.data[i])
              }
              
              this.setState({menuList2: temp})
            }
        })
        .catch((error) => {
            showToast();
        });
    }

    goPage(menu_type, type, subtype, menuName, isMember){
      TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
      const translator = TranslatorFactory.createTranslator();
        translator.translate(menuName).then(async menuName => {
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

    renderMenu(){
      return this.state.menuList2.map((menu) => {
        if(this.props.type == 6){
          return <TouchableOpacity onPress={() => this.goPage(menu.MENU_TYPE,menu.TYPE,menu.SUBTYPE,menu.MENU_NAME, menu.IS_MEMBER)}  style={{width: (Layout.window.width - 3) * 0.33, height: Layout.window.width * 0.25, margin: 1}}>
            <View>
              {
                menu.IMAGE_FOR_PANEL != '' && menu.IMAGE_FOR_PANEL != null ?
                <Image source={{uri: Layout.serverUrl + menu.IMAGE_FOR_PANEL}} style={{width: '100%', height: '100%'}} />
                :
                <Image source={require('../assets/images/noimage1.jpg')} style={{width: '100%', height: '100%'}} />
              }
            </View>
          </TouchableOpacity>
        }else{
          return <TouchableOpacity onPress={() => this.goPage(menu.MENU_TYPE,menu.TYPE,menu.SUBTYPE,menu.MENU_NAME, menu.IS_MEMBER)}  style={{width: Layout.window.width, height: Layout.window.width * 0.75, margin: 1}}>
            <View>
              {
                menu.IMAGE_FOR_PANEL != '' && menu.IMAGE_FOR_PANEL != null ?
                <Image source={{uri: Layout.serverUrl + menu.IMAGE_FOR_PANEL}} style={{width: '100%', height: '100%'}} />
                :
                <Image source={require('../assets/images/noimage1.jpg')} style={{width: '100%', height: '100%'}} />
              }
            </View>
          </TouchableOpacity>
        }
      })
    }

    renderHoriMenu(){
      TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
      return this.state.menuList1.map((menu) => {
        return <TouchableOpacity onPress={() => this.goPage(menu.MENU_TYPE,menu.TYPE,menu.SUBTYPE,menu.MENU_NAME, menu.IS_MEMBER)}>
        <View style={[styles.couponList]}>
            <PowerTranslator style={{paddingLeft: 10}} text={menu.MENU_NAME}/>
            <Ionicons size={20} style={{paddingHorizontal: 10}} name={"ios-arrow-forward"}/>
        </View>
      </TouchableOpacity>
      })
    }

    render(){
        return (
            <View style={styles.container}>
              <ScrollView>
                {
                  this.renderHoriMenu()
                }
                
                {
                  this.props.type == 3 || this.props.type == 6 || this.props.type == 11 ?
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {this.renderMenu()}
                  </View>
                  :
                  null
                }
              </ScrollView>
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
    couponList: {
        flexDirection: 'row', justifyContent: 'space-between', 
        paddingVertical: 10, 
        backgroundColor: '#ececec', width: '100%', 
        alignItems: 'center', marginBottom: 2
    },
    menuImage: {

    }
});