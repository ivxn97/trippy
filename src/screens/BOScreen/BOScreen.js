import React, { useEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';

export default function BOScreen ({navigation}) {
    const [email, setEmail] = useState('');
    const [businesses, setBusinesses] = useState();
    const [refresh, setRefresh] = useState();
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const [willRun, setWillRun] = useState(true)
    const [hotels, setHotels] = useState(false)
    const [attractions, setAttractions] = useState(false)
    const [restaurants, setRestaurants] = useState(false)
    const [paidTours, setPaidTours] = useState(false)


    const onSignout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            removeRole();
            removeEmail();
            navigation.reset({index: 0, routes: [{name: 'Home'}]})
            alert("Successfully Logged out")
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode + ': ' + errorMessage)
         });
    }

    const removeRole = async () => {
        try {
            const role = await AsyncStorage.removeItem('role');
            setRole('');
            return true;
        } catch (error) {
            return false
        }
    }

    const removeEmail = async () => {
        try {
            const email = await AsyncStorage.removeItem('email');
            return true;
        } catch (error) {
            return false
        }
    }

    const getBusinesses = async () => {
        try {
            const business = await AsyncStorage.getItem('businesses');
            if (business !== null) {
                setBusinesses(JSON.parse(business));
                const businesses = JSON.parse(business)
                businesses.map((item, index) => {
                    if (item.value == "Hotels" && item.isChecked == true) {
                        setHotels(true);
                    }
                
                    if (item.value == "Restaurants" && item.isChecked == true) {
                        setRestaurants(true);
                    }
                
                    if (item.value == "Attractions" && item.isChecked == true) {
                        setAttractions(true);
                    }
                
                    if (item.value == "Paid Tours" && item.isChecked == true) {
                        setPaidTours(true);
                    }
            });
                setWillRun(false)
                setLoading(false)
            }
            else {
                console.log("No business in DB")
            }
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        if (willRun) {
            getBusinesses();
            console.log("Businesses", businesses)

        }
    },[businesses])

    if (loading) {
        return <ActivityIndicator />
    }

    return (
        <View>
            <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>
                <Text style={styles.Heading}>Welcome, Business Owner!</Text>
                <TouchableOpacity style={styles.button}
                    title="View Profile"
                >
                    <Text style={styles.text}>View Profile</Text>
                </TouchableOpacity>

                {paidTours ? (
                <TouchableOpacity style={styles.button}
                    title="Tours"
                    onPress={() =>navigation.navigate("BO Paid Tours List")}>
                    <Text style={styles.text}>My Tours</Text>
                </TouchableOpacity>
                ) : null}
                {hotels ? (
                    <TouchableOpacity style={styles.button}
                    title="Hotels"
                    onPress={() =>navigation.navigate("BO Hotels List")}
                    >
                    <Text style={styles.text}>My Hotels</Text>
                    </TouchableOpacity>
                ) : null}
                {attractions ? (
                    <TouchableOpacity style={styles.button}
                    title="Attractions" 
                    onPress={() => navigation.navigate("BO Attractions List")}
                        >
                    <Text style={styles.text}>My Attractions</Text>
                    </TouchableOpacity>
                ) : null}
                {restaurants ? (
                    <TouchableOpacity style={styles.button}
                    title="Restaurants"
                    onPress={() =>navigation.navigate("BO Restaurants List")}
                    >
                    <Text style={styles.text}>My Restaurants</Text>
                    </TouchableOpacity>
                ) : null}

                <TouchableOpacity style={styles.button}
                    title="Deals"
                    onPress={() =>navigation.navigate("BO Deals List")}
                >
                    <Text style={styles.text}>My Deals</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Settings"
                >
                    <Text style={styles.text}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title ="Sign Out"
                    onPress={() => onSignout()}
                >
                    <Text style={styles.text}>Sign Out</Text>
                </TouchableOpacity>
                </ScrollView>
            </View>
    )
    
}

