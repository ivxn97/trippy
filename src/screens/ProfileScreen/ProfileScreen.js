import React, { useState, useEffect} from 'react'
import { View, Text, button, TouchableOpacity, Image } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { db } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';

export default function ProfileScreen ( {navigation} ) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [items, setItems] = useState([]); 
    const auth = getAuth();
    const [user, setUser] = useState(null);

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
    

    const getUser = async () => {
        const q = query(collection(db, "users"), where("email", "==", email));
        
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(documentSnapshot => {
            items.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });
        setUser(items[0]);
    }

    useEffect(() => {
        getEmail()
        if(email){
            getUser()
        }

    }, [email]);
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
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('Profile', {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    country: user.country,})}
                    title="View Profile"
                >
                    <Text style={styles.textList}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList}
                    title="Guide"
                    onPress={() =>
                        navigation.navigate('LOL Guides')
                    }
                >
                    <Text style={styles.textList}>My Guides</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('LOL Walking Tours')}
                    title="Walking Tour"
                >
                    <Text style={styles.textList}>My Walking Tours</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('Active Thread')}
                    title="Active Threads"
                >
                    <Text style={styles.textList}>My Active Threads</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('Bookmarks')}
                    title="Saved"
                >
                    <Text style={styles.textList}>Bookmarks</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('Itinerary')}
                    title="Itinerary"
                >
                    <Text style={styles.textList}>Itinerary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('Active Thread')}
                    title="Active Threads"
                >
                <Text style={styles.textList}>Active Threads</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('User Bookings')}
                    title="My Bookings"
                >
                <Text style={styles.textList}>My Bookings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('User Deals')}
                    title="My Deals"
                >
                    <Text style={styles.textList}>My Deals</Text> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList}
                    title="Settings"
                >
                    <Text style={styles.textList}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList}
                    title ="Sign Out"
                    onPress={() => onSignout()}
                >
                    <Text style={styles.textList}>Sign Out</Text>
                </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
    else if (role == 'Registered User') {
        return (
            <View>
                <ScrollView>
                <Text style={styles.Heading}>Welcome, User!</Text>
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('Profile', {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    country: user.country,})}
                    title="View Profile"
                >
                    <Text style={styles.textList}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('Bookmarks')}
                    title="Saved"
                >
                    <Text style={styles.textList}>Bookmarks</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('Itinerary')}
                    title="Itinerary"
                >
                    <Text style={styles.textList}>Itinerary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('Active Thread')}
                    title="Active Threads"
                >
                <Text style={styles.textList}>Active Threads</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('User Bookings')}
                    title="My Bookings"
                >
                <Text style={styles.textList}>My Bookings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('User Deals')}
                    title="My Deals"
                >
                    <Text style={styles.textList}>My Deals</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList}
                    title="Settings"
                >
                    <Text style={styles.textList}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList}
                    title ="Sign Out"
                    onPress={() => onSignout()}
                >
                    <Text style={styles.textList}>Sign Out</Text>
                </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
    else {
        return (
            <View>
                <ScrollView>
                <Text style={styles.Heading}>Join Us Today!</Text>
                <Image
                style={styles.imageBanner}
                source={require('../../../assets/RegistrationBanner.png')}
                />
                <TouchableOpacity style={styles.buttonList}
                title ="Login"
                onPress={() =>
                    navigation.navigate('Login')
                }
                >
                    <Text style={styles.textList}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonList}
                    title ="Register"
                    onPress={() =>
                        navigation.navigate('Registration Selector')
                    }
                >
                <Text style={styles.textList}>Register</Text>
                </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}
