import React, { useEffect, useState, useRef } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { db } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationHelpersContext } from '@react-navigation/native';

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [businesses, setBusinesses] = useState('');
    const auth = getAuth();
    const didMount = useRef(false);

    const onFooterLinkPress = () => {
        navigation.navigate('Registration Selector')
    }

    async function getLogin (email) {
        var loginRef = doc(db, "users", email);
        const docSnap = await getDoc(loginRef);

        if (docSnap.exists()) {
            //console.log("Document data: ", docSnap.data());
            const roleData = docSnap.data().role
            setRole(roleData);
        }
        else {
            console.log("Error", error)
        }
    }

    const storeRole = async (role) => {
        try {
            await AsyncStorage.setItem('role', role)
            console.log('Successfully added role to ASync Storage with' , role)
        } catch (e) {
            console.log(e)
        }
    }

    const storeEmail = async (email) => {
        try {
            await AsyncStorage.setItem('email', email)
            console.log('Successfully added email to ASync Storage with' , email)
        } catch (e) {
            console.log(e)
        }
    }
    const storeUserName = async (userName) => {
        try {
            await AsyncStorage.setItem('userName', userName)
            console.log('Successfully added userName to ASync Storage with' , userName)
        } catch (e) {
            console.log(e)
        }
    }

    const storeBusinesses = async (businesses) => {
        try {
            await AsyncStorage.setItem('businesses', JSON.stringify(businesses))
            console.log('Successfully added businesses to ASync Storage with' , businesses)
        } catch (e) {
            console.log(e)
        }
    }
    /*
    const onLoginPress = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            getLogin(user.email);
            storeEmail(user.email);
            console.log('Logged in with: ', user.email);
            navigation.navigate('Profile Page');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode + ': ' + errorMessage)
        })
    }
    console.log('Role: ' + role)
    storeRole(role);
    */

    const onLoginPress = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            var loginRef = doc(db, "users", user.email);
            getDoc(loginRef).then( (docSnap) => {if (docSnap.exists()) {
                const roleData = docSnap.data().role
                const businessData = docSnap.data().businessesTypes
                const fullName = docSnap.data().firstName + ' ' + docSnap.data().lastName;
                setUserName(fullName);
                setRole(roleData);
                setBusinesses(businessData);
            }
            else {
                console.log("Error", error)
            }})
            //.then(storeEmail(user.email)).then(storeRole(role))

            console.log('Logged in with: ', user.email, "role:" , role);
            //navigation.navigate('Profile Page');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode + ': ' + errorMessage)
        })
    }

    useEffect(()=> {
        if ( !didMount.current ) {
            return() => { didMount.current = true;}
          }

        storeEmail(email);
        storeRole(role);
        storeBusinesses(businesses);
        storeUserName(userName);

        if (role == "Admin") {
            //navigation.navigate('Admin Stack');
            navigation.reset({index: 0, routes: [{name: 'Admin Stack'}]})
        }
        else if (role == "Business Owner") {
            console.log("email", email, "businesses", businesses)
            navigation.reset({index: 0, routes: [{name: 'BO Stack'}]})
        }
        else if (role == "Registered User") {
            navigation.navigate('Profile Page');
        }
        else if (role == "LOL") {
            navigation.navigate('Profile Page');
        }
        else {
            alert("Account does not exist");
        }
    }, [role, businesses])

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/splash.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}