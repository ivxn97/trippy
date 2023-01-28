import React, { useState, useEffect} from 'react'
import { View, Text, button, TouchableOpacity, Image } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { db } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import profileImage from './profile.jpeg';

export default function ProfileScreen ( {navigation} ) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [items, setItems] = useState([]); 
    const auth = getAuth();
    const [user, setUser] = useState(null); 
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

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
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(documentSnapshot => {
            items.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
            
        });
        setItems(items);
        setUser(items);
        setUsername(items[0].username);
        setBio(items[0].bio);
        setFirstName(items[0].firstName);
        setLastName(items[0].lastName);
        
        console.log("user: ", user);
    }
    
    
    useEffect(() => {
        getEmail()
        if (email) {
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
                
                <View style={styles.userBox}>
                    <Text style={{
                        fontSize: 30,
                        fontWeight: 'bold',
                        marginTop: 7,
                        marginBottom: 7,
                        marginLeft: 25,
                    }}>Welcome, User!
                    </Text>
                    <View style={styles.informationBox}>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <View style={styles.infoText}>
                                <View>
                                    <Image source={profileImage} style={styles.profileImage} />
                                    <Text
                                        style={{
                                            paddingVertical: 5,
                                            fontWeight: 'bold',
                                            marginLeft: 50,
                                            fontSize: 15
                                        }}>
                                        {username}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'center', flex: 1, marginTop: -50 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{"25"}</Text>
                                    <Text>Posts</Text>
                                </View>
                                <View style={{ alignItems: 'center', flex: 1, marginTop: -50 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{"36M"}</Text>
                                    <Text>Followers</Text>
                                </View>
                                <View style={{ alignItems: 'center', flex: 1, marginTop: -50 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{"35"}</Text>
                                    <Text>Following</Text>
                                </View>
                            </View>
                            <Text style={{ 
                                alignSelf: 'center', 
                                marginTop: -70, 
                                fontSize: 15, 
                                marginLeft: 115
                            }}>Role : {role}</Text>
                            <Text style={{
                                paddingVertical: 15,
                                marginTop: 15,
                                fontSize: 15,
                                marginLeft: 5,
                                marginRight: 5,
                            }}>{bio + "i am a user, i like to book hotels"}</Text>
                        </View>
                    </View>

                </View>
                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile', {
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    bio: bio,
                    email: email,
                    role: role,})}
                    title="View Profile"
                >
                        <Text style={styles.textList}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Bookmarks')}
                    title="Saved"
                >
                        <Text style={styles.textList}>Bookmarks</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Itinerary')}
                    title="Itinerary"
                >
                        <Text style={styles.textList}>Itinerary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Active Thread')}
                    title="Active Threads"
                >
                        <Text style={styles.textList}>Active Threads</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}
                    title="My Bookings"
                >
                        <Text style={styles.textList}>My Bookings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}
                    title="My Deals"
                >
                        <Text style={styles.textList}>My Deals</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}
                    title="Settings"
                >
                        <Text style={styles.textList}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}
                    title ="Sign Out"
                    onPress={() => onSignout()}
                >
                        <Text style={styles.textList}>Sign Out</Text>
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
