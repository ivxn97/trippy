import React, { useEffect, useState } from 'react'
import { Dimensions, Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet, Share } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import Carousel from 'react-native-reanimated-carousel';
import * as WebBrowser from 'expo-web-browser';

export default function RestaurantScreen({route, navigation}) {
    const {name, typeOfCuisine, price, ageGroup, groupSize, openingTime, closingTime, language, description, TNC} = route.params;
    
    const [images, setImages] = useState([]);
    const [menu, setMenu] = useState([]);
    const storage = getStorage();
    const width = Dimensions.get('window').width;

    useEffect(() => {
        const listRef = ref(storage, `restaurants/${name.trimEnd()}/images`);
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

    const getMenu = () => {
        const listRef = ref(storage, `restaurants/${name.trimEnd()}/menu`);
        Promise.all([
            listAll(listRef).then((res) => {
              const promises = res.items.map((folderRef) => {
                return getDownloadURL(folderRef).then((link) =>  {
                  return link;
                });
              });
              return Promise.all(promises);
            })
          ]).then(async (results) => {
            const fetchedMenu = results[0];
            const processedURL = fetchedMenu.toString()
            console.log(fetchedMenu);
            console.log(processedURL)
            setMenu(fetchedMenu);
            await WebBrowser.openBrowserAsync(processedURL);
        });
    }

    const onShare = async () => {
        try {
            await Share.share({message:`I have found this amazing restaurant called ${name}. Download the App here: URL`})
        }
        catch (error) {
            console.log(error);
        }
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
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Add To Itinerary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall} onPress={() => onShare()}>
                        <Text style={styles.buttonSmallText}>Share</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.textNB}>Address: </Text>
            <Text style={styles.textNB}>Type of Cuisine: {JSON.stringify(typeOfCuisine).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Age Group: {JSON.stringify(ageGroup).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Group Size: {JSON.stringify(groupSize).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Opening Time: {JSON.stringify(openingTime).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Closing Time: {JSON.stringify(closingTime).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Language: {JSON.stringify(language).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Description: {JSON.stringify(description).replace(/"/g,"")}{"\n"}</Text>
            <Text style={styles.textNB}>Terms & Conditions: {JSON.stringify(TNC).replace(/"/g,"")}</Text>
            <Text style={styles.price}>${JSON.stringify(price).replace(/"/g, "")}</Text>
            <View style={{ flexDirection:"row" }}>
                <TouchableOpacity style={styles.buttonSmall} onPress={()=> getMenu()}>
                        <Text style={styles.buttonSmallText}>Menu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Read Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Book</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}