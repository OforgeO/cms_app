import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSocial } from '../constants/Api';
import { showToast } from '../components/Global';
import Layout from '../constants/Layout';
import { Actions } from 'react-native-router-flux';
import * as SecureStore from 'expo-secure-store';
import { SocialIcon } from 'react-native-elements';
export default class Social extends React.Component {
    constructor(props){
        super(props);
        this.state = {     
            social_info : null,
            loaded: true
        };
    }

    async componentDidMount(){
        this.setState({loaded: false})     
        await getSocial()
        .then((response) => {
            this.setState({loaded: true})
          if(response.data == false || response.data.length == 0){
              return;
          }else{
              this.setState({social_info : response.data[0]})
          }
        })
        .catch((error) => {
            this.setState({loaded: true})
            showToast();
        });
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

    goSocial(link, title){
        Actions.push("webviewlink", {link: link, menuName: title})
    }
    
    render(){
        return (
            <View style={styles.container}>
                {
                    this.state.social_info != null?
                    <View style={[styles.section, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                        <SocialIcon
                            type='facebook'
                            onPress={() => this.goSocial(this.state.social_info['FACEBOOK'], "Facebook")}
                        />
                        <SocialIcon
                            type='instagram'
                            onPress={() => this.goSocial(this.state.social_info['INSTAGRAM'], "Instagram")}
                        />
                        <SocialIcon
                            type='twitter'
                            onPress={() => this.goSocial(this.state.social_info['TWITTER'], "Twitter")}
                        />
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
