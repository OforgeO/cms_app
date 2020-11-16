import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Root } from "native-base";

import { Router, Scene, Stack} from 'react-native-router-flux';
//import {connect, Provider} from 'react-redux';
//import store from './constants/Store.js';
import useLinking from './navigation/useLinking';

import Home from './screens/Home';
import Login from './screens/Login';
import Forgot from './screens/Forgot';
import Profile from './screens/Profile';
import Privacy from './screens/Privacy';
import Bottom from './screens/Bottom';
import Stamp from './screens/Stamp';
import Coupon from './screens/Coupon';
import Catalogue from './screens/Catalogue';
import Gallery from './screens/Gallery';
import Photo from './screens/Photo';
import PdfViewer from './screens/PdfViewer';
import Video from './screens/Video';
import InformationMenu from './screens/InformationMenu';
import News from './screens/News';
import NewsDetail from './components/NewsDetail';
import Reservation from './screens/Reservation';
import WebviewList from './screens/WebviewList';
import WebviewLink from './components/WebviewLink';
import ShowDetails from './components/ShowDetails';
import Staff from './screens/Staff';
import StaffView from './components/StaffView';
import AddReservation from './components/AddReservation';
import ReservationDetail from './components/ReservationDetails';
import StampList from './components/StampList';
import CouponList from './components/CouponList';
import TimeBook from './components/TimeBook';
import TimedetailsBook from './components/TimedetailsBook';
import ConfirmBook from './components/ConfirmBook';
import ChooseAssign from './components/ChooseAssign';
import QRScan from './components/QRScan';
import QuestionForm from './screens/QuestionForm';
import FreecontentList from './components/FreecontentList';
import Freecontent from './screens/Freecontent';
import MaincontentList from './components/MaincontentList';
import Maincontent from './screens/Maincontent';
import PostcontentList from './components/PostcontentList';
import Postcontent from './screens/Postcontent';
import Signup from './screens/Signup';
import SurveyList from './components/SurveyList';
import SurveyDetail from './screens/SurveyDetail';
import SurveyQuestion from './components/SurveyQuestion';
import PanelMenu from './components/PanelMenu';
import Template from './components/Template';
import Initial from './screens/Initial';
import Social from './screens/Social';
console.disableYellowBox = true;

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <Root>
          <Router>
            
              <Stack>
                <Scene key="profile" component={Profile} />
                <Scene key="home" component={Home} />
                <Scene key="forgot" component={Forgot} />
                <Scene key="bottom" component={Bottom} />
                <Scene key="privacy" component={Privacy} />
                <Scene key="stamp" component={Stamp} />
                <Scene key="coupon" component={Coupon} />
                <Scene key="catalogue" component={Catalogue} />
                <Scene key="gallery" component={Gallery} />
                <Scene key="photo" component={Photo} />
                <Scene key="pdfviewer" component={PdfViewer} />
                <Scene key="video" component={Video} />
                <Scene key="informationmenu" component={InformationMenu} />
                <Scene key="news" component={News} />
                <Scene key="newsdetail" component={NewsDetail} />
                <Scene key="reservation" component={Reservation} />
                <Scene key="webviewlist" component={WebviewList} />
                <Scene key="webviewlink" component={WebviewLink} />
                <Scene key="showdetails" component={ShowDetails} />
                <Scene key="staff" component={Staff} />
                <Scene key="staffview" component={StaffView} />
                <Scene key="addreservation" component={AddReservation} />
                <Scene key="reservationdetail" component={ReservationDetail} />
                <Scene key="stamplist" component={StampList} />
                <Scene key="couponlist" component={CouponList} />
                <Scene key="timebook" component={TimeBook} />
                <Scene key="timedetailsbook" component={TimedetailsBook} />
                <Scene key="confirmbook" component={ConfirmBook} />
                <Scene key="chooseassign" component={ChooseAssign} />
                <Scene key="qrscan" component={QRScan} />
                <Scene key="questionform" component={QuestionForm} />
                <Scene key="freecontentlist" component={FreecontentList} />
                <Scene key="freecontent" component={Freecontent} />
                <Scene key="maincontentlist" component={MaincontentList} />
                <Scene key="maincontent" component={Maincontent} />
                <Scene key="postcontentlist" component={PostcontentList} />
                <Scene key="postcontent" component={Postcontent} />
                <Scene key="signup" component={Signup} />
                <Scene key="surveylist" component={SurveyList} />
                <Scene key="surveydetail" component={SurveyDetail} />
                <Scene key="surveyquestion" component={SurveyQuestion} />
                <Scene key="panelmenu" component={PanelMenu} />
                <Scene key="template" component={Template} />
                <Scene key="login" component={Login} />
                <Scene key="social" component={Social} />
                <Scene key="init" component={Initial} initial/>
              </Stack>
            
          </Router>
        </Root>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
