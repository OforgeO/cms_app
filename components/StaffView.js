import React from 'react';
import { StyleSheet, View, Image, Platform, TouchableOpacity, Text} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../constants/Layout';
import moment from 'moment';
export default class StaffView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            imgWidth:1,
            imgHeight: 1
        };
    }

    static navigationOptions = ({navigation}) => ({
        title: `${navigation.state.params.name}`,
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
        await Image.getSize(Layout.serverUrl + this.props.link,(width, height) => {
            this.setState({imgWidth: width}); 
            this.setState({imgHeight: height});
         }) ;
     }
    
    render(){
        return (
            <View style={styles.container}>
                <View style={{width: '100%', backgroundColor: 'white'}}>
                    <Image style={{aspectRatio: this.state.imgWidth/this.state.imgHeight}} source={{uri: Layout.serverUrl + this.props.link}}/>
                    <Text style={{paddingTop: 10, paddingLeft: 20, fontWeight: 'bold'}}>{this.props.info.NAME}</Text>
                    <Text style={{paddingTop: 10, paddingBottom: 10, paddingLeft: 20}}>{moment(this.props.info.BIRTHDAY).format('YYYY')}年{moment(this.props.info.BIRTHDAY).format('MM')}月{moment(this.props.info.BIRTHDAY).format('DD')}日</Text>
                </View>
            </View>
        );
    }
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    padding: 10
  },
});
