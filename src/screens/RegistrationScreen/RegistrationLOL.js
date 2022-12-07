import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import styles from './styles';
import { db } from '../../../config';
import { render } from 'react-dom';
import RNPickerSelect from 'react-native-picker-select';

export default function RegistrationLOL({navigation}) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [socialMediaPlatform, setSelected] = useState('')
    const [socialMediaHandle, setSocialMediaHandle] = useState('')
    // Implement password length check, minimum length of 6

    const placeholder = {
        label: 'Social Media Platform',
        value: null,
        color: 'black',
    };

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const onRegisterPress = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            try {
                const uid = userCredential.user.uid
                const docRef = await setDoc(doc(db, "users", email), {
                    status: 'Pending',
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    id: uid,
                    role: 'LOL',
                    socialMediaPlatform: socialMediaPlatform,
                    socialMediaHandle: socialMediaHandle
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
                {/*<Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                />*/}
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
                <Text>Please specify your social media handle for verification:</Text>
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
                    placeholder={placeholder}
                    onValueChange={(value) => setSelected(value)}
                    items = {[
                        {label:'Tiktok', value:'Tiktok'},
                        {label:'Instagram', value:'Instagram'},
                        {label:'Twitter', value:'Twitter'},
                        {label:'Facebook', value:'Facebook'},
                        {label:'Youtube', value:'Youtube'},
                        {label:'Twitch', value:'Twitch'},
                        {label:'Blog', value:'Blog'},
                    ]}
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Social Media Handle'
                    onChangeText={(text) => setSocialMediaHandle(text)}
                    value={socialMediaHandle}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <Text>Upload a screenshot of your follower Count/ Page Views</Text>
                {/*TODO: Add image uploading */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Submit for approval</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}