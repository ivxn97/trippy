import React, { useEffect, useState } from 'react'
import { Dimensions, Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet, Share } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import Carousel from 'react-native-reanimated-carousel';
import * as WebBrowser from 'expo-web-browser';
import {bookmark, itinerary} from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function WalkingTourScreen({ route, navigation }) {
    const { addedBy, name, location, tips, description, activityType, username } = route.params;
    const storage = getStorage();
    const width = Dimensions.get('window').width;
    const [images, setImages] = useState([]);
    const [email, setEmail] = useState('');
    const [registeredButton, setRegisteredButton] = useState(true);
    console.log(location)
    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setRegisteredButton(false);
                setEmail(email);
                console.log(email)
            }
            else {
                console.log("No Email Selected at Login")
                setRegisteredButton(true);
            }
        } catch (error) {
            console.log(error)
        }
    }
    const onReview = () => {
        navigation.navigate('Review Screen', {name, activityType});
    }

    useFocusEffect(React.useCallback(async ()=> {
        getEmail();
    }, []));

    useEffect(() => {
        const listRef = ref(storage, `walkingtours/${name.trimEnd()}/images`);
        Promise.all([
            listAll(listRef).then((res) => {
              const promises = res.items.map((folderRef) => {
                return getDownloadURL(folderRef).then((link) =>  {
                  return link;
                });
              });
              return Promise.all(promises);
            })
          ]).then((results) => {
            const fetchedImages = results[0];
            console.log(fetchedImages);
            setImages(fetchedImages);
          });
    }, [])

    const openAddress = async (mapURL) => {
        await WebBrowser.openBrowserAsync(mapURL)
    }

    const onShare = async () => {
        try {
            await Share.share({message:`Check out this amazing walking tour I found on TripAid!  
            Guide name: ${name} 
            Download the App here: URL`})
        }
        catch (error) {
            console.log(error);
        }
    }

    const onSave = () => {
        bookmark(email, name)
    }
  
    const onItinerary = () => {
        itinerary(email, name)
    }

    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.Heading}>{JSON.stringify(name).replace(/"/g,"")}</Text>
            <Carousel width={width}
                height={width / 2}
                mode="horizontal"
                data={images}
                renderItem={({ item }, index) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Image style={styles.carouselStyle} source={{uri: item}}/>
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>
                            {index}
                        </Text>
                    </View>
                )}
            />
            <View style={{ flexDirection:"row" }}>
                <TouchableOpacity style={[styles.buttonSmall, {opacity: registeredButton ? 0.3 : 1}]}
                disabled ={registeredButton} onPress={() => onSave()}>
                        <Text style={styles.buttonSmallText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonSmall, {opacity: registeredButton ? 0.3 : 1}]} 
                disabled ={registeredButton} onPress={() => onItinerary()}>
                        <Text style={styles.buttonSmallText}>Add To Itinerary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall}  onPress={() => onShare()}>
                        <Text style={styles.buttonSmallText}>Share</Text>
                </TouchableOpacity>
            </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom:5}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                <Text style={{textAlign: 'center', paddingHorizontal:8, fontWeight: 'bold'}}>Added By {username}</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                </View>
                <Text style={styles.textNB}>{JSON.stringify(description).replace(/"/g,"")}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom:5}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                <Text style={{textAlign: 'center', paddingHorizontal:8, fontWeight: 'bold'}}>Tips</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                </View>
                <Text style={styles.textNB}>{JSON.stringify(tips).replace(/"/g, "")}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom:5}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                <Text style={{textAlign: 'center', paddingHorizontal:8, fontWeight: 'bold'}}>Locations</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                </View>
                {location.map((item, index) => (
                <Text key={index} style={styles.textNB}>
                        <Text 
                        style={[styles.textNB, {color:'blue'}]} 
                        onPress={() => openAddress(item.mapURL)}>
                            {item.address.replace(/"/g,"")}
                        </Text>
                    </Text>
                ))}
                <Text>{'\n'}</Text>
            <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.buttonSmall} onPress={()=> onReview()}>
                        <Text style={styles.buttonSmallText}>Read Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('WT Map View', {location:location})}>
                        <Text style={styles.buttonSmallText}>Start Walk</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}