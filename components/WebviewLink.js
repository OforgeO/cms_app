import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { getWebviewLink } from '../constants/Api';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
export default class WebviewLink extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      link: '',
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
    this.setState({loaded: false});
    let type = this.props.type;
    if(type == undefined){
        type = this.props.route.name.split("-");
        type = type[1];
    }
    getWebviewLink(type)
    .then(async (response) => {
        this.setState({loaded: true});
        if(response.data == false || response.data.length == 0){
            return;
        }else{
            this.setState({link: response.data[0]['LINK']})
        }
        
    })
    .catch((error) => {
        this.setState({loaded: true});
        showToast();
    });
  }

  render() {
    TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
    return (
      <View style={styles.container}>
        {
          this.state.link != '' ?
          <WebView
              style={{width:'100%', height:'100%'}}
              domStorageEnabled={true}
              javaScriptEnabled={true}
              useWebKit={true}
              source={{
              uri: this.state.link,
              }}
          />
          :
          <PowerTranslator text={'ウェブビューのリンクがない'}/>
        }
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
});