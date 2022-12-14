import React, { useEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';

export default function BOScreen ({navigation}) {
    const [email, setEmail] = useState('');
    const [businesses, setBusinesses] = useState('');
    const [refresh, setRefresh] = useState();
    const auth = getAuth();


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
/*
    const getBusinesses = async () => {
        try {
            const business = await AsyncStorage.getItem('businesses');
            if (business !== null) {
                setBusinesses(JSON.parse(business));
            }
            else {
                console.log("No business in DB")
            }
        } catch (error) {
            console.log(error)
        }
    }
    getBusinesses();


    /*useEffect(() => {
        console.log("Businesses", businesses)
    },[businesses])
    console.log(businesses)
    businesses.map((item, index) => {
        if (item.value == "Hotels" && item.isChecked == "true") {
            return (
                <View>
                    <TouchableOpacity style={styles.button}
                            title="Hotel"
                            >
                            <Text style={styles.text}>Hotel</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    
        if (item.value == "Restaurants" && item.isChecked == "true") {
            return (
                <View>
                    <TouchableOpacity style={styles.button}
                            title="Restaurants"
                            >
                            <Text style={styles.text}>Restaurants</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    
        if (item.value == "Attractions" && item.isChecked == "true") {
            return (
                <View>
                    <TouchableOpacity style={styles.button}
                            title="Attractions"
                            >
                            <Text style={styles.text}>Attractions</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    
        if (item.value == "Paid Tours" && item.isChecked == "true") {
            return (
                <View>
                    <TouchableOpacity style={styles.button}
                            title="Paid Tours"
                            >
                            <Text style={styles.text}>Paid Tours</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    });
    
    */

    return (
        <View>
            <ScrollView>
                <Text style={styles.Heading}>Welcome, Business Owner!</Text>
                <TouchableOpacity style={styles.button}
                    title="View Profile"
                >
                    <Text style={styles.text}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Tours"
                    onPress={() =>navigation.navigate("BO Paid Tours List")}
                >
                    <Text style={styles.text}>Tours</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Hotels"
                    onPress={() =>navigation.navigate("BO Hotels List")}
                >
                    <Text style={styles.text}>Hotels</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Attractions" 
                    onPress={() => navigation.navigate("BO Attractions List")}
                >
                    <Text style={styles.text}>Attractions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Restaurants"
                    onPress={() =>navigation.navigate("BO Restaurants List")}
                >
                    <Text style={styles.text}>Restaurants</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Deals"
                    onPress={() =>navigation.navigate("BO Deals List")}
                >
                    <Text style={styles.text}>Deals</Text>
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

