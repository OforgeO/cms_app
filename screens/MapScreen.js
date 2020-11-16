import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';
import Layout from '../constants/Layout';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { getLatLng } from '../constants/Api';

export default class Shop extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          lat: 35.652832,
          lng: 139.839478,
          loaded: true,
          loadComplete : false
        }
    }

    async componentDidMount(){
      this.setState({loaded: false});
      await getLatLng()
      .then((response) => {
          this.setState({loaded: true});
          
          if(response.data == false){
              showToast();
              return;
          }else{
            if(response.data[0].LAT != '' && response.data[0].LAT != null && response.data[0].LNG != '' && response.data[0].LNG != null){
              this.setState({lat: parseFloat(response.data[0].LAT)})
              this.setState({lng: parseFloat(response.data[0].LNG)})
              this.setState({loadComplete: true}) 
              
            }else{
              this.setState({lat: 35.652832})
              this.setState({lng: 139.839478})
              this.setState({loadComplete: true}) 
              
            }
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
            {
              this.state.loadComplete == true ?
                <MapView style={styles.mapStyle} 
                  initialRegion={{
                    latitude: this.state.lat,
                    longitude: this.state.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}>
                  <MapView.Marker
                    coordinate={{latitude: this.state.lat, longitude: this.state.lng}}
                  />
                </MapView>
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
    mapStyle: {
      width: Layout.window.width,
      height: '100%'
    }
});