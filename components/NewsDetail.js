import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, Text, FlatList, Image} from 'react-native';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import HTML from 'react-native-render-html';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
export default class NewsDetail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            year: `${moment(this.props.newsInfo.PUBLIC_DATE).format('YYYY')}`,
            month: `${moment(this.props.newsInfo.PUBLIC_DATE).format('MM')}`,
            day: `${moment(this.props.newsInfo.PUBLIC_DATE).format('DD')}`,
            imgWidth: 0,
            imgHeight: 1,
            lang: 'auto'
        }
    }
    async componentDidMount(){
        let lang = await SecureStore.getItemAsync("language");
        if(lang == null)
            lang = 'auto';
        this.setState({lang: lang});
        await Image.getSize(Layout.serverUrl + this.props.newsInfo.IMAGE,(width, height) => {
           this.setState({imgWidth: width}); 
           this.setState({imgHeight: height});
        }) ;
       
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


    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <ScrollView style={{backgroundColor: '#eee'}}>
                <View style={styles.container}>
                    <PowerTranslator style={{paddingBottom: 10}} text={this.state.year+'年'+this.state.month+'月'+this.state.day+'日更新'} />
                    <View style={styles.newsSection}>
                        <View style={{alignItems: 'center'}}>
                            <PowerTranslator style={{color: 'red', fontSize: 20}} text={this.props.newsInfo.TITLE}/>
                        </View>
                        <View>
                            <HTML html={this.props.newsInfo.DETAIL} imagesMaxWidth={Layout.window.width} />
                        </View>
                        <Image source={{uri: Layout.serverUrl + this.props.newsInfo.IMAGE}} style={{aspectRatio: this.state.imgWidth/this.state.imgHeight}}/>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eee',
      padding: 10,
    },
    newsSection: {
        backgroundColor: 'white',
        padding: 5,
        borderColor: 'gray',
        borderWidth: 1,
        width: '100%',
    }
});