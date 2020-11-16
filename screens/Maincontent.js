import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMaincontentDetail } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../components/Global';
import Layout from '../constants/Layout';
import { ScrollView } from 'react-native-gesture-handler';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import * as SecureStore from 'expo-secure-store';
export default class Maincontent extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            maincontentDetail: null,
            lang: 'auto'
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
        let lang = await SecureStore.getItemAsync("language");
        if(lang == null)
            lang = 'auto';
        this.setState({lang: lang});
        let type = this.props.type;
        if(type == undefined){
            type = this.props.route.name.split("-");
            type = type[1];
        }

        this.setState({loaded: false});
        await getMaincontentDetail(type)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                this.setState({ maincontentDetail : response.data })
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    renderContent(){

        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return this.state.maincontentDetail.map((content) => {
            return <View style={{width: '100%'}}>
                {
                    content.IMAGE != '' && content.IMAGE != null ?
                    <Image resizeMode="contain" style={{height: 250}} source={{uri: Layout.serverUrl + content.IMAGE}} />
                    :
                    null
                }
                <PowerTranslator text={content.TITLE} style={{marginBottom: 15, marginTop: 15, fontWeight: 'bold', fontSize: 18}}/>
                <PowerTranslator style={{marginBottom: 15}} text={content.COMMENT}/>
        </View>
        })
    }
    
    render(){
        
        return (
            <ScrollView style={{backgroundColor: '#eee'}}>
                <View style={styles.container}>
                    {
                        this.state.maincontentDetail != null ?
                        this.renderContent()
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
    padding: 10,
    alignItems: 'center',
  },
  
});
