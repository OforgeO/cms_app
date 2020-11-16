import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, Text, FlatList} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { getNews } from '../constants/Api';
import { showToast } from '../components/Global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
export default class News extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            layout_type: 0,
            loaded: true,
            no_data : 0,
            news: [],
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
        this.setState({lang: lang});

        this.setState({loaded: false})
        await getNews()
        .then((response) => {
            this.setState({loaded: true})
            if(response.data == false || response.data.length == 0){
                this.setState({no_data : 1})
            }else{
                this.setState({no_data : 0})
                this.setState({news: response.data})
            }
        })
        .catch((error) => {
            this.setState({loaded: true})
            showToast();
        });
    }
    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <View style={styles.container}>
                {
                    this.state.no_data == 1 ?
                    <View style={{width: '100%', alignItems: 'center'}}>
                        <PowerTranslator style={{marginTop: 10, fontSize: 20}} text={'通知はあません'} />
                    </View>
                    :
                    <View>
                        <FlatList 
                            data={this.state.news}
                            renderItem={(news) => <NewsList newsInfo={news.item} />}
                            keyExtractor={news => news.ID}
                        />
                    </View>
                }
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
}

class NewsList extends React.Component {
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

    goNewsDetail(newsInfo){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const translator = TranslatorFactory.createTranslator();
        translator.translate(newsInfo.TITLE).then(translated => {
            Actions.push("newsdetail", {newsInfo: newsInfo, title: translated});
        });
    }

    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <TouchableOpacity onPress={() => this.goNewsDetail(this.props.newsInfo)}>
                <View style={styles.item}>
                    <View>
                        <PowerTranslator text={moment(this.props.newsInfo.EVENT_DATE).format('YYYY')+'年'+moment(this.props.newsInfo.EVENT_DATE).format('MM')+'月'+moment(this.props.newsInfo.EVENT_DATE).format('DD')+'日'}/>
                        <PowerTranslator style={styles.title} text={this.props.newsInfo.TITLE} />
                    </View>
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
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18
    }
});