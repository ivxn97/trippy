import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, QuerySnapshot, setDoc } from "firebase/firestore";
import { db } from '../../../config';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NestableDraggableFlatList, NestableScrollContainer, ScaleDecorator } from 'react-native-draggable-flatlist';

export default function Itinerary ( {navigation} ) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [email, setEmail] = useState();
    const [itineraryArr, setItineraryArr] = useState();
    const [finalArr, setFinalArr] = useState();
    const [restaurants, setRestaurants] = useState([]); // Initial empty array of restaurants
    const [hotels, setHotels] = useState([]);
    const [paidTours, setPaidTours] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [guides, setGuides] = useState([]);
    const [walkingTours, setWalkingTours] = useState([]);
    const [mergedArr, setMergedArr] = useState([]);
    const [completedArr, setCompletedArr] = useState([]);

    const [shouldRun, setShouldRun] = useState(true);

    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setEmail(email);
                console.log(email)
            }
            else {
                console.log("No Email Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getItinerary (email) {
        var loginRef = doc(db, "users", email);
        const docSnap = await getDoc(loginRef);

        if (docSnap.exists()) {
            //console.log("Document data: ", docSnap.data());
            const itineraryData = docSnap.data().itinerary
            console.log("Itinerary Data:", itineraryData);
            let finalArray = itineraryData.map((element, index) => {
                if(element.hasOwnProperty('position') && element.hasOwnProperty('name')) {
                    return element;
                } else {
                    return {
                        name: element,
                        position: index + 1
                    }
                }
            });
            console.log("initial arr:", itineraryData)
            console.log("final Array:", finalArray)
            setItineraryArr(itineraryData);
            setFinalArr(finalArray);

            setShouldRun(false);
        }
        else {
            console.log("Error", error)
        }
    }

    const getRestaurants = async () => {
        const collectionRef = collection(db, "restaurants")
        const q = query(collectionRef, where('name', 'in', itineraryArr));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            restaurants.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getHotels = async () => {
        const collectionRef = collection(db, "hotels")
        const q = query(collectionRef, where('name', 'in', itineraryArr));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            hotels.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getPaidTours = async () => {
        const collectionRef = collection(db, "paidtours")
        const q = query(collectionRef, where('name', 'in', itineraryArr));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            paidTours.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getAttractions = async () => {
        const collectionRef = collection(db, "attractions")
        const q = query(collectionRef, where('name', 'in', itineraryArr));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            attractions.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getGuides = async () => {
        const collectionRef = collection(db, "guides")
        const q = query(collectionRef, where('name', 'in', itineraryArr));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            guides.push({
                ...doc.data(),
                key: doc.id
            })
        })
        /*if (itineraryArr) {
            setLoading(false);
        }*/
    getMergeArr();
    }

    const getWalkingTours = async () => {
        const collectionRef = collection(db, "walkingtours")
        const q = query(collectionRef, where('name', 'in', itineraryArr));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            walkingTours.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getMergeArr = () => {
        mergedArr.push(...restaurants);
        mergedArr.push(...hotels);
        mergedArr.push(...paidTours);
        mergedArr.push(...attractions);
        mergedArr.push(...guides);
        mergedArr.push(...walkingTours);
        console.log("merged arr:", mergedArr)
        console.log("Final arr in merged arr:", finalArr)
        if (finalArr) {
        const completedArr = finalArr.map((item) => {
            const correspondingItem = mergedArr.find((i) => i.name === item.name);
            return {
                ...item,
                ...correspondingItem
            }
        })
        console.log("Completed Array:", completedArr)
        setCompletedArr(completedArr)
        }
        
        if (finalArr) {
            setLoading(false);
        }
    }

    const onSubmitPress = async () => {
        const submitList = completedArr.map(item => ({ name: item.name, position: item.position }))
        console.log("submitted list:", submitList)
        try {
            await setDoc(doc(db, "users", email), {
                itinerary: submitList
            }, {merge:true});
            //console.log("Document written with ID: ", docRef.id);
            navigation.navigate('Profile Page')
        }
        catch (e) {
            console.log("Error adding document: ", e);
        }
    }

    useFocusEffect(React.useCallback(() => {
        if (shouldRun) {
            getEmail();
            getItinerary(email);
            getRestaurants();
            getHotels();
            getPaidTours();
            getAttractions();
            getGuides();
            //getWalkingTours();
        }
    },[shouldRun, email, finalArr]))

    if (loading) {
        return <ActivityIndicator />;
    }
    
    const renderItem = ({ item, drag, isActive }) => {
        return (
          <ScaleDecorator>
            <TouchableOpacity
              activeOpacity={1}
              onLongPress={drag}
              disabled={isActive}
              style={styles.list}
              onPress={() => {
                navigation.navigate('Details', {
                    name: item.name, roomTypes: item.roomTypes,
                    priceRange: item.priceRange, hotelClass: item.hotelClass, checkInTime: item.checkInTime,
                    checkOutTime: item.checkOutTime, amenities: item.amenities, roomFeatures: item.roomFeatures, 
                    language: item.language, description: item.description, TNC: item.TNC, activityType: item.activityType, typeOfCuisine: item.typeOfCuisine, 
                    price: item.price, ageGroup: item.ageGroup, location: item.location, groupSize: item.groupSize, openingTime: item.openingTime,
                    closingTime: item.closingTime, menu: item.menu, attractionType: item.attractionType, tourType: item.tourType, 
                    startingTime: item.startingTime, endingTime: item.endingTime, duration: item.duration, mrt: item.mrt, tips: item.tips,
                })
                }}
            >
              <Text>{item.position}. {item.name}</Text>
            </TouchableOpacity>
          </ScaleDecorator>
        )
    };

    return (
    <NestableScrollContainer>
        <Text style={styles.HeadingList}>Itinerary</Text>
        <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.buttonListRight}>
            <Text style={styles.buttonSmallListText}>Remove</Text>
            </TouchableOpacity>
        </View>
        <NestableDraggableFlatList
            data={completedArr}
            renderItem={renderItem}
            onDragEnd={({data}) => setCompletedArr(data)}
            keyExtractor={(item) => item.position}
        />
        <TouchableOpacity
            style={styles.button}
            onPress={() => onSubmitPress()}>
            <Text style={styles.buttonTitle}>Save Changes</Text>
        </TouchableOpacity>
    </NestableScrollContainer>
    )
}