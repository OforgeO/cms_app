import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, TextInput} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSurveyQuestion, getSurveyOptions, addOptionAnswer } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from './Global';
import Layout from '../constants/Layout';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import * as Progress from 'react-native-progress';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import {CheckBox} from "native-base"
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import * as SecureStore from 'expo-secure-store';

export default class SurveyQuestion extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            surveyQuestion: null,
            loaded: true,
            curNo: 1,
            totalCnt: 0,
            curProgress: 0,
            surveyOptions: null,
            isRequired : 0,
            answerType: 0,
            checked: -1,
            selectedLang1:false,
            lang: 'auto',
            user_id : 0
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
        let lang = await SecureStore.getItemAsync("language");
        if(lang == null)
            lang = 'auto';
        this.setState({lang: lang});

        this.setState({loaded: false});
        user_id = await SecureStore.getItemAsync('user_id');
        this.setState({user_id : user_id})
        await getSurveyQuestion(this.props.id)
        .then(async (response) => {
            if(response.data == false || response.data.length == 0){
                this.setState({loaded: true});
                return;
            }else{
                this.setState({ surveyQuestion : response.data})
                this.setState({totalCnt : response.data.length})
                this.setState({curProgress : this.props.surveyno/response.data.length})
                this.setState({isRequired : response.data[this.props.surveyno-1]['INPUT_TYPE']})
                this.setState({answerType : response.data[this.props.surveyno-1]['ANSWER_TYPE']})
                this.getSurveyOptions(response.data[this.props.surveyno-1]['ID'], this.props.surveyno)
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    async getSurveyOptions(surveyQuestionID, surveyNo){
        
        this.setState({loaded: false});
        await getSurveyOptions(surveyQuestionID, surveyNo)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false || response.data.length == 0){
                return;
            }else{
                var optionArray = [];
                TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
                const translator = TranslatorFactory.createTranslator();
                
                await response.data.map(async (option) => {
                    await translator.translate(option['OPTION_VALUE']).then(translated => {
                        var temp = {
                            label: option['OPTION_VALUE'], value: option['ID'], checked: false, textValue: ''
                        }
                        optionArray.push(temp);
                    });
                    this.setState({surveyOptions : optionArray})
                })
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    async nextOption(){
        var optionID = 0;
        var is_required = 0;
        var curIndex = this.props.surveyno;
        //this.setState({checked : -1})
        if(this.state.answerType == 1){
            if(this.state.isRequired == 1 && this.state.checked == -1){
                showToast('必須入力です');
                is_required = 1;
            } else if(this.state.checked != -1){
                optionID = this.state.surveyOptions[this.state.checked]['value'];
                await addOptionAnswer(this.state.user_id,this.state.surveyQuestion[curIndex-1]['ID'], this.state.surveyQuestion[curIndex-1]['SURVEY_NO'],'', optionID)
                .then((response) => {
                    this.setState({loaded: true});
                })
                .catch((error) => {
                    this.setState({loaded: true});
                    showToast();
                });    
            }
        }
        else if(this.state.answerType == 2){
            var temp = '';
            for(var i = 0;i<this.state.surveyOptions.length;i++){
                if(this.state.surveyOptions[i]['checked']){
                    if(temp != '')
                        temp += ',';
                    temp += this.state.surveyOptions[i]['value'];
                }
            }
            
            if(this.state.isRequired == 1 && temp == ''){
                showToast('必須入力です');
                is_required = 1;
            } else if(temp != ''){
                await addOptionAnswer(this.state.user_id,this.state.surveyQuestion[curIndex-1]['ID'], this.state.surveyQuestion[curIndex-1]['SURVEY_NO'], temp, 0)
                .then((response) => {
                    this.setState({loaded: true});
                })
                .catch((error) => {
                    this.setState({loaded: true});
                    showToast();
                }); 
            }
        }else if(this.state.answerType == 3 || this.state.answerType == 4){
            var temp = -1;
            for(var i = 0;i<this.state.surveyOptions.length;i++){
                if(this.state.surveyOptions[i]['textValue'] != '' && this.state.surveyOptions[i]['textValue'] != null){
                    temp = i;
                    break;
                }
            }
            if(this.state.isRequired == 1 && temp == -1){
                showToast('必須入力です');
                is_required = 1;
            } else if(temp != -1){
                for(var i = 0;i<this.state.surveyOptions.length;i++){
                    await addOptionAnswer(this.state.user_id,this.state.surveyQuestion[curIndex-1]['ID'], this.state.surveyQuestion[curIndex-1]['SURVEY_NO'], this.state.surveyOptions[i]['textValue'], this.state.surveyOptions[i]['value'], this.state.answerType)
                    .then((response) => {
                        this.setState({loaded: true});
                    })
                    .catch((error) => {
                        this.setState({loaded: true});
                        showToast();
                    }); 
                }
                
            }
        }
        if(curIndex + 1 > this.state.totalCnt){
            Actions.reset("home");
        }
        else if(is_required == 0){
            /*this.setState({answerType : this.state.surveyQuestion[curIndex]['ANSWER_TYPE']})
            await this.getSurveyOptions(this.state.surveyQuestion[curIndex]['ID'], this.state.surveyQuestion[curIndex]['SURVEY_NO'])
            this.setState({isRequired : this.state.surveyQuestion[curIndex]['INPUT_TYPE']})
            this.setState({curProgress : (curIndex+1)/this.state.totalCnt})
            this.setState({curNo : curIndex + 1})*/
            Actions.push('surveyquestion', { id: this.props.id, title: this.props.title, surveyno: this.state.surveyQuestion[curIndex]['SURVEY_NO']});
        }
        
    }

    multichecked(index){
        var temp = this.state.surveyOptions;
        temp[index]['checked'] = !temp[index]['checked'];
        this.setState({surveyOptions: temp})
    }

    changeText(index, value){
        var temp = this.state.surveyOptions;
        temp[index]['textValue'] = value;
        this.setState({surveyOptions: temp})
    }

    renderOptions(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        if(this.state.answerType == 1){
            return <View>
                <RadioForm
                    formHorizontal={false}
                    animation={true}
                >
                    {
                        this.state.surveyOptions.map((obj, i) => (
                        <RadioButton labelHorizontal={true} key={i} style={this.state.checked == i ? {borderWidth: 1, borderRadius: 8, borderColor: '#2196f3'} : {borderWidth: 1, borderRadius: 8, borderColor: '#cecece'}}>
                            
                            <RadioButtonInput
                            obj={obj}
                            index={i}
                            isSelected={this.state.checked === i}
                            onPress = { (value) => { this.setState({checked : i})}}
                            borderWidth={1}
                            buttonInnerColor={'#2196f3'}
                            buttonOuterColor={this.state.checked === i ? '#2196f3' : '#585858'}
                            buttonSize={15}
                            buttonOuterSize={30}
                            buttonStyle={{}}
                            buttonWrapStyle={{margin: 10}}
                            />
                            <RadioButtonLabel
                            obj={obj}
                            index={i}
                            labelHorizontal={true}
                            onPress = { (value) => { this.setState({checked : i})}}
                            labelStyle={{fontSize: 20, color: '#353131'}}
                            labelWrapStyle={{}}
                            />
                        </RadioButton>
                        ))
                    }  
                </RadioForm>
            </View>
        } else if(this.state.answerType == 2){
            return <View>
                {
                    this.state.surveyOptions.map((obj, i) => (
                        <TouchableOpacity style={obj.checked ? [styles.item, {borderColor: '#2196f3'}] : [styles.item]}  onPress={()=>this.multichecked(i)}>
                            <CheckBox checked={obj.checked} color="#2196f3" uncheckedColor="#585858" size={30}/>
                            <PowerTranslator style={{...styles.checkBoxTxt,color:obj.checked?"#353131":"gray",fontSize: 20}} text={obj.label}/>
                        </TouchableOpacity>
                    ))
                }
            </View>
        } else if(this.state.answerType == 3){
            return <View>
                {
                    this.state.surveyOptions.map((obj, i) => (
                        <View style={styles.textItem}>
                            <PowerTranslator style={{ color:"gray",fontSize: 20}} text={obj.label} />
                            <TextInput 
                                returnKeyType="next"
                                autoCapitalize="none"
                                style={styles.input} 
                                onChangeText={(value)=>{ this.changeText(i, value)}}
                                
                            />
                        </View>
                    ))
                }
            </View>
        }else if(this.state.answerType == 4){
            return <View>
                {
                    this.state.surveyOptions.map((obj, i) => (
                        <View style={styles.textItem}>
                            <PowerTranslator style={{ color:"gray",fontSize: 20}} text={obj.label} />
                            <TextInput 
                                returnKeyType="next"
                                autoCapitalize="none"
                                style={styles.input} 
                                multiline
                                numberOfLines={5}
                                onChangeText={(value)=>{ this.changeText(i, value)}}
                                
                            />
                        </View>
                    ))
                }
            </View>
        }
    }
    
    render(){
        
        return (
            <ScrollView style={{backgroundColor: '#eee'}} 
                ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight)=>{        
                    this.scrollView.scrollTo({x: 0, y: 0, animated: true});
                }}>
                <View style={styles.container}>
                    {
                        this.state.surveyQuestion != null ?
                        <View style={{width: '100%'}}>
                            <View style={{paddingLeft: 15, paddingVertical: 15}}>
                                <PowerTranslator style={{ fontWeight: 'bold'}} text={this.state.surveyQuestion[this.props.surveyno-1]['QUESTION']} />
                            </View>
                            { 
                                this.state.surveyOptions != null?
                                this.renderOptions()
                                :
                                null
                            }
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20}}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{backgroundColor: '#bcbcbc', padding: 15}}>
                                    <PowerTranslator style={{color: 'white'}} text={'戻る'} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.nextOption()} style={{backgroundColor: '#09888e', padding: 15}}>
                                    <PowerTranslator style={{color: 'white'}} text={'次へ'} />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={{paddingLeft: 15, paddingBottom: 5, fontSize: 17}}>{this.props.surveyno} / {this.state.totalCnt}</Text>
                            </View>
                            <View style={{marginBottom: 20}}>
                                <Progress.Bar progress={this.state.curProgress} width={Layout.window.width - 20} height={15} borderRadius={13} indeterminateAnimationDuration={3000}/>
                            </View>
                        </View>
                        :
                        null
                    }
                    
                    
                </View>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />    
            </ScrollView>
        );
    }
    
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  item:{
    width:"100%",
    padding:10,
    borderRadius: 8, 
    borderColor: '#cecece',
    borderWidth: 1,
    marginBottom:10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  textItem:{
    width:"100%",
    padding:10,
    borderRadius: 8, 
    borderColor: '#cecece',
    borderWidth: 1,
    marginBottom:10,
    alignItems: 'flex-start',
  },
  checkBoxTxt:{
    marginLeft:20
  },  
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderColor: '#bcbcbc',
    borderWidth: 1,
    width: "100%"
  },
});
