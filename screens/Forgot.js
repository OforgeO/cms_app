import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput} from 'react-native';

export default class Forgot extends React.Component {
    constructor(props){
        super(props);
        this.state = {       
            email: '',
        };
    }
    
    render(){
        return (
        
            <View style={styles.container}>
                <View>
                    <Text style={{fontSize: 18}}>メールアドレスを入力してください</Text>
                </View>
                <View style={{marginTop: 30}}>
                    <TextInput 
                        style={styles.editInput}
                        returnKeyType="next"
                        autoCapitalize="none"
                        keyboardType={'email-address'}
                        onChangeText={val=>this.setState({email : val})}
                        onSubmitEditing={() => console.log('Forgot')}
                    />
                </View>
                
                <TouchableOpacity onPress={() => {console.log('Forgot')}}>
                    <View style={styles.pwdBorder}>
                        <Text style={{color: 'white', fontSize: 20}}>送る</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    
}

Forgot.navigationOptions = {
    title: 'ID/バスワードをお忘れの方は',
    headerRight: <View></View>,
    headerTitleStyle: {
        textAlign: 'center',
        flexGrow:1,
        alignSelf:'center',
    },
    headerStyle: {
        backgroundColor: 'white',
    },
    headerTintColor: '#fff',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 20
  },
  pwdBorder: {
    borderRadius: 30,
    backgroundColor: '#343335',
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    textAlign: 'center'
  },
  editInput: {
    borderWidth: 1,
    borderColor:'#ccc',
    backgroundColor: 'white',
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 10,
    fontSize: 18,
    marginBottom: 10
  },
});
