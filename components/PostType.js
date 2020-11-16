import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Layout from '../constants/Layout';
import { ScrollView } from 'react-native-gesture-handler';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import * as SecureStore from 'expo-secure-store';
export default class PostType extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true
        }
    }
    

    render(){
        return (
            <ScrollView style={{backgroundColor: 'white'}}>
                <View style={{width: '100%'}}>
                    {
                        this.props.type == 1 ?
                        <FlatList
                            data={this.props.details}
                            renderItem={(detail) => <PostType1 freeInfo={detail.item} index={detail.index}/>}
                            keyExtractor={detail => detail.ID}
                            numColumns = { 2 }
                        />
                        :
                        null
                    }
                    {
                        this.props.type == 2 ?
                        <FlatList
                            data={this.props.details}
                            renderItem={(detail) => <PostType2 freeInfo={detail.item}/>}
                            keyExtractor={detail => detail.ID}
                        />
                        :
                        this.props.type == 3?
                        <FlatList
                            data={this.props.details}
                            renderItem={(detail) => <PostType3 freeInfo={detail.item}/>}
                            keyExtractor={detail => detail.ID}
                            numColumns = { 3 }
                        />
                        :
                        this.props.type == 4 ?
                        <FlatList
                            data={this.props.details}
                            renderItem={(detail) => <PostType4 freeInfo={detail.item}/>}
                            keyExtractor={detail => detail.ID}
                        />
                        :
                        null
                    }
                </View>
            </ScrollView>
        );
    }
}

class PostType1 extends React.Component {
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

    goDetail(id, title){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const translator = TranslatorFactory.createTranslator();
        translator.translate(title).then(translated => {
            Actions.push("postcontent", {id: id, title: translated})
        });
    }

    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <TouchableOpacity onPress={() => this.goDetail(this.props.freeInfo.ID, this.props.freeInfo.TITLE)} style={{width: '50%'}}>
                <View style={this.props.index % 2 == 1 ? {paddingLeft: 10} : {paddingRight: 10}}>
                    <View style={{flex: 1}}>
                        <Image resizeMode="contain" source={{uri: Layout.serverUrl + this.props.freeInfo.IMAGE}} style={{height: 150}} />
                    </View>
                    <View style={{flex: 1, alignItems: 'center', paddingTop: 10, paddingBottom: 20}}>
                        <PowerTranslator text={this.props.freeInfo.TITLE}/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

class PostType2 extends React.Component {
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

    goDetail(id, title){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const translator = TranslatorFactory.createTranslator();
        translator.translate(title).then(translated => {
            Actions.push("postcontent", {id: id, title: translated})
        });
    }

    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <TouchableOpacity onPress={() => this.goDetail(this.props.freeInfo.ID, this.props.freeInfo.TITLE)} style={{width: '100%'}}>
                <View style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <Image resizeMode="contain" source={{uri: Layout.serverUrl + this.props.freeInfo.IMAGE}} style={{height: 150}} />
                    </View>
                    <View style={{flex: 1, alignItems: 'center', paddingTop: 10, paddingBottom: 20}}>
                        <PowerTranslator text={this.props.freeInfo.TITLE}/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

class PostType3 extends React.Component {
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

    goDetail(id, title){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const translator = TranslatorFactory.createTranslator();
        translator.translate(title).then(translated => {
            Actions.push("postcontent", {id: id, title: translated})
        });
    }

    render(){
        
        return (
            <TouchableOpacity onPress={() => this.goDetail(this.props.freeInfo.ID, this.props.freeInfo.TITLE)} style={{width: '33%'}}>
                <View style={{flex: 1}}>
                    <Image resizeMode="cover" source={{uri: Layout.serverUrl + this.props.freeInfo.IMAGE}} style={{height: 100}} />
                </View>
            </TouchableOpacity>
        );
    }
}

class PostType4 extends React.Component {
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

    goDetail(id, title){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const translator = TranslatorFactory.createTranslator();
        translator.translate(title).then(translated => {
            Actions.push("postcontent", {id: id, title: translated})
        });
    }

    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <TouchableOpacity onPress={() => this.goDetail(this.props.freeInfo.ID, this.props.freeInfo.TITLE)} style={{width: '100%'}}>
                <View style={{flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee'}}>
                    
                        <View style={{flex: 3}}>
                            <Image resizeMode="contain" source={{uri: Layout.serverUrl + this.props.freeInfo.IMAGE}} style={{height: 100}} />
                        </View>
                        <View style={{flex: 7, justifyContent: 'center',paddingLeft: 10}}>
                            <PowerTranslator text={this.props.freeInfo.TITLE}/>
                        </View>
                    
                </View>
            </TouchableOpacity>
        );
    }
}
