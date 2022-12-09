import React, { useState } from 'react'
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import styles from './styles';

export default function ProfileScreen ( {navigation} ) {
    const [role, setRole] = useState('');
    const [refresh, setRefresh] = useState();
    const auth = getAuth();

    
    const onSignout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            removeRole();
            removeEmail();
            navigation.navigate('Profile Page');
            alert("Successfully Logged out")
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode + ': ' + errorMessage)
         });
    }

    /*
    onAuthStateChanged(auth, (user) => {
    if (user) {
            
    } else {
        navigation.navigate('Login')
    }
    
    }); */

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
    
    const getRole = async () => {
        try {
            const role = await AsyncStorage.getItem('role');
            if (role !== null) {
                setRole(role);
                console.log(role)
            }
            else {
                console.log("No Role Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useFocusEffect(React.useCallback(() => 
    {
        getRole();
        console.log("Current Role:", role)
    },[role]));
    
    if (role == 'Admin') {
        return(
            <View>
                <Text style={styles.Heading}>Welcome, Admin!</Text>
                <TouchableOpacity
                    title ="Login"
                    style={styles.button}
                    onPress={() =>
                        navigation.navigate('Login')
                    }
                >
                    <Text style={styles.text}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Add Hotel"
                    onPress={() =>
                        navigation.navigate('Add Hotel')
                    }
                >
                    <Text style={styles.text}>Add Hotel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                title ="Add Attraction"
                onPress={() =>
                    navigation.navigate('Add Attraction')
                }
                >
                    <Text style={styles.text}>Add Attraction</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title ="Add Paid Tour"
                    onPress={() =>
                        navigation.navigate('Add Paid Tour')
                    }
                >
                    <Text style={styles.text}>Add Paid Tour</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title ="Add Restaurant"
                    onPress={() =>
                        navigation.navigate('Add Restaurant')
                    }
                >
                    <Text style={styles.text}>Add Restaurant</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={styles.button}
                    title ="Add Deal"
                    onPress={() =>
                        navigation.navigate('Add Deal')
                    }
                >
                    <Text style={styles.text}>Add Deal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title ="Add Deal"
                    onPress={() =>
                        navigation.navigate('Add Guide')
                    }
                >
                    <Text style={styles.text}>Add Guide</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title ="Register"
                    onPress={() =>
                        navigation.navigate('Registration Selector')
                    }
                >
                    <Text style={styles.text}>Register</Text>
                </TouchableOpacity>
        
                <TouchableOpacity style={styles.button}
                    title ="Admin Page (TEST)"
                    onPress={() =>
                        navigation.navigate('Admin Page')
                    }
                >
                    <Text style={styles.text}>Admin Page</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title ="Sign Out"
                    onPress={() => onSignout()}
                >
                    <Text style={styles.text}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        )
    }
    else if (role == 'Business Owner') {
        return (
            <View>
                <Text style={styles.Heading}>Welcome, Business Owner!</Text>
                <TouchableOpacity style={styles.button}
                    title="View Profile"
                >
                    <Text style={styles.text}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Tour"
                >
                    <Text style={styles.text}>Tour</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Hotel"
                >
                    <Text style={styles.text}>Hotel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Attraction" 
                >
                    <Text style={styles.text}>Attraction</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Restaurant"
                >
                    <Text style={styles.text}>Restaurant</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Settings"
                >
                    <Text style={styles.text}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Add Hotel"
                    onPress={() =>
                        navigation.navigate('Add Hotel')
                    }
                >
                    <Text style={styles.text}>Add Hotel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                title ="Add Attraction"
                onPress={() =>
                    navigation.navigate('Add Attraction')
                }
                >
                    <Text style={styles.text}>Add Attraction</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title ="Add Paid Tour"
                    onPress={() =>
                        navigation.navigate('Add Paid Tour')
                    }
                >
                    <Text style={styles.text}>Add Paid Tour</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title ="Add Restaurant"
                    onPress={() =>
                        navigation.navigate('Add Restaurant')
                    }
                >
                    <Text style={styles.text}>Add Restaurant</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title ="Add Deal"
                    onPress={() =>
                        navigation.navigate('Add Deal')
                    }
                >
                    <Text style={styles.text}>Add Deal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title ="Sign Out"
                    onPress={() => onSignout()}
                >
                    <Text style={styles.text}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        )
    }
    else if (role == 'LOL') {
        return (
            <View>
                <Text style={styles.Heading}>Welcome, LOL!</Text>
                <TouchableOpacity style={styles.button}
                    title="View Profile"
                >
                    <Text style={styles.text}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Guide"
                >
                    <Text style={styles.text}>Guide</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title ="Add Guide"
                    onPress={() =>
                        navigation.navigate('Add Guide')
                    }
                >
                    <Text style={styles.text}>Add Guide</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Walking Tour"
                >
                    <Text style={styles.text}>Walking Tour</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Active Threads"
                >
                    <Text style={styles.text}>Active Threads</Text>
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
            </View>
        )
    }
    else if (role == 'Registered User') {
        return (
            <View>
                <Text style={styles.Heading}>Welcome, User!</Text>
                <TouchableOpacity style={styles.button}
                    title="View Profile"
                >
                    <Text style={styles.text}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Saved"
                >
                    <Text style={styles.text}>Saved</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Itinerary"
                >
                    <Text style={styles.text}>Itinerary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Active Threads"
                >
                    <Text style={styles.text}>Active Threads</Text>
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
            </View>
        )
    }
    else {
        return (
            <View>
                <Text style={styles.Heading}>Join Us Today!</Text>
                <TouchableOpacity style={styles.button}
                title ="Login"
                onPress={() =>
                    navigation.navigate('Login')
                }
                >
                    <Text style={styles.text}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title ="Register"
                    onPress={() =>
                        navigation.navigate('Registration Selector')
                    }
                >
                <Text style={styles.text}>Register</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
