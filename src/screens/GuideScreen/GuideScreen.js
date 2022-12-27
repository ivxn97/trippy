import React, { useEffect, useState } from 'react'
import { Dimensions, Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet, Share } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import Carousel from 'react-native-reanimated-carousel';
import * as WebBrowser from 'expo-web-browser';

export default function GuideScreen({ route, navigation }) {
    const { title, location, mrt, tips, description } = route.params;
    const storage = getStorage();
    const width = Dimensions.get('window').width;
    const [images, setImages] = useState([]);

    useEffect(() => {
        const listRef = ref(storage, `guides/${title.trimEnd()}/images`);
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
            await Share.share({message:`I have found this amazing guide called ${title}. Download the App here: URL`})
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.Heading}>{JSON.stringify(title).replace(/"/g,"")}</Text>
            <View style={{ flexDirection:"row" }}>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Add To Itinerary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall}  onPress={() => onShare()}>
                        <Text style={styles.buttonSmallText}>Share</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.textNB}>Nearest MRT: {JSON.stringify(mrt).replace(/"/g, "")}</Text>
            <Text style={styles.textNB}>Locations: {JSON.stringify(location).replace(/"/g, "")}</Text>
            <Text style={styles.textNB}>tips: {JSON.stringify(tips).replace(/"/g, "")}</Text>
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
            <Text style={styles.textNB}>Description: {JSON.stringify(description).replace(/"/g,"")}{"\n"}</Text>
            <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Read Reviews</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}