import {Toast} from 'native-base';
import Layout from '../constants/Layout';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import * as SecureStore from 'expo-secure-store';
export async function showToast(text = '', type = 'danger', position = 'bottom') {
    if(text == '')
        text = 'インターネット接続エラー！';
    let lang = await SecureStore.getItemAsync("language");
    if(lang == null)
        lang = 'auto';
    TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, lang);
    const translator = TranslatorFactory.createTranslator();
    translator.translate(text).then(translated => {
        Toast.show({
            text: translated,
            type: type,
            textStyle: {textAlign: 'center'},
            position: position,
            duration: 4000,
        });    
    });
    
}

