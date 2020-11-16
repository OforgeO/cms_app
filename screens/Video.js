import React from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { getPhotoVideo } from '../constants/Api';
import { showToast } from '../components/Global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
export default class Video extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: true,
      videos: [],
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
    
    this.setState({loaded: false})
    await getPhotoVideo()
    .then((response) => {
      if(response.data == false || response.data.length == 0){
          this.setState({loaded: true})
          return;
      }else{
          var videoList = [];
          response.data.map((item) => {
            if(item .TYPE == 2){
              let videoLink = item.MEDIA_LINK.split("?v=") 
              item.VIDEO_ID = videoLink[1]
              videoList.push(item)

            }
          })
          
          this.setState({videos : videoList})
          this.setState({loaded: true})
      }
    })
    .catch((error) => {
      this.setState({loaded: true})
      showToast();
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
            data={this.state.videos}
            renderItem={(video) => <VideoSection videoInfo={video.item} index={video.index}/>}
            keyExtractor={video => video.ID}
        />
        <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
      </View>
    );
  }
}

class VideoSection extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        visible: true,
        lang: 'auto'
      }
  }

  async componentDidMount(){
    let lang = await SecureStore.getItemAsync("language");
    if(lang == null)
      lang = 'auto';
    this.setState({lang: lang});
  }

  showSpinner() {
    this.setState({ visible: true });
  }
 
  hideSpinner() {
    this.setState({ visible: false });
  }

  render(){
    TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
      return (
        <View style={{height: 200, marginBottom: 20}}>
          {
            this.state.visible ? (
              <ActivityIndicator
                color="#009688"
                size="large"
                style={styles.ActivityIndicatorStyle}
              />
            ) : null
          }
          <WebView
            domStorageEnabled={true}
            javaScriptEnabled={true}
            useWebKit={true}
            source={{ uri: 'https://www.youtube.com/embed/'+this.props.videoInfo.VIDEO_ID}}
            onLoadStart={() => this.showSpinner()}
            onLoad={() => this.hideSpinner()}
          />
          <View style={{width: '100%', alignItems: 'center'}}>
            <PowerTranslator style={{marginTop: 10}} text={this.props.videoInfo.COMMENT} />
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
});