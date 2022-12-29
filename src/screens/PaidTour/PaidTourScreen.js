import React, { useEffect, useState } from 'react'
import { Dimensions, Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet, Share } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import Carousel from 'react-native-reanimated-carousel';
import {bookmark, itinerary} from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function PaidTourScreen({route, navigation}) {
    const {title, tourType, price, ageGroup, groupSize, startingTime, endingTime, language, duration, description, TNC} = route.params;
    
    const [images, setImages] = useState([]);
    const storage = getStorage();
    const width = Dimensions.get('window').width;
    const [email, setEmail] = useState('');
    const [registeredButton, setRegisteredButton] = useState(true);

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

    useFocusEffect(React.useCallback(async ()=> {
        getEmail();
    }, []));

    useEffect(() => {
        const listRef = ref(storage, `paidtours/${title.trimEnd()}/images`);
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

    const onShare = async () => {
        try {
            await Share.share({message:`Check out this amazing tour I found on TripAid!  
Tour name: ${title} 
Download the App here: URL`})
        }
        catch (error) {
            console.log(error);
        }
    }

    const onSave = () => {
        bookmark(email, title)
      }
  
      const onItinerary = () => {
        itinerary(email, title)
      }


    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.Heading}>{JSON.stringify(title).replace(/"/g,"")}</Text>
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
                <TouchableOpacity style={styles.buttonSmall} onPress={() => onShare()}>
                        <Text style={styles.buttonSmallText}>Share</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.textNB}>Address: </Text>
            <Text style={styles.textNB}>Type: {JSON.stringify(tourType).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Age Group: {JSON.stringify(ageGroup).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Group Size: {JSON.stringify(groupSize).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Starting Time: {JSON.stringify(startingTime).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Ending Time: {JSON.stringify(endingTime).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Duration: {JSON.stringify(duration).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Language: {JSON.stringify(language).replace(/"/g,"")}{"\n"}</Text>
            <Text style={styles.textNB}>Description: {JSON.stringify(description).replace(/"/g,"")}{"\n"}</Text>
            <Text style={styles.textNB}>Terms & Conditions: {JSON.stringify(TNC).replace(/"/g,"")}</Text>
            <Text style={styles.price}>${JSON.stringify(price).replace(/"/g,"")}</Text>
            <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Read Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonSmall, {opacity: registeredButton ? 0.3 : 1}]}
                disabled ={registeredButton}>
                        <Text style={styles.buttonSmallText}>Book</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}