import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions,TextInput,Button } from 'react-native';
import {Card} from 'react-native-elements';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';


Geocoder.init(""); //<-- enter you google api key here

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
 
const GOOGLE_MAPS_APIKEY = ''; //<-- enter you google api key here


class MapScreen extends Component {

  constructor(props) {
    super(props);
    var f = props.navigation.state.params.from;
    var t = props.navigation.state.params.to;    
    
    this.state = {
      coordinates: [
        {
          latitude: 11.321947,
          longitude: 75.932971,
        },
        {
          latitude: 11.321154,
          longitude: 75.933937,
        },
      ],
    };
     
    this.mapView = null;
    console.log(this.state.coordinates[0].latitude)
    


    Geocoder.from(t)
    .then(json => {
        var Dlocation = json.results[0].geometry.location;
        var dlat = Dlocation.lat;
        var dlng = Dlocation.lng;
        // console.log(dlat);
        // console.log(dlng);
        // this.setState.coordinates[1]({latitude:dlat,longitude:dlng});
    })

    Geocoder.from(f)
    .then(json => {
        var Slocation = json.results[0].geometry.location;
        var slat = Slocation.lat;
        var slng = Slocation.lng;
        // console.log(slat);
        // console.log(slng);
        // this.setState.coordinates[0]({latitude:slat,longitude:slng});
    })
    
  }
  
  




 
  onMapPress = (e) => {
    this.setState({
      coordinates: [
        ...this.state.coordinates,
        e.nativeEvent.coordinate,
      ],
      
    });
  }

 
  render() {
    return (            
      <MapView
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        style={StyleSheet.absoluteFill}
        ref={c => this.mapView = c}
        // onPress={this.onMapPress}
      >
        {this.state.coordinates.map((coordinate, index) =>
          <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
        )}
        {(this.state.coordinates.length >= 2) && (
          <MapViewDirections
            origin={this.state.coordinates[0]}
            waypoints={this.state.coordinates.slice(1,-1)}
            destination={this.state.coordinates[this.state.coordinates.length-1]}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="hotpink"
            optimizeWaypoints={true}
            onStart={(params) => {
              console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            }}
            onReady={result => {
              console.log(`Distance: ${result.distance} km`)
              console.log(`Duration: ${result.duration} min.`)
 
              this.mapView.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: (width / 20),
                  bottom: (height / 20),
                  left: (width / 20),
                  top: (height / 20),
                }
              });
            }}
            onError={(errorMessage) => {
              // console.log('GOT AN ERROR');
            }}
          />
        )}
      </MapView>
    );
  }
}

 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default MapScreen;
