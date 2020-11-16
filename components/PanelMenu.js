import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Platform, FlatList} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { getTopMenu } from '../constants/Api';
import Layout from '../constants/Layout';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { createStackNavigator } from '@react-navigation/stack';
import Banner from './Banner';
const Stack = createStackNavigator();
import * as SecureStore from 'expo-secure-store';
export default class PanelMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            menuList: [],
            loaded: true,
            layout_type: 0
        }
    }
    async componentDidMount(){
        this.setState({loaded: false});
        this.setState({layout_type : this.props.type})
        let type = await SecureStore.getItemAsync('all_app');
        await getTopMenu(Platform.OS, type)
        .then((response) => {
            this.setState({loaded: true});
            if(response.data == false){
                //showToast();
                return;
            }else{
                var menuList = response.data;
                var temp = {
                    TYPE: -1
                }
                if(menuList.length % 2 == 1){
                    menuList.push(temp)
                }
                /*if(menuList.length % 3 == 2)
                    menuList.push(temp)*/
                this.setState({menuList : response.data})
            }
            
        })
        .catch((error) => {
            this.setState({loaded: true});
            //showToast();
        });
    }
    

    render(){
        return (
            <View style={{backgroundColor: 'white', flex: 1}}>
                <Banner />
                {
                    this.state.menuList.length > 0 ?
                    <FlatList
                        data={this.state.menuList}
                        renderItem={(menu) => <Menu menuInfo={menu.item} index={menu.index}/>}
                        keyExtractor={menu => menu.ID}
                        numColumns = { 2 }
                    />
                    :
                    null
                }
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
}

class Menu extends React.Component {
    constructor(props){
        super(props);
    }

    async goPage(menu_type, type, subtype, menuName, isMember){
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
            //Actions.push('freecontentlist', {menuName: menuName, type: subtype});
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
    }

    render(){
        
        return (
            <View style={this.props.index % 2 == 1 ? styles.menuSecR : styles.menuSec
                }>
                <TouchableOpacity onPress={() => this.goPage(this.props.menuInfo.MENU_TYPE, this.props.menuInfo.TYPE, this.props.menuInfo.SUBTYPE, this.props.menuInfo.MENU_NAME, this.props.menuInfo.IS_MEMBER)}>
                    {
                        this.props.menuInfo.IMAGE_FOR_PANEL != '' && this.props.menuInfo.IMAGE_FOR_PANEL != null ?
                        <Image resizeMode={"contain"} style={styles.menuSize} source={{uri: Layout.serverUrl+this.props.menuInfo.IMAGE_FOR_PANEL}}/>
                        :
                        <View style={{height: 100, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold'}}>{this.props.menuInfo.MENU_NAME}</Text>
                        </View>
                    }
                    
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    menuSize: {
        height: 100,
        marginVertical: 10
    },
    menuSec:{
        flex:1, 
        borderBottomWidth: 1, 
        borderRightWidth: 1, 
        borderColor: '#eee',
    },
    menuSecR:{
        flex:1, 
        borderBottomWidth: 1, 
        borderColor: '#eee'
    },
    menuSecNoBorder:{
        flex:1
    }
});