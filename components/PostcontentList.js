import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPostcontentList } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import PostType from '../components/PostType';
import { showToast } from './Global';
export default class PostcontentList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            postcontentList: null,
            type: 0
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
        this.setState({loaded: false});
        let type = this.props.type;
        if(type == undefined){
            type = this.props.route.name.split("-");
            type = type[1];
        }
        getPostcontentList(type, moment().utcOffset(-540).format('YYYY-MM-DD'))
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                this.setState({postcontentList: response.data})
                this.setState({type : response.data[0]['POST_TYPE']})
                return;
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
                    this.state.type !=  0 ?
                    <PostType details={this.state.postcontentList} type={this.state.type}/>
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
      backgroundColor: '#fff',
    },
    couponList: {
        flexDirection: 'row', justifyContent: 'space-between', 
        paddingVertical: 10, 
        borderColor: 'gray', width: '100%', 
        borderBottomWidth: 1, alignItems: 'center'
    }
});