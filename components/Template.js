import React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import { getPostcontentList, getPostContent, getTopMenuOne } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import Layout from '../constants/Layout';
import { ScrollView } from 'react-native-gesture-handler';
import Banner from './Banner';
import { showToast } from './Global';
import ViewSlider from 'react-native-view-slider'
import Menu from './Menu';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import * as SecureStore from 'expo-secure-store';
import HTML from 'react-native-render-html';
export default class Template extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            postcontentList: null,
            type: 0,
            topMenuOne: null,
            lang: 'auto'
        }
    }

    async componentDidMount(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        let lang = await SecureStore.getItemAsync("language");
        if(lang == null)
            lang = 'auto';
        this.setState({lang: lang});
        if(this.props.type != 7 && this.props.type != 10 && this.props.type != 9){
            this.setState({loaded: false});
            getPostcontentList(this.props.item.ID, moment().utcOffset(-540).format('YYYY-MM-DD'))
            .then(async (response) => {
                this.setState({loaded: true});
                if(response.data == false || response.data.length == 0){
                    return;
                }else{
                    this.setState({postcontentList: response.data})
                    return;
                }
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
        }else{
            let type = await SecureStore.getItemAsync('all_app');
            await getPostContent(type, moment().utcOffset(-540).format('YYYY-MM-DD'))
            .then((response) => {
                if(response.data == false || response.data.length == 0){
                    return;
                }else{
                    this.setState({postcontentList : response.data})
                }
                
            })
            .catch((error) => {
                showToast();
            });
            if(this.props.type == 9){
                await getTopMenuOne()
                .then((response) => {
                    if(response.data == false || response.data.length == 0){
                        return;
                    }else{
                        this.setState({topMenuOne : response.data})
                    }
                    
                })
                .catch((error) => {
                    showToast();
                });
            }
        }
        
    }

    renderPost(){
        return this.state.postcontentList.map((item, index) => {
            if(this.props.type == 4 || this.props.type == 7){
                return <View style={{width: '50%', padding: 10}}>
                        {
                            item.IMAGE != '' && item.IMAGE != null ?
                            <Image resizeMode="stretch" resizeMethod="resize" source={{uri: Layout.serverUrl + item.IMAGE}} style={styles.postImage1} />
                            :
                            <Image resizeMode="stretch" resizeMethod="resize" source={require('../assets/images/noimage1.jpg')} style={styles.postImage1} />
                        }
                        
                        <View style={{padding: 20}}>
                            <Text>{moment.unix(item.CREATE_TIME).format('YYYY.MM.DD')}</Text>
                            <Text style={{fontWeight: 'bold', fontSize: 18}}>{item.TITLE}</Text>
                            <HTML html={item.DETAIL} />
                            
                        </View>
                    </View>
            } else if(this.props.type == 10){
                if(index < 6){
                    return <View style={{width: Layout.window.width*0.33, padding: 5}}>
                        {
                            item.IMAGE != '' && item.IMAGE != null ?
                            <Image resizeMode="stretch" resizeMethod="resize" source={{uri: Layout.serverUrl + item.IMAGE}} style={styles.postImage2} />
                            :
                            <Image resizeMode="stretch" resizeMethod="resize" source={require('../assets/images/noimage1.jpg')} style={styles.postImage2} />
                        }
                    </View>
                }else{
                    return <View style={[styles.viewBox, {marginBottom: 2}]}>
                        <View style={{flexDirection: 'row', backgroundColor: '#ececec'}}>
                            {
                                item.IMAGE != '' && item.IMAGE != null ?
                                <Image resizeMode="stretch" resizeMethod="resize"  source={{uri: Layout.serverUrl + item.IMAGE}} style={{width: 100, height: 100}}/>
                                :
                                <Image resizeMode="stretch" resizeMethod="resize" source={require('../assets/images/noimage3.jpg')} style={{width: 100, height: 100}}/>
                            }
                            <View style={{paddingLeft: 20, justifyContent: 'center'}}>
                                <Text>{moment.unix(item.CREATE_TIME).format('YYYY.MM.DD')}</Text>
                                <Text style={{fontWeight: 'bold', fontSize: 18}}>{item.TITLE}</Text>
                                <HTML html={item.DETAIL} />
                            </View>
                        </View>
                    </View>
                }
            } else if(this.props.type == 8){
                if(index < 4){
                    return <View style={{width: Layout.window.width*0.25, padding: 5}}>
                        {
                            item.IMAGE != '' && item.IMAGE != null ?
                            <Image resizeMode="stretch" resizeMethod="resize" source={{uri: Layout.serverUrl + item.IMAGE}} style={styles.postImage2} />
                            :
                            <Image resizeMode="stretch" resizeMethod="resize" source={require('../assets/images/noimage3.jpg')} style={styles.postImage2} />
                        }
                    </View>
                } else if(index == 5){
                    <View style={{width: '100%'}}>
                        {
                            item.IMAGE != '' && item.IMAGE != null ?
                            <Image resizeMode="stretch" resizeMethod="resize" source={{uri: Layout.serverUrl + item.IMAGE}} style={styles.postImage1} />
                            :
                            <Image resizeMode="stretch" resizeMethod="resize" source={require('../assets/images/noimage1.jpg')} style={styles.postImage1} />
                        }
                    </View>
                } else{
                    return <View style={{width: '50%', padding: 10}}>
                        {
                            item.IMAGE != '' && item.IMAGE != null ?
                            <Image resizeMode="stretch" resizeMethod="resize" source={{uri: Layout.serverUrl + item.IMAGE}} style={styles.postImage1} />
                            :
                            <Image resizeMode="stretch" resizeMethod="resize" source={require('../assets/images/noimage1.jpg')} style={styles.postImage1} />
                        }
                        
                        <View style={{padding: 20}}>
                            <Text>{moment.unix(item.CREATE_TIME).format('YYYY.MM.DD')}</Text>
                            <Text style={{fontWeight: 'bold', fontSize: 18}}>{item.TITLE}</Text>
                            <HTML html={item.DETAIL} />
                        </View>
                    </View>
                }
            }else if(this.props.type == 9){
                if(index >= this.state.postcontentList.length / 2){
                    return <View style={{width: '33%', padding: 5}}>
                        {
                            item.IMAGE != '' && item.IMAGE != null ?
                            <Image resizeMode="stretch" resizeMethod="resize" source={{uri: Layout.serverUrl + item.IMAGE}} style={styles.postImage2} />
                            :
                            <Image resizeMode="stretch" resizeMethod="resize" source={require('../assets/images/noimage3.jpg')} style={styles.postImage2} />
                        }
                        
                        <View style={{}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18}}>{item.TITLE}</Text>
                            <HTML html={item.DETAIL} />
                        </View>
                    </View>
                }
                
            }else{
                
                return <View style={{width: '100%'}}>
                    {
                        item.IMAGE != '' && item.IMAGE != null ?
                        <Image resizeMode="stretch" resizeMethod="resize" source={{uri: Layout.serverUrl + item.IMAGE}} style={styles.postImage} />
                        :
                        <Image resizeMode="stretch" resizeMethod="resize" source={require('../assets/images/noimage1.jpg')} style={styles.postImage} />
                    }
                    {
                        this.props.type == 1 ?
                        <View style={{padding: 20}}>
                            <Text>{moment.unix(item.CREATE_TIME).format('YYYY.MM.DD')}</Text>
                            <Text style={{fontWeight: 'bold', fontSize: 18}}>{item.TITLE}</Text>
                            <HTML html={item.DETAIL} />
                        </View>
                        :
                        null
                    }
                    
                </View>
            }
            
        })
    }

    renderSlidePost(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        return this.state.postcontentList.map((post, index)=> {
            if(this.props.type == 3 || this.props.type == 11){
                return <View style={styles.viewBox}>
                    <View style={{flexDirection: 'row', backgroundColor: '#ececec'}}>
                        {
                            post.IMAGE != '' && post.IMAGE != null ?
                            <Image resizeMode="stretch" resizeMethod="resize"  source={{uri: Layout.serverUrl + post.IMAGE}} style={{width: 100, height: 100}}/>
                            :
                            <Image resizeMode="stretch" resizeMethod="resize" source={require('../assets/images/noimage3.jpg')} style={{width: 100, height: 100}}/>
                        }
                        <View style={{paddingLeft: 20, justifyContent: 'center'}}>
                            <PowerTranslator text={moment.unix(post.CREATE_TIME).format('YYYY.MM.DD')} />
                            <PowerTranslator style={{fontWeight: 'bold', fontSize: 18}} text={post.TITLE} />
                            <HTML html={post.DETAIL} />
                        </View>
                    </View>
                </View>
            }else if(this.props.type == 9 && index < this.state.postcontentList.length/2){
                return <View style={{width: Layout.window.width}}>
                    <View style={{backgroundColor: 'white'}}>
                        {
                            post.IMAGE != '' && post.IMAGE != null ?
                            <Image resizeMode="stretch" resizeMethod="resize"  source={{uri: Layout.serverUrl + post.IMAGE}} style={{width: Layout.window.width, height: Layout.window.width * 0.75}}/>
                            :
                            <Image resizeMode="stretch" resizeMethod="resize" source={require('../assets/images/noimage1.jpg')} style={{width: Layout.window.width, height: Layout.window.width * 0.75}}/>
                        }
                        <View style={{justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor : '#ececec'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18}}>{post.TITLE}</Text>
                        </View>
                    </View>
                </View>
            }
        })
    }

    render(){
        
        return (
            <View style={styles.container}>
                <ScrollView>
                {
                    this.props.type == 3 || this.props.type == 4 || this.props.type == 10 || this.props.type == 11?
                    <Banner />
                    : 
                    null
                }
                {
                    this.props.type != 3 && this.props.type != 9 && this.props.type != 11 && this.state.postcontentList != null?
                    <View style={{ flexDirection: 'row',flexWrap: 'wrap'}}>
                        {
                            this.props.type == 8 ?
                            <View style={{width: '100%', paddingLeft: 5, paddingVertical: 10}}>
                                <Text style={{fontWeight: 'bold', fontSize: 18}}>ピックアップ記事</Text>
                            </View>
                            :
                            null
                        }
                        {this.renderPost()}
                    </View>
                    :
                    null
                }
                {
                    (this.props.type == 3 || this.props.type == 11) && this.state.postcontentList != null ?
                    <ViewSlider 
                        renderSlides = {
                        <>
                            {this.renderSlidePost()}
                        </>
                        }
                        style={styles.slider}     //Main slider container style
                        height = {150}    //Height of your slider
                        slideCount = {this.state.postcontentList.length}    //How many views you are adding to slide
                        dots = {true}     // Pagination dots visibility true for visibile 
                        dotActiveColor = 'red'     //Pagination dot active color
                        dotInactiveColor = 'gray'    // Pagination do inactive color
                        dotsContainerStyle={styles.dotContainer}     // Container style of the pagination dots
                        autoSlide = {true}    //The views will slide automatically
                        slideInterval = {4000}    //In Miliseconds
                    />
                    :
                    null
                }
                {
                    this.props.type == 9 && this.state.postcontentList != null ?
                    <ViewSlider 
                        renderSlides = {
                        <>
                            {this.renderSlidePost()}
                        </>
                        }
                        style={styles.slider}     //Main slider container style
                        height = {Layout.window.width * 0.75+70}    //Height of your slider
                        slideCount = {Math.ceil(this.state.postcontentList.length / 2)}    //How many views you are adding to slide
                        dots = {true}     // Pagination dots visibility true for visibile 
                        dotActiveColor = 'red'     //Pagination dot active color
                        dotInactiveColor = 'gray'    // Pagination do inactive color
                        dotsContainerStyle={styles.dotContainer}     // Container style of the pagination dots
                        autoSlide = {true}    //The views will slide automatically
                        slideInterval = {4000}    //In Miliseconds
                    />
                    :
                    null
                }
                {
                    this.props.type == 9 && this.state.topMenuOne != null ?
                    this.state.topMenuOne[0]['IMAGE_FOR_PANEL'] != '' && this.state.topMenuOne[0]['IMAGE_FOR_PANEL'] != null ?
                    <Image source={{uri:Layout.serverUrl + this.state.topMenuOne[0]['IMAGE_FOR_PANEL']}} style={{width: Layout.window.width, height: Layout.window.width * 0.75}}/>
                    :
                    <Image source={require('../assets/images/noimage1.jpg')} style={{width: Layout.window.width, height: Layout.window.width * 0.75}}/>
                    :
                    null
                }
                {
                    this.props.type == 9 && this.state.postcontentList != null ?
                    <View style={{ flexDirection: 'row',flexWrap: 'wrap'}}>
                        { this.renderPost() }
                    </View>
                    :
                    null
                }
                {
                    this.props.type == 3 || this.props.type == 11 ?
                    <Menu type={this.props.type}/>
                    :
                    null
                }
                </ScrollView>
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
    },
    postImage: {
        width: '100%', 
        height: Layout.window.width * 0.72,
        marginBottom: 5
    },
    postImage1: {
        width: '100%', 
        height: (Layout.window.width - 20) * 0.36,
        marginBottom: 5
    },
    postImage2: {
        width: '100%', 
        height: (Layout.window.width - 30) * 0.24,
    },
    viewBox: {
        width: Layout.window.width,
        height: 100
    },
    slider: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    dotContainer: {
      backgroundColor: 'transparent',
      position: 'absolute',
      bottom: 0
    }
});