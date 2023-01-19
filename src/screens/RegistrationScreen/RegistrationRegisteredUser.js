import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { doc, setDoc, getDoc, DocumentSnapshot } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import styles from './styles';
import { db, serviceID, OTPID, publicKey } from '../../../config';
import { render } from 'react-dom';
import RNPickerSelect from 'react-native-picker-select';
import Checkbox from 'expo-checkbox';
import emailjs from '@emailjs/browser';

export default function RegistrationRegisteredUser({navigation}) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [day, setDayDOB] = useState('')
    const [month, setMonthDOB] = useState('')
    const [year, setYearDOB] = useState('')
    const [country, setCountry] = useState('')
    const [countryData, setCountryData] = useState()
    const [loading, setLoading] = useState(true)
    
    // Interests
    let docData = [];
    const [docTypeData, setD] = useState([])

    //Langauges
    let languageArr = []
    const [languageData, setLanguages] = useState([])
    // Implement password length check, minimum length of 6

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    //Placeholders
    const dayPlaceholder = {
        label: 'Day',
        value: null,
        color: 'black',
    };

    const monthPlaceholder = {
        label: 'Month',
        value: null,
        color: 'black',
    };

    const countryPlaceholder = {
        label: 'Country',
        value: null,
        color: 'black',
    };
    // Get Interests from Firestore
    async function getInterests () {
        var interestRef = doc(db, "types", "RegisteredUserPage");
        const docSnap = await getDoc(interestRef);

        if (docSnap.exists()) {
            console.log("Document data: ", docSnap.data());
            docData = docSnap.data().interestTypes
        }
        else {
            console.log("Error")
        }
        setD(docData);
    }
    // Get Languages from Firestore 
    async function getData () {
        var languageRef = doc(db, "types", "commonFields");
        const docSnap = await getDoc(languageRef);

        if (docSnap.exists()) {
            console.log("Document data: ", docSnap.data());
            const languageArr = docSnap.data().languages
            const countriesArr = docSnap.data().countries
            setLanguages(languageArr);
            setCountryData(countriesArr);
        }
        else {
            console.log("Error")
        }
        setLoading(false)
    }

    useEffect(() => {
    if (loading) {
        getInterests();
        getData();
        }
    }, [countryData]);

    const setInterest = (item) => {
       setD(
        docTypeData.map(curr => {
            if (item.name === curr.name) {
                if (curr.isChecked == false) {
                    //setUserInterests(current => [...current, item.name]);
                    return {...curr, isChecked: true};
                    
                }
                else if (curr.isChecked == true) {
                    //setUserInterests((current) => current.filter((item)=> item.name !== userInterests ))
                    return {...curr, isChecked: false};
                }
            } else {
                return curr;
            }
        })
       )
    }
    console.log(docTypeData);

    const setLanguage = (item) => {
        setLanguages(
        languageData.map(curr => {
            if (item.language === curr.language) {
                if (curr.isChecked == false) {
                    return {...curr, isChecked: true};
                    
                }
                else if (curr.isChecked == true) {
                    return {...curr, isChecked: false};
                }
            } else {
                return curr;
            }
        })
        )
    }
    console.log(languageData);
    
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
            OTP: `${OTP}`
        }
        emailjs.send(serviceID, OTPID, templateParams, publicKey).then(
            function (response) {
                console.log('SUCCESS!', response.status, response.text);
            },
            function (error) {
                console.log('FAILED...', error);
            }
        )
    };

    const onRegisterPress = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            try {
                const uid = userCredential.user.uid
                generateOTP();
                const docRef = await setDoc(doc(db, "users", email), {
                    status: 'Awaiting',
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    id: uid,
                    role: 'Registered User',
                    country: country,
                    DOB: day + "/" + month + "/" + year,
                    interests: docTypeData,
                    languages: languageData
                });
                alert("Account created! Check your email for your One-Time-Password.")
                navigation.navigate('Login')
            }
            catch (e) {
                console.log("Error adding document: ", e);
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                />
                <Text style={styles.text}>Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='First Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setFirstName(text)}
                    value={firstName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='Last Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setLastName(text)}
                    value={lastName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <Text style={styles.text}>E-mail:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <Text style={styles.text}>Date of Birth:</Text>
                <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                placeholder={dayPlaceholder}
                onValueChange={(value) => setDayDOB(value)}
                items = {[
                    {label:'00', value:'00'}, {label:'01', value:'01'}, {label:'02', value:'02'},
                    {label:'03', value:'03'}, {label:'04', value:'04'}, {label:'05', value:'05'},
                    {label:'06', value:'06'}, {label:'07', value:'07'}, {label:'08', value:'08'},
                    {label:'09', value:'09'}, {label:'10', value:'10'}, {label:'11', value:'11'},
                    {label:'12', value:'12'}, {label:'13', value:'13'}, {label:'14', value:'14'},
                    {label:'15', value:'15'}, {label:'16', value:'16'}, {label:'17', value:'17'},
                    {label:'18', value:'18'}, {label:'19', value:'19'}, {label:'20', value:'20'},
                    {label:'21', value:'21'}, {label:'22', value:'22'}, {label:'23', value:'23'},
                    {label:'24', value:'24'}, {label:'25', value:'25'}, {label:'26', value:'26'},
                    {label:'27', value:'27'}, {label:'28', value:'28'}, {label:'29', value:'29'},
                    {label:'30', value:'30'}, {label:'31', value:'31'},
                ]}
                />
                <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                placeholder={monthPlaceholder}
                onValueChange={(value) => setMonthDOB(value)}
                items = {[
                    {label:'January', value:'January'}, {label:'February', value:'February'}, {label:'March', value:'March'},
                    {label:'April', value:'April'}, {label:'May', value:'May'}, {label:'June', value:'June'},
                    {label:'July', value:'July'}, {label:'August', value:'August'}, {label:'September', value:'September'},
                    {label:'October', value:'October'}, {label:'November', value:'November'}, {label:'December', value:'December'},
                ]}
                />
                
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Year'
                    onChangeText={(text) => setYearDOB(text)}
                    value={year}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <Text style={styles.text}>Password:</Text>
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
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <Text style={styles.text}>Country of Origin:</Text>
                <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                placeholder={countryPlaceholder}
                onValueChange={(value) => setCountry(value)}
                items = {countryData}
                />
                <Text style={styles.text}>Interests:</Text>
                {docTypeData.map((item, index) => (
                    <View style={styles.checklist} key={index}>
                        <Checkbox style={styles.checkbox} value={item.isChecked} onValueChange={() => setInterest(item)}/>
                        <Text>{item.name}</Text>
                    </View>
                ))}

                <Text style={styles.text}>Preferred languages:</Text>
                {languageData.map((item, index) => (
                    <View style={styles.checklist} key={index}>
                        <Checkbox style={styles.checkbox} value={item.isChecked} onValueChange={() => setLanguage(item)}/>
                        <Text>{item.language}</Text>
                    </View>
               ))}

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 16
    },
    inputAndroid: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 16
      }
})
