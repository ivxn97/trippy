import React, { useState, useEffect} from 'react'
import { View, Text, button, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { db } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';

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
    const [interests, setInterests] = useState()
    const storage = getStorage();
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState();
    const [thread, setThread] = useState([])
    const [threadLength, setThreadLength] = useState();

    // Get threads created by the user, used for counting the amount of threads made 
    const getThreads = async(username) => {
        const q = query(collection(db, "forum"), where("addedBy", "==", username));
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(documentSnapshot => {
            thread.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });
        setThreadLength(thread.length);
        setLoading(false);
    }

    // Get User's Email from Async Storage
    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setEmail(email);
                console.log("Email: ", email)
            }
            else {
                console.log("No Email Selected at Login")
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Get User's information (Bio, username, First Name, Last Name, call getThreads)
    const getUser = async () => {
        console.log("Email here", email)
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
        console.log("ITEMS:", items)
        if (items.length === 0) {
            getUser();
        }
        else {
        setUsername(items[0].username);
        setBio(items[0].bio);
        setFirstName(items[0].firstName);
        setLastName(items[0].lastName);
        setInterests(items[0].interests)
        getThreads(items[0].username)
        setLoading(false)
        }
    }

    //Checks for Expiry of Bookings and Deals upon app launch. If current date is after the date in bookings/ deals, 
    // Set those bookings as expired, and remove the expired deals
    const changeExpiry = async (id) => {
        await setDoc(doc(db, "bookings", id), {
            expired: true
        }, {merge:true})
    }

    const changeDealExpiry = async (id) => {
        deleteDoc(doc(db, "deals", id))
    }

    const checkExpiry = async () => {
        const date = new Date()
        const querySnapshot = await getDocs(collection(db, "bookings"));
        querySnapshot.forEach(documentSnapshot => {
            if (date > documentSnapshot.data().date.toDate()) {
                changeExpiry(documentSnapshot.data().id)
            }
            else if (date > documentSnapshot.data().endDate.toDate()) {
                changeExpiry(documentSnapshot.data().id)
            }
         })
    }

    const checkDealExpiry = async () => {
        const date = new Date()
        const querySnapshot = await getDocs(collection(db, "deals"));
        querySnapshot.forEach(documentSnapshot => {
            if (date > documentSnapshot.data().expiry.toDate()) {
                changeDealExpiry(documentSnapshot.data().dealname)
            }
         })
    }
    
    // Check for Expiry and Get User's profile Photo from Firebase Storage
    useEffect(() => {
        checkExpiry();
        checkDealExpiry();
        if (email) {
            getUser()
            const listRef = ref(storage, `users/${email}/profile`);
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
                const fetchedString = fetchedImages[0]
                console.log(fetchedImages);
                setImages(fetchedString);
              });
        }
        
    }, [email]);

    // SignOut: Remove Role/ Email/ username from Async Storage 
    const onSignout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            removeRole();
            removeEmail();
            removeUsername();
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

    const removeUsername = async () => {
        try {
            const username = await AsyncStorage.removeItem('username');
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
        getEmail()
        getRole();
        console.log("Current Role:", role)
    },[role]));

    if (loading) {
        return <ActivityIndicator />;
    }
    
    if (role == 'LOL') {
        return (
            <View>
                <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>
                <Text style={styles.Heading}>Welcome, LOL!</Text>
                <TouchableOpacity style={styles.buttonList} onPress={() => navigation.navigate('Profile', {
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    bio: bio,
                    email: email,
                    role: role,
                    interests: interests})}
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
                <Text style={styles.textList}>My Active Threads</Text>
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
                        <View>
                            <View style={styles.infoText}>
                                <View>
                                    <Image source={{uri: images}} style={styles.profileImage} />
                                    <Text
                                        style={{
                                            paddingVertical: 5,
                                            fontWeight: 'bold',
                                            alignSelf: "center",
                                            fontSize: 15
                                        }}>
                                        {username}
                                    </Text>
                                </View>
                                <View style = {{flexDirection: "column"}}>
                                    <View style={{ flex: 1}}>
                                        <Text style={{   fontSize: 18, 
                                                        marginLeft: "20%", 
                                                        marginRight: "auto", 
                                                        marginTop: "auto", 
                                                        marginBottom: "3%"
                                                    }}>{threadLength} Threads</Text>
                                    </View>
                                    
                                    <Text style={{ 
                                        flex: 1,
                                        fontSize: 15,
                                        marginLeft: "20%"
                                        
                                    }}>Role : {role}</Text>
                                </View>
                            </View>

                            <Text style={{
                                fontSize: 15,
                                marginLeft: 5,
                                marginRight: 5,
                                marginBottom: 5,
                            }}>{bio}</Text>
                        </View> 
                    </View>

                </View>
                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile', {
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    bio: bio,
                    email: email,
                    role: role,
                    interests: interests})}
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
                        <Text style={styles.textList}>My Active Threads</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('User Bookings')}
                    title="My Bookings"
                >
                <Text style={styles.textList}>My Bookings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('User Deals')}
                    title="My Deals"
                >
                    <Text style={styles.textList}>My Deals</Text> 
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
                <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>
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
