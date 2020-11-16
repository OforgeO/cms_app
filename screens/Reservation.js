import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getReservation, cancelBook, getBookDetail } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { showToast } from '../components/Global';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import Layout from '../constants/Layout';
import * as SecureStore from 'expo-secure-store';
export default class Reservation extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            reservation: [],
            selected: false,
            modalVisible: false,
            cancelId: 0,
            cancelType: 1,
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
        this.refresh();
    }

    UNSAFE_componentWillReceiveProps(){
        this.refresh()
    }

    async refresh(){
        let user_id = await SecureStore.getItemAsync('user_id');
        this.setState({loaded: false});
        getReservation(user_id)
        .then(async (response) => {
            this.setState({loaded: true});
            this.setState({reservation: response.data})
            return;
            
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    onSelect = data => {
        this.componentDidMount();
        this.setState(data);
    };

    addReservataion(title, type){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const translator = TranslatorFactory.createTranslator();
        translator.translate(title).then(translated => {
            Actions.push("addreservation", {title: translated, type: type})
        });
    }

    showCancelModal(id, type){
        this.setState({cancelId: id})
        this.setState({cancelType: type})
        this.setState({modalVisible : true})
    }

    cancelBook(){
        this.setState({loaded: false});
        cancelBook(this.state.cancelId, this.state.cancelType)
        .then(async (response) => {
            this.setState({loaded: true});
            this.setState({modalVisible: false})
            this.refresh();
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    getBookDetail(bookID){
        this.setState({loaded: false});
        getBookDetail(bookID)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
                const translator = TranslatorFactory.createTranslator();
                translator.translate('日時指定予約').then(translated => {
                    Actions.push("addreservation", {title: translated, bookName: response.data[0]['NAME'], assignId: response.data[0]['ASSIGN_ID'], email: response.data[0]['EMAIL'], numberofperson: response.data[0]['NUMBER_OF_RPERSONS'], phone: response.data[0]['PHONE'], bookDate: moment(response.data[0]['RESERVATION_DATE']).format("YYYY-MM-DD"), bookEndDate: moment(response.data[0]['RESERVATION_END_DATE']), bookTime: response.data[0]['RESERVATION_TIME'], editBook: 1, bookID: bookID, type: 1})
                });
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    renderBook(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return this.state.reservation.map((book) => {
            return  <View style={{paddingVertical: 10, borderColor: 'gray', width: '100%', borderBottomWidth: 1, paddingLeft: 10}}>
                        {
                            book.RESERVATION_END_DATE != '' && book.RESERVATION_END_DATE != null ?
                            <PowerTranslator text={moment(book.RESERVATION_DATE).format('YYYY')+'年'+moment(book.RESERVATION_DATE).format('MM')+'月'+moment(book.RESERVATION_DATE).format('DD')+'日　～　'+moment(book.RESERVATION_END_DATE).format('YYYY')+'年'+moment(book.RESERVATION_END_DATE).format('MM')+'月'+moment(book.RESERVATION_END_DATE).format('DD')+'日'}/>
                            :
                            <PowerTranslator text={moment(book.RESERVATION_DATE).format('YYYY')+'年'+moment(book.RESERVATION_DATE).format('MM')+'月'+moment(book.RESERVATION_DATE).format('DD')+'日'}/>
                        }
                        
                        {
                            book.RESERVATION_TIME != '' && book.RESERVATION_TIME != null ?
                            <PowerTranslator text={book.RESERVATION_TIME}/>
                            :
                            null
                        }
                        {
                            book.NUMBER_OF_RPERSONS != '' && book.NUMBER_OF_RPERSONS != 0 ?
                            <PowerTranslator text={book.NUMBER_OF_RPERSONS+'人'}/>
                            :
                            null
                        }
                        {
                            book.ORDER != null ?
                            <PowerTranslator text={'順番: '+book.ORDER+'番目'}/>
                            :
                            null
                        }
                        {
                            book.STATUS == 3?
                            <PowerTranslator text={'ステータス: 承認済み'}/>
                            :
                            null
                        }
                        <View style={{alignItems: 'center'}}>
                            {
                                book.TYPE == 1 && book.STATUS == 1?
                                <TouchableOpacity onPress={()=>this.getBookDetail(book.ID)} style={[styles.btn, {backgroundColor: '#72b265'}]}>
                                    <PowerTranslator style={{color:'white'}} text={'変更'} />
                                </TouchableOpacity>
                                :
                                null
                            }
                            {
                                book.STATUS == 1 ?
                                <TouchableOpacity onPress={()=> this.showCancelModal(book.ID, book.TYPE)} style={[styles.btn, {backgroundColor: '#c7554c'}]}>
                                    <PowerTranslator style={{color:'white'}} text={'取消'} />
                                </TouchableOpacity>
                                :
                                null
                            }
                            
                        </View>
                    </View>
        })
    }

    closeModal(){
        this.setState({modalVisible: false})
    }

    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return (
            <ScrollView>
                <Modal isVisible={this.state.modalVisible}>
                    <View style={styles.modalContent}>
                        <View style={{padding: 10, borderColor: '#eee', borderBottomWidth: 1}}>
                            <PowerTranslator text={'取消確認'}/>
                        </View>
                        <View style={{padding: 10, borderColor: '#eee', borderBottomWidth: 1}}>
                            <PowerTranslator text={'ご指定のご予約を取り消します。よろしいですか。'}/>
                        </View>
                        <View style={{padding: 10, borderColor: '#eee', borderBottomWidth: 1, flexDirection: 'row',alignItems: 'center', justifyContent: 'center'}}>
                            <TouchableOpacity onPress={()=>this.cancelBook()} style={{borderColor: '#eee', paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#e0e0e0', marginRight: 10}}>
                                <PowerTranslator text={'はい'}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.closeModal()} style={{borderColor: '#eee', paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#e0e0e0', marginLeft: 10}}>
                                <PowerTranslator text={'いいえ'}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View style={styles.container}>
                    {
                        /*<View style={{ paddingBottom: 10}}>
                            <TouchableOpacity onPress={() =>this.addReservataion('順番予約',2)} style={[styles.calendarBook, {backgroundColor: '#5fa9d7'}]}>
                                <MaterialCommunityIcons name={"clock-outline"} color="white" size={24} style={{paddingRight: 5}} />
                                <Text style={{color: 'white'}}>順番予約</Text>
                            </TouchableOpacity>
                        </View>*/
                    }
                    
                    <View style={{ paddingBottom: 10}}>
                        <TouchableOpacity onPress={() =>this.addReservataion('日時指定予約',1)} style={styles.calendarBook}>
                            <MaterialCommunityIcons name={"calendar-clock"} color="white" size={24} style={{paddingRight: 5}} />
                            <PowerTranslator style={{color: 'white'}} text={'日時指定予約'}/>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {
                            this.renderBook()
                        }
                    </View>
                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    calendarBook: {
        backgroundColor: '#72b265',
        borderRadius: 30,
        width: '80%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginRight: 10,
        marginTop: 10, 
        flexDirection: 'row'
    },
    btn:{
        width: 200, 
        borderRadius: 20, 
        alignItems: 'center', 
        paddingVertical: 5,
        justifyContent: 'center',
        marginVertical: 5
    },
    modalContent:{
        backgroundColor: 'white',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.8)',
    }
});