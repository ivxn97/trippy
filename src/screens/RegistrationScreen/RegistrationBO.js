import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import styles from './styles';
import { db } from '../../../config';
import { render } from 'react-dom';
import Checkbox from 'expo-checkbox';
import { getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';


export default function RegistrationBO({navigation}) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [UEN, setUEN] = useState('')
    const [username, setUsername] = useState('')
    const [imageUploaded, setImageUploaded] = useState(false)
    // Implement password length check, minimum length of 6

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const placeholder = {
        label: 'Social Media Platform',
        value: null,
        color: 'black',
    };

    let businessData = [{ name: 'Hotels', value: 'Hotels', isChecked: false },
        { name: 'Restaurants', value: 'Restaurants', isChecked: false },
        { name: 'Attractions', value: 'Attractions', isChecked: false },
        { name: 'Paid Tours', value: 'Paid Tours', isChecked: false }];
    const [docBusinessData, setBusinessData] = useState([])

    useEffect(() => {
        setBusinessData(businessData);
    }, [])

    const setBusiness = (item) => {
        
        setBusinessData(
            docBusinessData.map(curr => {
                if (item.name === curr.name) {
                    if (curr.isChecked == false) {
                        return {...curr, isChecked: true};
                        
                    }
                    else if (curr.isChecked == true) {
                        return {...curr, isChecked: false};
                    }
                }
                 else {
                    return curr;
                }
            })
        )
    }

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
    
    const onRegisterPress = () => {
        if (firstName !== '' && lastName !== '' && businessName !== '' && email !== '' && UEN !== '' && 
            username !== '' && imageUploaded == true) {
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
                            businessName: businessName,
                            businessesTypes: docBusinessData,
                            email: email,
                            id: uid,
                            role: 'Business Owner',
                            UEN: UEN,
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
                    console.log(error)
                    alert(error);
                });
            }
            else {
                alert('Password Length must be a minimum of 6 characters')
            }
        }
        else {
            alert('Please fill up all required information (incl profile photo)')
        }
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
                <Text style={styles.text}>Business Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Business Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setBusinessName(text)}
                    value={businessName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                
                <Text style={styles.text}>Select Business Type:</Text>
                {docBusinessData.map((item, index) => (
                    <View style={styles.checklist} key={index}>
                        <Checkbox style={styles.checkbox} value={item.isChecked} onValueChange={() => setBusiness(item)} />
                        <Text>{item.name}</Text>
                    </View>
                ))}

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
                <Text style={styles.text}>UEN:</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='UEN'
                    onChangeText={(text) => setUEN(text)}
                    value={UEN}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
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