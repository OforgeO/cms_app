import React from 'react';
import { StyleSheet, View} from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import { getSlide } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from './Global';
import Layout from '../constants/Layout';

export default class Banner extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            images: [],
            loaded : true
        }
    }

    async componentDidMount(){
        this.setState({loaded: false});
        await getSlide()
        .then((response) => {
            if(response.data == false){
                this.setState({loaded: true});
                showToast();
                return;
            }else{
                var bannerList = [];
                response.data.map((result) => {
                    bannerList.push(Layout.serverUrl + result.IMAGE);
                })
                this.setState({images : bannerList})
                this.setState({loaded: true});
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
                <SliderBox
                    images = {this.state.images}
                    autoplay = {true}
                    sliderBoxHeight = {Layout.window.width/2}
                    circleLoop
                    paginationBoxStyle={{
                        alignItems: "center",
                        alignSelf: "center",
                        justifyContent: "center",
                        backgroundColor: '#6f4b09',
                        width: '100%'
                    }}
                    ImageComponentStyle={{width: '100%', marginBottom: 30}}
                    resizeMode={'stretch'}
                    dotColor="#d4f5f5"
                    inactiveDotColor="white"
                    parentWidth={Layout.window.width}
                />
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      
      backgroundColor: '#fff',
    },
});