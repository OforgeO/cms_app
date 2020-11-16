import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import Shop from '../screens/Shop';
import { Image} from 'react-native';
import Layout from '../constants/Layout';
import PanelMenu from '../components/PanelMenu';
import { getFooterMenu } from '../constants/Api'
import CouponList from '../components/CouponList';
import Video from '../screens/Video';
import StampList from '../components/StampList';
import Catalogue from '../screens/Catalogue';
import Reservation from '../screens/Reservation';
import WebviewLink from '../components/WebviewLink';
import FreecontentList from '../components/FreecontentList';
import MaincontentList from '../components/MaincontentList';
import Maincontent from '../screens/Maincontent';
import PostcontentList from '../components/PostcontentList';
import SurveyList from '../components/SurveyList';
import WebviewList from '../screens/WebviewList';
import Social from '../screens/Social';
import Freecontent from '../screens/Freecontent';
const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default class BottomTabNavigator extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      footerMenu: []
    }
  }

  async componentDidMount(){
    await getFooterMenu()
    .then((response) => {
        if(response.data == false || response.data.length == 0){
            return;
        }else{
          
            this.setState({footerMenu : response.data})
        }
    })
    .catch((error) => {
    });
  }

  renderBottomMenu(){
    return this.state.footerMenu.map((footer) => {
      let footerComponent = Shop;
      if(footer.MENU_TYPE == 2 && footer.TYPE == 0 || footer.TYPE == 3)
        footerComponent = CouponList;
      else if(footer.TYPE == 6 && footer.SUBTYPE == 11)
        footerComponent = WebviewList;
      else if(footer.TYPE == 6 && footer.SUBTYPE == 10)
        footerComponent = Social;
      else if(footer.MENU_TYPE == 3 && footer.TYPE == 0)
        footerComponent = CouponList;
      else if(footer.TYPE == 8 || footer.MENU_TYPE == 9 && footer.TYPE == 0)
        footerComponent = CouponList;
      else if(footer.MENU_TYPE == 4 && footer.TYPE == 0 || footer.TYPE == 2)
        footerComponent = Video;
      else if(footer.MENU_TYPE == 5 && footer.TYPE == 0 || footer.TYPE == 5)
        footerComponent = StampList;
      else if(footer.MENU_TYPE == 6 && footer.TYPE == 0)
        footerComponent = Catalogue;
      else if(footer.MENU_TYPE == 7 && footer.TYPE == 0 || footer.TYPE == 9)
        footerComponent = Reservation;
      else if(footer.TYPE == 11 || footer.MENU_TYPE == 8)
        footerComponent = WebviewLink;
      else if(footer.TYPE == 1 && footer.SUBTYPE == 1)
        footerComponent = Catalogue;
      else if(footer.TYPE == 1 && footer.SUBTYPE == 2)
        footerComponent = Catalogue;
      else if(footer.TYPE == 7){
        footerComponent = Freecontent;
      }
      else if(footer.TYPE == 6 && footer.SUBTYPE > 0)
        footerComponent = Maincontent;
      else if(footer.TYPE == 4 && footer.SUBTYPE > 0){
        footerComponent = PostcontentList;
      }
      else if(footer.TYPE == 10)
        footerComponent = SurveyList;
      return <BottomTab.Screen
        name={footer.MENU_NAME+"-"+footer.SUBTYPE.toString()}
        key = { footer.SUBTYPE}
        component={footerComponent}
        options={{
          title: footer.MENU_NAME,
          tabBarIcon: ({ focused }) => <Image source={{uri: Layout.serverUrl + footer.FOOTER_IMAGE_ICON}} style={{width: 30, height: 30}} resizeMode="contain" />, 
        }}
      />
    })
  } 

  render(){
    
    return (

      <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME} tabBarOptions={{activeTintColor: 'black', inactiveTintColor: 'black'}}>
        {
          this.props.route.name == "5" ?
          <BottomTab.Screen
            name={this.props.route.name}
            component={PanelMenu}
            options={{
              title: 'ホーム',
              tabBarIcon: ({ focused }) => <TabBarIcon name={"home"} type={0} />, 
            }}
          />
          :
          <BottomTab.Screen
            name={this.props.route.name}
            component={Shop}
            options={{
              title: 'ホーム',
              tabBarIcon: ({ focused }) => <TabBarIcon name={"home"} type={0} />, 
            }}
          />
        }
        {
          this.state.footerMenu.length > 0 ?
          this.renderBottomMenu()
          :
          null
        }  
      </BottomTab.Navigator>
    );
  }
}