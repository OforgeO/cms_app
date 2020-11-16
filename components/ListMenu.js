import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Platform, FlatList} from 'react-native';
import { getTopMenu, getLayoutSetting } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Layout from '../constants/Layout';
import { Actions } from 'react-native-router-flux';
import * as SecureStore from 'expo-secure-store';
export default class ListMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            menuList: [],
            loaded: true,
            layoutSetting: [],
            loadComplete: 0
        }
    }
    async componentDidMount(){
        this.setState({loaded: false});
        let type = await SecureStore.getItemAsync('all_app');
        await getTopMenu(Platform.OS, type)
        .then((response) => {
            if(response.data == false){
                //showToast();
                return;
            }else{
                this.setState({menuList : response.data})
            }
        })

        await getLayoutSetting()
        .then((response) => {
            if(response.data == false){
                //showToast();
                this.setState({loaded: true})
                return;
            }else{
                this.setState({layoutSetting: response.data})
                this.setState({loaded: true})
                this.setState({loadComplete: 1})
            }
        })
        .catch((error) => {
            this.setState({loaded: true})
            showToast();
        });
    }

    render(){
        return (
            <View style={styles.container}>
                {
                    this.state.loadComplete == 1 ?
                    <FlatList
                        data={this.state.menuList}
                        renderItem={(menu) => <Menu menuInfo={menu.item} index={menu.index} margin={this.state.layoutSetting}/>}
                        keyExtractor={menu => menu.ID}
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
        this.state = {
            margin: '',
            imgWidth: 0,
            imgHeight: 1
        }
    }

    async componentDidMount(){
        this.setState({margin: this.props.margin[0].IS_MARGIN_BETWEEN_MENUS})
        
        if(this.props.menuInfo.IMAGE_FOR_LIST != ''){
            await Image.getSize(Layout.serverUrl + this.props.menuInfo.IMAGE_FOR_LIST,(width, height) => {
                this.setState({imgWidth: width}); 
                this.setState({imgHeight: height});
            }) ;
        }
        
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
    }

    render(){
        return (
            <View>
            {
                this.props.menuInfo.BUTTON_TYPE == 1 ?
                <View style={this.state.margin == 'Y' ? [styles.menuSection, {marginHorizontal: 10, marginVertical: 5, backgroundColor: 'white'}] : [styles.menuSection, {backgroundColor: 'white'}]}>
                    <TouchableOpacity onPress={() => this.goPage(this.props.menuInfo.MENU_TYPE, this.props.menuInfo.TYPE, this.props.menuInfo.SUBTYPE, this.props.menuInfo.MENU_NAME, this.props.menuInfo.IS_MEMBER)}>
                        {
                            
                            this.props.menuInfo.IMAGE_FOR_LIST != '' ?
                            <Image resizeMode="stretch" source={{uri:Layout.serverUrl + this.props.menuInfo.IMAGE_FOR_LIST}} style={{width: '100%', height: 50}}/>
                            :
                            <View style={{height: 50}}>
                                <Text style={{paddingLeft: 10, flex: 2, color: 'black', top: 15,  position: 'absolute', zIndex: 999}}>{this.props.menuInfo.MENU_NAME}</Text>
                            </View>
                        }
                        
                    </TouchableOpacity>
                </View>
                :
                <View style={this.state.margin == 'Y' ? [styles.menuSection, {marginHorizontal: 10, marginVertical: 5, backgroundColor: this.props.menuInfo.BUTTON_BACK_COLOR != '' ? this.props.menuInfo.BUTTON_BACK_COLOR : 'white', color: this.props.menuInfo}] : [styles.menuSection, {backgroundColor: this.props.menuInfo.BUTTON_BACK_COLOR != '' ? this.props.menuInfo.BUTTON_BACK_COLOR : 'white'}]}>
                    <TouchableOpacity onPress={() => this.goPage(this.props.menuInfo.MENU_TYPE, this.props.menuInfo.TYPE, this.props.menuInfo.SUBTYPE, this.props.menuInfo.MENU_NAME, this.props.menuInfo.IS_MEMBER)}>
                        <View style={{height: 50, flex: 1, paddingVertical: 7, justifyContent: this.props.menuInfo.TITLE_POSITION == 1 ? 'center' : this.props.menuInfo.TITLE_POSITION == 2 ? 'flex-start' : 'flex-end'}}>
                            <Text style={{paddingLeft: 10, color: this.props.menuInfo.TITLE_TEXT_COLOR, zIndex: 999}}>{this.props.menuInfo.MENU_NAME}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            }
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e0e0e0',
    },
    menuSection: {
        flex: 1, 
        backgroundColor: '#fff'
    }
});