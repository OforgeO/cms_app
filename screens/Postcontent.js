import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPostcontentDetail } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../components/Global';
import Layout from '../constants/Layout';
import { ScrollView } from 'react-native-gesture-handler';
import HTML from 'react-native-render-html';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import * as SecureStore from 'expo-secure-store';
export default class Postcontent extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            postcontentDetail: null,
            lang: 'auto'
        };
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

    async componentDidMount(){ 
        let lang = await SecureStore.getItemAsync("language");
        if(lang == null)
            lang = 'auto';
        this.setState({lang: lang});
        this.setState({loaded: false});
        await getPostcontentDetail(this.props.id)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                this.setState({ postcontentDetail : response.data[0] })
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
            <ScrollView style={{backgroundColor: '#eee'}}>
                <View style={styles.container}>
                    {
                        this.state.postcontentDetail != null ?
                        <View style={{width: '100%'}}>
                            <Image resizeMode="contain" style={{height: 250}} source={{uri: Layout.serverUrl + this.state.postcontentDetail.IMAGE}} />
                            <PowerTranslator text={this.state.postcontentDetail.DETAIL}/>
                        </View>
                        :
                        null
                    }
                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />    
                </View>
            </ScrollView>
        );
    }
    
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  
});
