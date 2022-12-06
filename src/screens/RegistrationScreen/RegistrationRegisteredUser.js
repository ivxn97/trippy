import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { doc, setDoc, getDoc, DocumentSnapshot } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import styles from './styles';
import { db } from '../../../config';
import { render } from 'react-dom';
import RNPickerSelect from 'react-native-picker-select';
import Checkbox from 'expo-checkbox';

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
    
    // Interests
    let docData = [];
    const [docTypeData, setD] = useState([])
    const [isChecked, setChecked] = useState(false);
    const [userInterests, setUserInterests] = useState([])

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

    async function getLanguages () {
        var languageRef = doc(db, "types", "languages");
        const docSnap = await getDoc(languageRef);

        if (docSnap.exists()) {
            console.log("Document data: ", docSnap.data());
            languageArr = docSnap.data().languages
        }
        else {
            console.log("Error")
        }
        setLanguages(languageArr);
    }

    useEffect(() => {
        getInterests();
        getLanguages();
    }, []);

    const setInterest = (item) => {
        /*setUserInterests(current => [...current, value]);
        console.log(userInterests);*/
        /*
        let temp = userInterests.map((userInterest) => {
            if (name === userInterest.name) {
                return {... userInterest, isChecked: !userInterest.isChecked };
            }
            return userInterest;
        });
        setUserInterests(temp);
        console.log (userInterests);
        */
       setD(
        docTypeData.map(curr => {
            if (item.name === curr.name) {
                return {...curr, isChecked: !curr.checked};
            } else {
                return curr;
            }
        })
       )
       setUserInterests(current => [...current, item.name]);
       console.log(userInterests);
       console.log(docTypeData);
    }

    const setLanguage = (value) => {
        setUserInterests(current => [...current, value]);
        console.log(userInterests);
    }

    const onRegisterPress = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            try {
                const uid = userCredential.user.uid
                const docRef = await setDoc(doc(db, "users", email), {
                    status: 'Approved',
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    id: uid,
                    role: 'Registered User'
                });
                //console.log("Document written with ID: ", docRef.id);
                navigation.navigate('Home', {user: auth})
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

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                />
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
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <Text>Date of Birth:</Text>
                <RNPickerSelect
                style={StyleSheet.create({
                    inputIOSContainer: {
                        paddingVertical: 20,
                        paddingHorizontal: 30,
                        backgroundColor: 'white',
                        fontSize: '20',
                        marginTop: 10,
                        marginBottom: 10,
                        marginLeft: 30,
                        marginRight: 30,
                        paddingLeft: 16
                    },
                    inputIOS: {
                        fontSize: 14
                    }
                    })}
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
                style={StyleSheet.create({
                    inputIOSContainer: {
                        paddingVertical: 20,
                        paddingHorizontal: 30,
                        backgroundColor: 'white',
                        fontSize: '20',
                        marginTop: 10,
                        marginBottom: 10,
                        marginLeft: 30,
                        marginRight: 30,
                        paddingLeft: 16
                    },
                    inputIOS: {
                        fontSize: 14
                    }
                    })}
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
                <Text>Country of Origin:</Text>
                <RNPickerSelect
                style={StyleSheet.create({
                    inputIOSContainer: {
                        paddingVertical: 20,
                        paddingHorizontal: 30,
                        backgroundColor: 'white',
                        fontSize: '20',
                        marginTop: 10,
                        marginBottom: 10,
                        marginLeft: 30,
                        marginRight: 30,
                        paddingLeft: 16
                    },
                    inputIOS: {
                        fontSize: 14
                    }
                    })}
                useNativeAndroidPickerStyle={false}
                placeholder={countryPlaceholder}
                onValueChange={(value) => setCountry(value)}
                items = {[
                    {label:'USA', value:'USA'}, {label:'Singapore', value:'Singapore'}, {label:'UK', value:'UK'},
                    {label:'Australia', value:'Australia'},
                ]}
                />
                <Text>Interests:</Text>
                {docTypeData.map((item, index) => (
                    <View style={styles.checklist} key={index}>
                        <Checkbox style={styles.checkbox} value={item.isChecked} onValueChange={() => setInterest(item)}/>
                        <Text>{item.name}</Text>
                    </View>
                ))}

                <Text>Preferred languages:</Text>
                {languageData.map((item, index) => (
                    <View style={styles.checklist} key={index}>
                        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={(value) => setLanguage(item)}/>
                        <Text>{item}</Text>
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

