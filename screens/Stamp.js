import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Dimensions, ScrollView, Image, FlatList} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStampDetail, getPageColor } from '../constants/Api';
import { showToast } from '../components/Global';
import Layout from '../constants/Layout';
import { Actions } from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import * as SecureStore from 'expo-secure-store';
export default class Stamp extends React.Component {
    constructor(props){
        super(props);
        this.state = {     
            stamp_info : null,
            user_id: 0,
            pageColor: null,
            stampCount: 0,
            loaded: true
        };
    }

    UNSAFE_componentWillReceiveProps(){
        this.refresh()
    }

    async refresh(){
        let user_id = await SecureStore.getItemAsync('user_id');
        this.setState({user_id : user_id})
        this.setState({loaded: false})
        await getPageColor()
        .then((response) => {
          if(response.data == false || response.data.length == 0){
              return;
          }else{
              this.setState({pageColor: response.data})
          }
        })
        

        await getStampDetail(this.props.id, user_id)
        .then((response) => {
            this.setState({loaded: true})
          if(response.data == false || response.data.length == 0){
              return;
          }else{
              if(response.data.length > 1){
                let temp = [];
                temp[0] = response.data[0];
                this.setState({stamp_info: temp})
              }
              else
                this.setState({stamp_info: response.data})
              if(response.data[0]['SCAN_DATE'] != null && response.data[0]['SCAN_DATE'] != '')
                this.setState({stampCount : response.data.length})
              else
                this.setState({stampCount: 0})
          }
        })
        .catch((error) => {
            this.setState({loaded: true})
            showToast();
        });
    }

    async componentDidMount(){
        this.refresh()
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
        return (
            <ScrollView style={this.state.pageColor != null ? {backgroundColor: this.state.pageColor[0]['PAGE_BACK_COLOR']} : '#eee'}>
                {
                    this.state.stamp_info != null ?
                    <FlatList
                        data={this.state.stamp_info}
                        renderItem={(stamp) => <StampInfo stampInfo={stamp.item} index={stamp.index} userID={this.state.user_id} pageColor={this.state.pageColor} stampCount={this.state.stampCount} />}
                        keyExtractor={stamp => stamp.ID}
                    />
                    :
                    null
                }
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </ScrollView>
        );
    }
    
}

class StampInfo extends React.Component {
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

    gotoQRScann(id){
        Actions.push("qrscan", {id : id})
    }

    renderStampEmptySection(count){
        var section = [];
        for (var i = 0;i<count;i++){
            section.push(<View style={ styles.stampRow } key={i}>
                <View style={styles.stamp}>
                </View>
                <View style={styles.stamp}>
                </View>
                <View style={styles.stamp}>
                </View>
                <View style={styles.stamp}>
                </View>
            </View>)
        }
        return section;
    }

    renderStampSection(stampCount){
        var section = [];
        if(stampCount % 4 == 0){
            for(var i = 1;i<=Math.ceil(stampCount/4);i++){
                section.push(
                    <View style={ styles.stampRow }>
                        <View style={ styles.stamp }>
                            <Image resizeMode="contain" style={{height: '80%'}} source={{uri: Layout.serverUrl + this.props.stampInfo['URL']}}/>
                        </View>
                        <View style={styles.stamp}>
                            <Image resizeMode="contain" style={{height: '80%'}} source={{uri: Layout.serverUrl + this.props.stampInfo['URL']}}/>
                        </View>
                        <View style={styles.stamp}>
                            <Image resizeMode="contain" style={{height: '80%'}} source={{uri: Layout.serverUrl + this.props.stampInfo['URL']}}/>
                        </View>
                        <View style={styles.stamp}>
                            <Image resizeMode="contain" style={{height: '80%'}} source={{uri: Layout.serverUrl + this.props.stampInfo['URL']}}/>
                        </View>
                    </View>
                )
            }
        }else{
            for(var i = 1;i<Math.ceil(stampCount/4);i++){
                section.push(
                    <View style={ styles.stampRow }>
                        <View style={ styles.stamp }>
                            <Image resizeMode="contain" style={{height: '80%'}} source={{uri: Layout.serverUrl + this.props.stampInfo['URL']}}/>
                        </View>
                        <View style={styles.stamp}>
                            <Image resizeMode="contain" style={{height: '80%'}} source={{uri: Layout.serverUrl + this.props.stampInfo['URL']}}/>
                        </View>
                        <View style={styles.stamp}>
                            <Image resizeMode="contain" style={{height: '80%'}} source={{uri: Layout.serverUrl + this.props.stampInfo['URL']}}/>
                        </View>
                        <View style={styles.stamp}>
                            <Image resizeMode="contain" style={{height: '80%'}} source={{uri: Layout.serverUrl + this.props.stampInfo['URL']}}/>
                        </View>
                    </View>
                )
            }
            section.push(
                <View style={ styles.stampRow }>
                    <View style={ styles.stamp }>
                        {
                            stampCount % 4 >= 1 ?
                            <Image resizeMode="contain" style={{height: '80%'}} source={{uri: Layout.serverUrl + this.props.stampInfo['URL']}}/>
                            : null
                        }
                    </View>
                    <View style={styles.stamp}>
                        {
                            stampCount % 4 >= 2 ?
                            <Image resizeMode="contain" style={{height: '80%'}} source={{uri: Layout.serverUrl + this.props.stampInfo['URL']}}/>
                            : null
                        }
                    </View>
                    <View style={styles.stamp}>
                        {
                            stampCount % 4 >= 3 ?
                            <Image resizeMode="contain" style={{height: '80%'}} source={{uri: Layout.serverUrl + this.props.stampInfo['URL']}}/>
                            : null
                        }
                    </View>
                    <View style={styles.stamp}>
                    </View>
                </View>
            )
        }
        
        
        return section;
    }

