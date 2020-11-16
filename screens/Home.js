import React from 'react';
import { StyleSheet, View, ScrollView} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ListMenu from '../components/ListMenu';
import Banner from '../components/Banner'
import { checkMenuType } from '../constants/Api';
import * as SecureStore from 'expo-secure-store';
export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            layout_type: 0,
            layout_template_no: '',
        }
    }
    
    async componentDidMount(){

        await checkMenuType()
        .then((response) => {
            if(response.data == false){
                return;
            }else{
                
                if(response['data'][0]['LAYOUT_TYPE'] == 1){
                    Actions.reset("bottom", {type: response['data'][0]['LAYOUT_TEMPLATE_TYPE']})
                }else{
                    this.setState({layout_type : response['data'][0]['LAYOUT_TYPE']})
                }
            }
        })
        .catch((error) => {
            //showToast();
        });
    }
    render(){
        return (
            <View style={styles.container}>
                {
                    this.state.layout_type == 2?
                    <Header type={1}/>
                    :
                    null
                }
                <ScrollView>
                    {
                        this.state.layout_type == 2 ?
                        <View>
                            <Banner />
                            <ListMenu />
                            <Footer />
                        </View>
                        :
                        null
                    }
                </ScrollView>
            </View>
        );
    }
}

Home.navigationOptions = {
    header: null
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
});