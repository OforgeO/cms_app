import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFreecontentDetail } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../components/Global';
import Layout from '../constants/Layout';
import HTML from 'react-native-render-html';

export default class Freecontent extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            freecontentDetail: null,
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
        let id = this.props.id;
        if(id == undefined){
            id = this.props.route.name.split("-");
            id = id[1];
        }
        this.setState({loaded: false});
        await getFreecontentDetail(id)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                this.setState({ freecontentDetail : response.data[0] })
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }
    
    render(){
        return (
            <View style={styles.container}>
                {
                    this.state.freecontentDetail != null ?
                    <HTML html={this.state.freecontentDetail.HTML} imagesMaxWidth={Layout.window.width} onLinkPress={(event, href)=>{Linking.openURL(href)}}/>
                    :
                    null
                }
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />    
            </View>
            
        );
    }
    
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 30
  },
  
});
