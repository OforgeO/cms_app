import React from 'react';
import { StyleSheet, View} from 'react-native';
import { getPostCategory} from '../constants/Api';
import { showToast } from '../components/Global';
import Layout from '../constants/Layout';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Template from '../components/Template';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import * as SecureStore from 'expo-secure-store';
export default class Shop extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            routes: [],
            scenes: null,
            indexChange: 0,
            renderScene: null,
            loaded: true,
            posts: [],
            viewType: this.props.type,
            lang: 'auto'
        }
    }


    async componentDidMount(){
        let lang = await SecureStore.getItemAsync("language");
        if(lang == null)
            lang = 'auto';
        this.setState({lang: lang});
        if(this.state.viewType == undefined)
            this.setState({viewType : this.props.route.name});
        let type = await SecureStore.getItemAsync('all_app');
        
        if(this.state.viewType != 7 && this.state.viewType != 10 && this.state.viewType != 9){
            await getPostCategory(type)
            .then((response) => {
                if(response.data == false || response.data.length == 0){
                    return;
                }else{
                    this.setState({scenes : response.data})
                    var categoryList = [];
                    for(var i = 0;i<response.data.length;i++){
                        categoryList.push({
                            key: 'category'+i,
                            title: response.data[i]['TITLE']
                        });
                    }
                    this.setState({routes: categoryList})
                    this.getSceneMap();
                }
                
            })
            .catch((error) => {
                showToast();
            });
        }
    }

    getSceneMap() {
        let sceneMap = {}
        this.state.scenes.map((item, index) => {
          sceneMap['category'+index] = () => {
            return <Template style={styles.scene} key={item.ID} item={item} type={this.state.viewType} />
            //return FirstRoute
          }
        })
        
        this.setState({renderScene: SceneMap(sceneMap)})
    }
    
    
    render(){
        TranslatorConfiguration.setConfig(ProviderTypes.Google, Layout.googleTranslateApiKey, this.state.lang);
        const routes = this.state.routes;
        const index = this.state.indexChange;
        return (
            <View style={[styles.container]}>
                {
                    
                    routes.length > 0 && this.state.scenes != null && this.state.renderScene != null?
                    <TabView
                        navigationState={{ index, routes }}
                        renderTabBar={props =>
                            <TabBar 
                                {...props}
                                indicatorStyle={{backgroundColor: 'black'}}
                                scrollEnabled={true}
                                style={{ backgroundColor: 'white' }}
                                tabStyle={{ backgroundColor: 'white', marginBottom: 2, borderTopWidth: 1, borderTopColor: '#ececec'}}
                                renderLabel={({ route, focused, }) => (
                                    <PowerTranslator style={{ color: 'black', margin: 8 }} text={route.title} />
                                )}

                            />
                        }
                        renderScene={this.state.renderScene}
                        onIndexChange={(val) => this.setState({indexChange : val})}
                    />
                    :
                    null
                }
                {
                    this.state.viewType == 7 || this.state.viewType == 10 || this.state.viewType == 9?
                    <View style={{height: '100%'}}>
                        <Template style={styles.scene} type={this.state.viewType} />
                    </View>
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
    scene: {
      flex: 1,
    },
});