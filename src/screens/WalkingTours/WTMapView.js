import React, {useState, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { mapsAPI } from '../../../config';
import styles from './styles';


export default function WTMapView({route, navigation}) {
    const {location} = route.params;
    const [currLocation, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [duration, setDuration] = useState('');
    const [distance, setDistance] = useState('');
    const [longitude, setLongitude] = useState()
    const [latitude, setLatitude] = useState()
    const mapRef = React.useRef();
    const origin = location.slice(0,1).map((loc) => {
        return loc.address;
    })
    const destination = location.slice(-1).map((loc) => {
        return loc.address;
    })

    const openAddress = async () => {
        const mapURL = location.slice(0,1).map((loc) => {
            return loc.mapURL;
        })
        await WebBrowser.openBrowserAsync(mapURL.join(""))
    }

    const mapViewWayPoints = location.slice(1, -1).map(item => item.address)

    const changeRegion = () => {
        const latitude = location.slice(0,1).map((loc) => {
            return loc.lat;
        })
        const longitude = location.slice(0,1).map((loc) => {
            return loc.long;
        })
        const latitudePOP = latitude.pop()
        const longitudePOP = longitude.pop()

        mapRef.current.animateToRegion({
            latitude: latitudePOP,
            longitude: longitudePOP,
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421
          })
          
    }

    useEffect(() => {
        (async () => {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low})
          setLocation(location);

          if (location) {
            const interval = setInterval(() => {
                setLoading(false)
            }, 2000);
            return () => clearInterval(interval)
        }
        })();
    }, []);

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View style={styles.container}>
          <MapView style={styles.map} 
          ref={mapRef}
          showsUserLocation={true}
          initialRegion={{latitude: currLocation.coords.latitude, longitude: currLocation.coords.longitude, 
            latitudeDelta: 0.0421, longitudeDelta: 0.0421,}}
          >
            {location.map((marker, index) => (
                <Marker
                    key={index}
                    coordinate={{latitude: marker.lat, longitude: marker.long}}
                    title={marker.address}
                    //onPress={() => openAddress(marker.mapURL)}
                />
            ))}
            <MapViewDirections 
                origin={origin}
                destination={destination}
                waypoints={(location.length > 2) ? mapViewWayPoints : undefined}
                apikey={mapsAPI}
                strokeColor="red"
                strokeWidth={3}
                mode="WALKING"
                onReady={result => {
                    console.log(result.duration, result.distance)
                    setDuration(result.duration);
                    setDistance(result.distance);
                }}
            />
          </MapView>
          <Text style={[styles.Heading, {fontSize:24}]}>Duration: {Number(duration).toFixed(0)} mins, Distance: {Number(distance).toFixed(2)}km</Text>
          <View style={{ flexDirection:"row" }}>
          <TouchableOpacity
            onPress={() => changeRegion()}
            style={[styles.buttonListLeft, {width:180, marginLeft:15, marginBottom:30}]}>
            <Text style={styles.buttonSmallText}>View Starting Point</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
            onPress={() => openAddress()}
            style={[styles.buttonListRight, {width:210, marginBottom:30}]}>
            <Text style={styles.buttonSmallText}>Directions To Starting Point</Text>
            </TouchableOpacity>
            </View>
        </View>
      );
}
