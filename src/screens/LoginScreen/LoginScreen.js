import React, { useEffect, useState, useRef } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { db } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [businesses, setBusinesses] = useState('');
    const [status, setStatus] = useState('');
    const auth = getAuth();
    const didMount = useRef(false);

    const onFooterLinkPress = () => {
        navigation.navigate('Registration Selector')
    }

    const onPasswordResetPress = () => {
        navigation.navigate('Reset Password')
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
    const storeUserName = async (username) => {
        try {
            await AsyncStorage.setItem('username', username)
            console.log('Successfully added userName to ASync Storage with' , username)
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
                const username = docSnap.data().username
                const status = docSnap.data().status;
                setStatus(status);
                setUserName(username);
                setRole(roleData);
                setBusinesses(businessData);
            }
            else {
                console.log("Error", error)
            }})
            //.then(storeEmail(user.email)).then(storeRole(role))

            //navigation.navigate('Profile Page');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('Error Code: ', errorCode, 'Error Message: ', errorMessage)
            alert('Wrong email or password entered')
        })
    }

    useEffect(()=> {
        if ( !didMount.current ) {
            return() => { didMount.current = true;}
          }

        if (role == "Admin") {
            if (status == "Pending") {
                alert("Your registration has not yet been approved.")
            }
            else if (status == "Awaiting") {
                navigation.navigate('OTP Screen', {email: email, role: role, businesses: businesses, username: username});
            }
            else if (status == "Approved") {
                storeEmail(email);
                storeRole(role);
                storeBusinesses(businesses);
                storeUserName(username);
                navigation.reset({index: 0, routes: [{name: 'Admin Stack'}]})
            }
            else if (status == "Suspended") {
                alert("Your account has been suspended.")
            }
        }
        else if (role == "Business Owner") {
            if (status == "Pending") {
                alert("Your registration has not yet been approved.")
            }
            else if (status == "Awaiting") {
                navigation.navigate('OTP Screen', {email: email, role: role, businesses: businesses, username: username});
            }
            else if (status == "Approved") {
                storeEmail(email);
                storeRole(role);
                storeBusinesses(businesses);
                storeUserName(username);
                navigation.reset({index: 0, routes: [{name: 'BO Stack'}]})
            }
            else if (status == "Suspended") {
                alert("Your account has been suspended.")
            }
        }
        else if (role == "Registered User") {
            if (status == "Awaiting") {
                navigation.navigate('OTP Screen', {email: email, role: role, businesses: businesses, username: username});
            }
            else if (status == "Approved") {
                storeEmail(email);
                storeRole(role);
                storeUserName(username);
                navigation.navigate('Profile Page');
            }
            else if (status == "Suspended") {
                alert("Your account has been suspended.")
            }
        }
        else if (role == "LOL") {
            if (status == "Pending") {
                alert("Your registration has not yet been approved.")
            }
            else if (status == "Awaiting") {
                navigation.navigate('OTP Screen', {email: email, role: role, businesses: businesses, username: username});
            }
            else if (status == "Approved") {
                storeEmail(email);
                storeRole(role);
                storeUserName(username);
                navigation.navigate('Profile Page');
            }
            else if (status == "Suspended") {
                alert("Your account has been suspended.")
            }
        }
        else {
            alert("Account does not exist");
        }
    }, [role, businesses])

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}
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
                    <Text onPress={onPasswordResetPress} style={styles.footerLink}>Reset Password</Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}