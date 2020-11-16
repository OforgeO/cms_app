import React from 'react';
import { StyleSheet, View, Image} from 'react-native';
import { HFImage } from '../constants/Api';
import { showToast } from './Global';
import Layout from '../constants/Layout';
import Config from '../constants/Config';

export default class Footer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            footer_exist: 0,
            image_link: ''
        }
    }
    async componentDidMount(){
        //this.setState({footer_exist : Config.footerImageExist});
        await HFImage()
        .then((response) => {
            if(response.data == false){
                showToast();
                return;
            }else{
                if(response['data'][0].FOOTER_IMAGE_DEL_YN == 'N' && response['data'][0].FOOTER_IMAGE != ''){
                    this.setState({footer_exist : 1})
                    this.setState({image_link: Layout.serverUrl + response['data'][0].FOOTER_IMAGE})
                }
                else
                    this.setState({footer_exist : 0})
            }
            
        })
        .catch((error) => {
            showToast();
        });
    }

    render(){
        return (
            <View>
            {
                this.state.footer_exist == 1 ?
                <View style={styles.footer}>
                    <Image source={{uri: this.state.image_link}} style={{height:'100%', width: '100%'}} resizeMode="stretch"/>
                </View>
                :
                null
            }    
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    footer: {
        width: '100%',
        height: 60,
        alignItems: 'center',
    }
});