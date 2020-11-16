import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Dimensions, ScrollView, Image, Platform, FlatList} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import { getGallery } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../components/Global';
import Layout from '../constants/Layout';


export default class Gallery extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            loaded: true,
            photos: []
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
        this.setState({loaded: false});
        await getGallery(this.props.ID)
        .then(async (response) => {
            if(response.data == false || response.data.length == 0){
                this.setState({loaded: true});
                return;
            }else{
                var photos = response.data;
                var temp = {
                    MEDIA_LINK: ''
                }
                if(photos.length % 3 == 1){
                    photos.push(temp)
                    photos.push(temp)
                }
                if(photos.length % 3 == 2){
                    photos.push(temp)
                }
                this.setState({photos: photos})
            }
            this.setState({loaded: true});
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }
    
    render(){
        return (
            <View>
                <FlatList
                    data={this.state.photos}
                    renderItem={(photo) => <Photo photoInfo={photo.item} photo={photo.index} title={this.props.title}/>}
                    keyExtractor={photo => photo.ID}
                    horizontal = {false}
                    numColumns = { 3 }
                />
                
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
    
}

class Photo extends React.Component {
    constructor(props){
        super(props);
    }

    goto(title, link){        
        Actions.push('photo',{ title : title, link: link});
    }

    render(){
        return (
            <View style={{  flex: 1, marginBottom: 10, paddingHorizontal: 5 }}>
                <TouchableOpacity onPress={() => this.goto(this.props.title,this.props.photoInfo.MEDIA_LINK)}>
                    <Image resizeMode="contain" style={{width: (Layout.window.width - 20) * 0.3, height: 100}} source={{uri: Layout.serverUrl + this.props.photoInfo.MEDIA_LINK}}/>
                </TouchableOpacity>
            </View>
        );
    }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  catalogue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    alignItems: 'flex-start',
  }
});
