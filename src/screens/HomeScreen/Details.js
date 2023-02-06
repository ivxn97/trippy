import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, Text, TextInput, TouchableOpacity, View, ScrollView, 
    StyleSheet, Share, Linking } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import Carousel from 'react-native-reanimated-carousel';
import * as WebBrowser from 'expo-web-browser';
import {bookmark, itinerary} from '../commonFunctions';
import ReviewScreen from '../ReviewScreen/ReviewScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { set } from 'react-native-reanimated';

export default function Details({route, navigation}) {
    const {activityType, name, typeOfCuisine, price, ageGroup, groupSize, openingTime, closingTime, language, 
        description, TNC, tourType, startingTime, endingTime, duration, hotelClass, roomTypes, 
        checkInTime, checkOutTime, amenities, roomFeatures, mrt, tips, attractionType, location, review, 
        addedBy, timeSlots, mapURL, capacity, address, images} = route.params;
        
    const [loading, setLoading] = useState(true);
    //Restaurants only 
    const [menu, setMenu] = useState([]);

    const storage = getStorage();
    const width = Dimensions.get('window').width;
    const [email, setEmail] = useState('');
    const [registeredButton, setRegisteredButton] = useState(true);

    //Hotels only
    const [valueRoomTypes, setValueRoomTypes] = useState();
    const [valueAmenities, setValueAmenities] = useState();
    const [valueRoomFeatures, setValueRoomFeatures] = useState();

    const filterHotel = () => {
        if (activityType == 'hotels') {
        const filteredRoomTypes = roomTypes.filter(item => item.isChecked === true);
        const valueRoomTypes = filteredRoomTypes.map(item => item.value);

        const filterAmenities = amenities.filter(item => item.isChecked === true);
        const valueAmenities = filterAmenities.map(item => item.value);

        const filterRoomFeatures = roomFeatures.filter(item => item.isChecked === true);
        const valueRoomFeatures = filterRoomFeatures.map(item => item.value);

        setValueRoomTypes(valueRoomTypes);
        setValueAmenities(valueAmenities);
        setValueRoomFeatures(valueRoomFeatures);
        setLoading(false)
        }
        else {
            setLoading(false)
        }
    }

    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
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

    const getRole = async () => {
        try {
            const role = await AsyncStorage.getItem('role');
            if (role == "Business Owner" || role == "Admin" || role == null) {
                setRegisteredButton(true)
                console.log(role)
            }
            else if (role == "Registered User" || role == "LOL") {
                setRegisteredButton(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useFocusEffect(React.useCallback(async ()=> {
        getEmail();
        getRole();
    }, []));

    useEffect(() => {
        filterHotel();
    }, [])

    //Restaurants only
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

    const roomList = () => {
        return ( 
            <View>
                {
                roomTypes.map(item => {
                    <View key={item.type}>
                        <Text style={styles.text}>Room Type: {JSON.stringify(item.type).replace(/"/g, "")}</Text>
                        <Text style={styles.textNB}>Room Price: ${JSON.stringify(item.price).replace(/"/g, "")}</Text>
                    </View>
                })
                }
            </View>
        )
    }

    const onShare = async () => {
        try {
            await Share.share({message:`Check out this amazing ${activityType} I found on TripAid!  
${activityType} name: ${name} 
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

    const onReview = () => {
        navigation.navigate('Review Screen', {name, activityType});
    }

    const openAddress = async () => {
        await WebBrowser.openBrowserAsync(mapURL)
    }
      
    if (loading) {
        return <ActivityIndicator />;
    }

    if (activityType == 'restaurants') {
        
        return (
            <View style={styles.detailsContainer}>
            <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>
            <Text style={styles.Heading}>{JSON.stringify(name).replace(/"/g,"")}</Text>
            <Carousel width={width}
                height={width / 1.5}
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
            <Text style={styles.textNB}>Address: <Text style={[styles.textNB, {color:'blue'}]} onPress={() => openAddress()}>{JSON.stringify(address).replace(/"/g,"")}</Text></Text>
            <Text style={styles.textNB}>Operating Hours: {JSON.stringify(openingTime).replace(/"/g,"")} - {JSON.stringify(closingTime).replace(/"/g,"")}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom:5}}>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            <View>
            <Text style={{textAlign: 'center', paddingHorizontal:8, fontWeight: 'bold'}}>Description</Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            </View>
            <Text style={styles.textNB}>{JSON.stringify(description).replace(/"/g,"")}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom:5}}>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            <View>
            <Text style={{textAlign: 'center', paddingHorizontal:8, fontWeight: 'bold'}}>Details</Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            </View>
            <Text style={styles.textNB}>Type of Cuisine: {JSON.stringify(typeOfCuisine).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Age Group: {JSON.stringify(ageGroup).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Group Size: {JSON.stringify(groupSize).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Language: {JSON.stringify(language).replace(/"/g,"")}</Text>
            <Text style={styles.price}>{JSON.stringify(price).replace(/"/g, "")}</Text>
            <View style={{ flexDirection:"row" }}>
                <TouchableOpacity style={styles.buttonSmall} onPress={()=> getMenu()}>
                        <Text style={styles.buttonSmallText}>Menu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall} onPress={()=> onReview()}>
                        <Text style={styles.buttonSmallText}>Read Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonSmall, {opacity: registeredButton ? 0.3 : 1}]}
                disabled ={registeredButton} onPress={() => {navigation.navigate('Booking', {activityType: activityType, name: name})}} title="Booking">
                        <Text style={styles.buttonSmallText}>Book</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
        )
    }
    else if (activityType == 'paidtours') {
        return (
            <View style={styles.detailsContainer}>
            <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>
            <Text style={styles.Heading}>{JSON.stringify(name).replace(/"/g,"")}</Text>
            <Carousel width={width}
                height={width / 1.5}
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
            <Text style={styles.textNB}>Address: <Text style={[styles.textNB, {color:'blue'}]} onPress={() => openAddress()}>{JSON.stringify(address).replace(/"/g,"")}</Text></Text>
            <Text style={styles.textNB}>Operating Hours: {JSON.stringify(startingTime).replace(/"/g,"")} - {JSON.stringify(endingTime).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Duration: {JSON.stringify(duration).replace(/"/g,"")}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom:5}}>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            <View>
            <Text style={{textAlign: 'center', paddingHorizontal:8, fontWeight: 'bold'}}>Description</Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            </View>
            <Text style={styles.textNB}>{JSON.stringify(description).replace(/"/g,"")}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom:5}}>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            <View>
            <Text style={{textAlign: 'center', paddingHorizontal:8, fontWeight: 'bold'}}>Details</Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            </View>
            <Text style={styles.textNB}>Type: {JSON.stringify(tourType).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Age Group: {JSON.stringify(ageGroup).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Group Size: {JSON.stringify(groupSize).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Language: {JSON.stringify(language).replace(/"/g,"")}</Text>
            <Text style={styles.price}>${JSON.stringify(price).replace(/"/g,"")}</Text>
            <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.buttonSmall} onPress={()=> onReview()}>
                        <Text style={styles.buttonSmallText}>Read Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonSmall, {opacity: registeredButton ? 0.3 : 1}]}
                disabled ={registeredButton} onPress={() => {navigation.navigate('Booking', {activityType: activityType, name: name, timeSlots: timeSlots, 
                        startingTime: startingTime, endingTime: endingTime, duration: duration, price: price, groupSize: groupSize, capacity: capacity})}} title="Booking" >
                        <Text style={styles.buttonSmallText}>Book</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.textNB}>Terms & Conditions: {JSON.stringify(TNC).replace(/"/g,"")}</Text>
            </ScrollView>
        </View>
        )
    }
    else if (activityType == 'hotels') {
        return (
            <View style={styles.detailsContainer}>
                <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>
                <Text style={styles.Heading}>{JSON.stringify(name).replace(/"/g,"")}</Text>
               <Carousel width={width}
                    height={width / 1.5}
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
                <Text style={styles.textNB}>Address: <Text style={[styles.textNB, {color:'blue'}]} onPress={() => openAddress()}>{JSON.stringify(address).replace(/"/g,"")}</Text></Text>
                <Text style={styles.textNB}>Hotel Class: {JSON.stringify(hotelClass).replace(/"/g, "")}</Text>
                <Text style={styles.textNB}>Check-In Time: {JSON.stringify(checkInTime).replace(/"/g, "")}</Text>
                <Text style={styles.textNB}>Check-Out Time: {JSON.stringify(checkOutTime).replace(/"/g, "")}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom:5}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                <Text style={{textAlign: 'center', paddingHorizontal:8, fontWeight: 'bold'}}>Description</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                </View>
                <Text style={styles.textNB}>{JSON.stringify(description).replace(/"/g,"")}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom:5}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                <Text style={{textAlign: 'center', paddingHorizontal:8, fontWeight: 'bold'}}>Amenities</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                </View>
                <Text style={styles.textNB}>{JSON.stringify(valueAmenities.join(' | ')).replace(/"/g, "")}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom:5}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                <Text style={{textAlign: 'center', paddingHorizontal:8, fontWeight: 'bold'}}>Room Features</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                </View>
                <Text style={styles.textNB}>{JSON.stringify(valueRoomFeatures.join(' | ')).replace(/"/g, "")}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom:5}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                <Text style={{textAlign: 'center', paddingHorizontal:8, fontWeight: 'bold'}}>Room Types</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                </View>
                {
                roomTypes.map(item => {
                    return(
                    <View key={item.type} style={{flexDirection: "column", flex: 1}}>
                        <Text style={[styles.text, {fontSize:18}]}>{JSON.stringify(item.type).replace(/"/g, "")}</Text>
                        <Text style={[styles.textNB, {marginLeft: 8}]}>Room Price: ${JSON.stringify(item.price).replace(/"/g, "")}</Text>
                    </View>
                    )
                })
                }
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom:5}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                <Text style={{textAlign: 'center', paddingHorizontal:8, fontWeight: 'bold'}}>Additional Info</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                </View>
                <Text style={styles.textNB}>Language: {JSON.stringify(language).replace(/"/g, "")}</Text>
                <Text style={styles.textNB}>Terms & Conditions: {JSON.stringify(TNC).replace(/"/g, "")}{"\n"}</Text>
                <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.buttonSmall} onPress={()=> onReview()}>
                        <Text style={styles.buttonSmallText}>Read Reviews</Text>
                </TouchableOpacity>
                </View>
                <Text>{"\n"}{"\n"}</Text>
                </ScrollView>
                <TouchableOpacity style={[styles.buttonBook, {opacity: registeredButton ? 0 : 1, position: 'absolute', bottom:0}]}
                disabled ={registeredButton} onPress={() => {navigation.navigate('Booking', {activityType: activityType, name: name, 
                roomTypes: roomTypes, checkInTime: checkInTime, checkOutTime: checkOutTime})}} title="Booking">
                        <Text style={[styles.textNB, {fontWeight:'bold'}]}>Book</Text>
                </TouchableOpacity>
            </View>
        )
    }
    else if (activityType == 'attractions') {
        return (
            <View style={styles.detailsContainer}>
                <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>
                <Text style={styles.Heading}>{JSON.stringify(name).replace(/"/g,"")}</Text>
                <Carousel width={width}
                    height={width / 1.5}
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
                <Text style={styles.textNB}>Address: <Text style={[styles.textNB, {color:'blue'}]} onPress={() => openAddress()}>{JSON.stringify(address).replace(/"/g,"")}</Text></Text>
                <Text style={styles.textNB}>Operating Hours: {JSON.stringify(openingTime).replace(/"/g,"")} - {JSON.stringify(closingTime).replace(/"/g,"")}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom:5}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                <Text style={{textAlign: 'center', paddingHorizontal:8, fontWeight: 'bold'}}>Description</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                </View>
                <Text style={styles.textNB}>{JSON.stringify(description).replace(/"/g,"")}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom:5}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                <Text style={{textAlign: 'center', paddingHorizontal:8, fontWeight: 'bold'}}>Details</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                </View>
                <Text style={styles.textNB}>Type: {JSON.stringify(attractionType).replace(/"/g,"")}</Text>
                <Text style={styles.textNB}>Age Group: {JSON.stringify(ageGroup).replace(/"/g,"")}</Text>
                <Text style={styles.textNB}>Group Size: {JSON.stringify(groupSize).replace(/"/g,"")}</Text>
                <Text style={styles.textNB}>Language: {JSON.stringify(language).replace(/"/g,"")}</Text>
                <Text style={styles.price}>${JSON.stringify(price).replace(/"/g,"")}</Text>
                <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
                    <TouchableOpacity style={styles.buttonSmall} onPress={()=> onReview()}>
                            <Text style={styles.buttonSmallText}>Read Reviews</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonSmall, {opacity: registeredButton ? 0.3 : 1}]}
                    disabled ={registeredButton} onPress={() => {navigation.navigate('Booking', {activityType: activityType, name: name})}} title="Booking">
                            <Text style={styles.buttonSmallText}>Book</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.textNB}>Terms & Conditions: {JSON.stringify(TNC).replace(/"/g,"")}</Text>
                </ScrollView>
            </View>
        )
    }
}