    renderStamp(stampCount){
        if(stampCount == null || stampCount == 0){
            
            return this.renderStampEmptySection(1);
        }else{
            return this.renderStampSection(stampCount);
        }
    }

    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <View>
                <View style={styles.container}>
                    <PowerTranslator style={{fontSize: 17, marginTop: 5}} text={this.props.stampInfo['TITLE']} />
                    <View style={{width: '100%', alignItems: 'center', paddingVertical: 15, marginTop: 10}}>
                        <View style={{backgroundColor: '#000', opacity: 0.3, width: '100%', height:50, position: 'absolute'}}></View>
                        <PowerTranslator style={{color: 'white', opacity: 1}} text={'スタンプ取得数'}/>
                    </View>

                    <View style={styles.stampSection}>
                        {
                            this.renderStamp(this.props.stampCount)
                        }
                        
                    </View>

                    <TouchableOpacity onPress={() => this.gotoQRScann(this.props.stampInfo['ID'])} style={ [styles.receiveStamp, {backgroundColor: this.props.pageColor[0]['BUTTON_BACK_COLOR'], paddingVertical: 15}] }>
                        <View>
                            <PowerTranslator style={{color: 'white'}} text={'スタンプを受け取る'} />
                        </View>
                    </TouchableOpacity>

                    <View style={{width: '100%', alignItems: 'center', marginTop: 15, marginBottom: 5}}>
                        <PowerTranslator style={{fontSize: 18, color: 'black'}} text={'会員ID'} />
                    </View>

                    <View style={ [styles.receiveStamp, {backgroundColor: '#fff', opacity: 0.8, paddingVertical: 15}] }>
                        <Text style={{color: 'black'}}>{this.props.userID}</Text>
                    </View>
                </View>
                <View style={{width: '100%', backgroundColor: this.props.pageColor[0]['TITLE_BAR_BACK_COLOR'],padding: 10,}}>
                    <PowerTranslator style={{fontSize: 18, color: this.props.pageColor[0]['TITLE_BAR_FONT_COLOR']}} text={'スタンプ有効期限'} />
                </View>
                <View style={{padding: 10}}>
                    <PowerTranslator text={'初回スタンプを獲得してから'+this.props.stampInfo['STAMP_CARD_VALID_DAYS']+'日間'}/>
                </View>

                <View style={{width: '100%', backgroundColor: this.props.pageColor[0]['TITLE_BAR_BACK_COLOR'],padding: 10,}}>
                    <PowerTranslator style={{fontSize: 18, color: this.props.pageColor[0]['TITLE_BAR_FONT_COLOR']}} text={'スタンプについて'} />
                </View>
                <View style={{padding: 10}}>
                    <PowerTranslator text={this.props.stampInfo['DETAIL']}/>
                </View>

                <View style={{width: '100%', backgroundColor: this.props.pageColor[0]['TITLE_BAR_BACK_COLOR'],padding: 10,}}>
                    <PowerTranslator style={{fontSize: 18, color: this.props.pageColor[0]['TITLE_BAR_FONT_COLOR']}} text={'特典について'} />
                </View>
                <View style={{padding: 10}}>
                    {
                        this.props.stampInfo['URL'] != '' ?
                        <Image resizeMode={'contain'} style={{width: '100%', height: 150}} source={{uri:Layout.serverUrl + this.props.stampInfo['BONUS_IMAGE']}}/>
                        :
                        null
                    }
                    <PowerTranslator style={{marginTop: 10}} text={this.props.stampInfo['PRIVILEGE_DETAIL']}/>
                </View>
                {
                    this.props.stampInfo['TERMS_CONDITIONS'] != '' ?
                    <View style={{padding: 10, borderColor: '#989898', borderTopWidth: 1}}>
                        <PowerTranslator text={this.props.stampInfo['TERMS_CONDITIONS']}/>
                    </View>
                    :
                    null
                }
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center'
  },
  stampSection: {
    width: '100%', 
    backgroundColor: 'white', 
    padding: 5, 
  },
  stampRow: {
    flexDirection: 'row', 
    height: (Dimensions.get('window').width - 30) * 0.25
  },
  stamp: {
    flex: 1, 
    backgroundColor: '#eee', 
    margin: 3,
    justifyContent: 'center'
  },
  receiveStamp: {
    width: '100%', 
    padding: 10, 
    alignItems: 'center', 
    marginTop: 10, 
    borderRadius: 5
  }
});
