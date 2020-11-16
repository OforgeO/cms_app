import React from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity} from 'react-native';
import { addStamp } from '../constants/Api';
import { showToast } from '../components/Global';
import { Actions } from 'react-native-router-flux';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
export default class QRScan extends React.Component {
    constructor(props){
        super(props);
        this.state = {     
            hasPermission : null,
            loaded: true,
            scanned: false,
            alertShow: false,
            modalVisible: false,
            issueType: 0,
            lang: 'auto'
        };
    }

    async componentDidMount(){
      let lang = await SecureStore.getItemAsync("language");
      if(lang == null)
        lang = 'auto';
      this.setState({lang: lang});
      let user_id = await SecureStore.getItemAsync('user_id');
      this.setState({user_id : user_id})
      const status = await BarCodeScanner.requestPermissionsAsync();
      this.setState({hasPermission : status})
    }

    handleBarCodeScanned = ({type,data}) => {
      var qr = data.split('/')
      this.setState({scanned: true})
      this.setState({loaded: false})
      addStamp(this.state.user_id, this.props.id, qr[qr.length-1])
      .then((response) => {
        this.setState({loaded: true})
        if(response.data[0]){
            Actions.pop({ refresh: {} });
        }else{
          this.setState({modalVisible: true})
          if(response.data[1] == 'no_stamp'){
            this.setState({issueType : 1})
          }else if(response.data[1] == 'limit_count'){
            this.setState({issueType : 2})
          }else if(response.data[1] == 'over_day'){
            this.setState({issueType : 3})
          }
        }
      })
      .catch((error) => {
          this.setState({loaded: true})
          showToast();
      });
    }

    disableModal(){
      this.setState({modalVisible: false})
      this.setState({scanned: false})
    }
    
    render(){
      TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <View style={{flex: 1,flexDirection: 'column',justifyContent: 'flex-end',}}>
                <Modal isVisible={this.state.modalVisible}>
                    <View style={styles.modalContent}>
                        <View style={{padding: 10, borderColor: '#eee', borderBottomWidth: 1}}>
                            <PowerTranslator text={'警告！'}/>
                        </View>
                        <View style={{padding: 10, borderColor: '#eee', borderBottomWidth: 1}}>
                          {
                            this.state.issueType == 1 ?
                            <PowerTranslator text={'設定されたQRコードではございません。もう一度確認してください。'} />
                            :
                            null
                          }
                          {
                            this.state.issueType == 2 ?
                            <PowerTranslator text={'スタンプの上限をすでに超しましたので獲得できません。'}/>
                            :
                            null
                          }
                          {
                            this.state.issueType == 3 ?
                            <PowerTranslator text={'一日で一つのスタンプのみ獲得できます。'}/>
                            :
                            null
                          }
                        </View>
                        <View style={{padding: 10, borderColor: '#eee', borderBottomWidth: 1, flexDirection: 'row',alignItems: 'center', justifyContent: 'center'}}>
                            <TouchableOpacity onPress={()=>this.disableModal()} style={{borderColor: '#eee', paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#e0e0e0', marginRight: 10}}>
                                <PowerTranslator text={'はい'}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <BarCodeScanner
                    onBarCodeScanned={!this.state.scanned && this.handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
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
  },
  modalContent:{
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.8)',
  }
});
