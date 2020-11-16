import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button, Platform} from 'react-native';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';
import { cancelReservation } from '../constants/Api';
import { showToast } from '../components/Global';
import { Ionicons } from '@expo/vector-icons';

export default class ReservationDetail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: '予約詳細',
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

    cancelReservation(ID){
        
        cancelReservation(ID)
        .then(async (response) => {
            /*
            const { navigation } = this.props;
            navigation.goBack();
            navigation.state.params.onSelect({selected: true})*/
            Actions.push("reservation");
            return;
        })
        .catch((error) => {
            showToast();
        });
        
    }
    
    render(){
        return (
            <View style={styles.container}> 
                <View style={styles.logoContainer}>

                    <View style={styles.infoSection}>
                        <Text>人数</Text>
                        <Text >{this.props.info.NUMBER_OF_RPERSONS}人</Text>
                    </View>
                    
                    <View style={styles.infoSection}>
                        <Text>予約日</Text>
                        <Text>{moment(this.props.info.RESERVATION_DATETIME).format('YYYY')}年{moment(this.props.info.RESERVATION_DATETIME).format('MM')}月{moment(this.props.info.RESERVATION_DATETIME).format('DD')}日</Text>
                    </View>

                    <View style={styles.infoSection}>
                        <Text>予約時間</Text>
                        <Text>{moment(this.props.info.RESERVATION_DATETIME).format('HH')}時{moment(this.props.info.RESERVATION_DATETIME).format('mm')}分</Text>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20}}>
                        <Button
                            title="取り消す"
                            color="#bcbcbc"
                            onPress={() => this.cancelReservation(this.props.info.ID)}
                        />
                        <Button
                            title="保存"
                            color="#09888e"
                            onPress={() => {this.props.navigation.goBack()}}
                        />
                    </View>
                    
                </View>
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eee',
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
    },
    infoSection: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        backgroundColor: 'white', 
        width: '100%', 
        alignItems: 'center', 
        padding: 10, 
        borderColor: '#bcbcbc', 
        borderTopWidth: 1,
        height: 50
    },
    input: {
        borderColor: '#bcbcbc',
        borderBottomWidth: 1,
        width: "40%"
    },
    btnText: {
        backgroundColor: '#000',
        padding: 15,
        width: "100%",
        borderRadius: 30,
        color: '#fff',
        textAlign: 'center',
    },
    labelText: {
        paddingBottom: 10,
        width: "80%",
        textAlign: "left"
    },
    invalid: {
      borderWidth: 1,
      borderColor: 'red'
    }
});