import React, { useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';

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
    
    if (role == 'LOL') {
        return (
            <View>
                <ScrollView>
                <Text style={styles.Heading}>Welcome, LOL!</Text>
                <TouchableOpacity style={styles.button}
                    title="View Profile"
                >
                    <Text style={styles.text}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Guide"
                    onPress={() =>
                        navigation.navigate('LOL Guides')
                    }
                >
                    <Text style={styles.text}>My Guides</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Walking Tour"
                >
                    <Text style={styles.text}>My Walking Tours</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="Active Threads"
                >
                    <Text style={styles.text}>My Active Threads</Text>
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
    else if (role == 'Registered User') {
        return (
            <View>
                <Text style={styles.Heading}>Welcome, User!</Text>
                <TouchableOpacity style={styles.button}
                    title="View Profile"
                >
                    <Text style={styles.text}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Bookmarks')}
                    title="Saved"
                >
                    <Text style={styles.text}>Bookmarks</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Itinerary')}
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
                    title="My Bookings"
                >
                <Text style={styles.text}>My Bookings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    title="My Deals"
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
            </View>
        )
    }
    else {
        return (
            <View>
                <ScrollView>
                <Text style={styles.Heading}>Join Us Today!</Text>
                <Image
                style={styles.imagePlaceholder}
                source={require('../../../assets/RegistrationBanner.png')}
                />
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
                </ScrollView>
            </View>
        )
    }
}
