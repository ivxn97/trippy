import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import styles from './styles';
import { db } from '../../../config';
import { render } from 'react-dom';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, uploadString } from "firebase/storage";

export default function RegistrationLOL({navigation}) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [socialMediaPlatform, setSelected] = useState('')
    const [socialMediaHandle, setSocialMediaHandle] = useState('')
    const [socialMediaPlatformData, setSelectedData] = useState()
    const [loading, setLoading] = useState(true)
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState('')
    const [imageUploaded, setImageUploaded] = useState(false)
    const [followerImageUploaded, setFImageUploaded] = useState(false)
    // Implement password length check, minimum length of 6

    const getData = async () => {
        const docRef = doc(db, "types", "RegistrationLOL");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data().socialMediaPlatform
            setSelectedData(data)
        }
        else {
            console.log("No data found")
        }
        setLoading(false)
    }

    useEffect(() => {
        if (loading) {
            getData();
        }
    }, [socialMediaPlatformData]);

    const placeholder = {
        label: 'Social Media Platform',
        value: null,
        color: 'black',
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        console.log(result);
        const fileName = result.uri.split('/').pop();
        const fileType = fileName.split('.').pop();
        console.log(fileName, fileType);

        const response = await fetch(result.uri)
        const blobFile = await response.blob()

        if (!result.canceled) {
            const listRef = ref(storage, `/users/${email}/profile`)
            listAll(listRef)
                .then(dir => {
                dir.items.forEach(fileRef => deleteObject(ref(storage, fileRef)));
                console.log("Files deleted successfully from Firebase Storage");
                })
            .catch(error => console.log(error));
            
          const storageRef = ref(storage, `users/${email}/profile/${fileName}`)
          uploadBytes(storageRef, blobFile).then((snapshot) => {
            alert("Profile Photo Uploaded!");
            setImageUploaded(true)
            console.log("Image uploaded!");
        })}
        else {
            console.log('No Image uploaded!')
        };
    };

    const pickFollowerImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [41, 25],
          quality: 1,
        });
    
        console.log(result);
        const fileName = result.uri.split('/').pop();
        const fileType = fileName.split('.').pop();
        console.log(fileName, fileType);

        const response = await fetch(result.uri)
        const blobFile = await response.blob()

        const storage = getStorage();
        if (!result.canceled) {
          setImage(result.uri);
          const storageRef = ref(storage, `RegistrationLOL/${email}/images/${fileName}`)
          uploadBytes(storageRef, blobFile).then((snapshot) => {
            alert("Image uploaded!");
            setFImageUploaded(true)
            console.log("Image uploaded!");
        })}
        else {
            console.log('No Image uploaded!')
        };
    };

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const onRegisterPress = () => {
        if (firstName !== '' && lastName !== '' && email !== '' && socialMediaPlatform !== '' ** socialMediaHandle !== '' && 
            username !== '' && imageUploaded == true && followerImageUploaded == true) {
            if (password.length > 5) {
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
                            socialMediaHandle: socialMediaHandle,
                            username: username
                        });
                        alert("Your registration request has been received and is awaiting approval.")
                        navigation.navigate('Profile Page', {user: auth})
                    }
                    catch (e) {
                        console.log("Error adding document: ", e);
                    }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(error);
                    alert(error);
                });
            }
            else {
                alert('Password Length must be a minimum of 6 characters')
            }
        }
        else {
            alert('Please fill up all required information (incl uploading photos)')
        }
    }

    if (loading) {
        return <ActivityIndicator />;
    }


    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}
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

                <Text style={styles.text}>Upload Profile Picture:</Text>
                <TouchableOpacity style={[styles.button, {opacity: email ? 1: 0.2}]} onPress={pickImage} 
                    disabled={email ? false : true} >
                    <Text>Upload Profile Picture</Text>
                </TouchableOpacity>

                <Text style={styles.text}>Username:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Username'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setUsername(text)}
                    value={username}
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
                <Text style={styles.text}>Please specify your social media handle for verification:</Text>
                <RNPickerSelect
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    placeholder={placeholder}
                    onValueChange={(value) => setSelected(value)}
                    items = {socialMediaPlatformData}
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
                <Text style={styles.text}>Upload a screenshot of your follower Count/ Page Views</Text>
                <TouchableOpacity style={[styles.button, {opacity: email ? 1: 0.2}]} onPress={pickFollowerImage} 
                disabled={email ? false : true} >
                <Text>Upload Image</Text>
                </TouchableOpacity>
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
