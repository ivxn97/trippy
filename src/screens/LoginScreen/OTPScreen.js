import React, { useEffect, useState, useRef } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { doc, getDoc, collection, query, where, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { db, serviceID, accountApproval, publicKey } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import emailjs from '@emailjs/browser';

export default function OTPScreen({route, navigation}) {
    const {email, status, role, businesses, username} = route.params;
    const [OTP, setOTP] = useState()
    const [OTPSent, setOTPSent] = useState(false)
    const [result, setResult] = useState();
    const didMount = useRef(false);

    // Store Role/ Email/ Username/ business name in Async Storage after successful OTP
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
    // Get OTP assigned to the user from Firestore DB
    const getOTP = async () => {
        var OTPRef = doc(db, "OTP", email);
        getDoc(OTPRef).then((docSnap) => {
            if (docSnap.exists()) {
                const code = docSnap.data().OTP
                setOTP(code);
            }
        })
    }

    // Generate a new OTP, then set that OTP in firestore DB, and Email user the new OTP
    const generateOTP = async () => {
        const digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        console.log(OTP)

        try {
            await setDoc(doc(db, "OTP", email), {
                email: email,
                OTP: OTP, 
                type: 'logging in'
            }, {merge:true})
        }
        catch (e) {
            console.log(e)
        }

        let templateParams = {
            to_email: `${email}`,
            role: `${role}`,
            OTP: `${OTP}`
        }
        emailjs.send(serviceID, accountApproval, templateParams, publicKey).then(
            function (response) {
                console.log('SUCCESS!', response.status, response.text);
            },
            function (error) {
                console.log('FAILED...', error);
            }
        )
        setOTPSent(true);
        setOTP(OTP);
        alert("OTP has been sent to your provided email.")
    };

    // Change status of user upon successful OTP
    const changeStatus = async () => {
        try {
            const docRef = await setDoc(doc(db, "users", email), {
                status: 'Approved'
            }, {merge:true})
        }
        catch (e) {
            console.log("Error adding document: ", e);
        }
        deleteDoc(doc(db, "OTP", email))
    }

    // Change Status of user to Approved, Store information to Async Storage,
    // then navigate user to respective pages depending on role
    const onSubmitPress = () => {
        if (OTP == result) {
            changeStatus();
            if (role == "Admin") {
                storeEmail(email);
                storeRole(role);
                storeBusinesses(businesses);
                storeUserName(username);
                navigation.reset({index: 0, routes: [{name: 'Admin Stack'}]})
            }
            else if (role == "Business Owner") {
                storeEmail(email);
                storeRole(role);
                storeBusinesses(businesses);
                storeUserName(username);
                navigation.reset({index: 0, routes: [{name: 'BO Stack'}]})
            }
            else if (role == "Registered User") {
                storeEmail(email);
                storeRole(role);
                storeUserName(username);
                navigation.reset({index: 0, routes: [{name: 'Profile Page'}]})
            }
            else if (role == "LOL") {
                storeEmail(email);
                storeRole(role);
                storeUserName(username);
                navigation.reset({index: 0, routes: [{name: 'Profile Page'}]})
            }
            else {
                alert("Account does not exist");
            }
        }
        else {
            alert('Incorrect OTP entered.')
        }
    }

    useEffect(()=> {
        getOTP();
    }, [])

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/splash.png')}
                />
                <OTPInputView 
                style={{width: '80%', height: 200, flex: 1, marginLeft: 35}}
                pinCount={4}
                autoFocusOnLoad 
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled= {(code) => {setResult(code)}}/>
                <TouchableOpacity
                    style={[styles.button, {opacity: OTPSent ? 0.3 : 1, backgroundColor:'red'}]}
                    onPress={() => generateOTP()}
                    disabled={OTPSent}>
                    <Text style={styles.buttonTitle}>Re-send OTP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onSubmitPress()}>
                    <Text style={styles.buttonTitle}>Submit</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    )
}