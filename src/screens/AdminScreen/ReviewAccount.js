import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import RNPickerSelect from 'react-native-picker-select';
import styles from './styles';
import { db, serviceID, accountApproval, accountRejection, publicKey } from '../../../config';
import * as WebBrowser from 'expo-web-browser';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import emailjs from '@emailjs/browser';

export default function ReviewAccount ({route, navigation}) {
    const {email, UEN, firstName, lastName, role, id, status, socialMediaHandle, socialMediaPlatform} = route.params;
    const [screenshot, setScreenshot] = useState();
    const [reason, setReason] = useState('')
    const storage = getStorage();

    const getScreenshot = () => {
        const listRef = ref(storage, `RegistrationLOL/${email}/images`);
        Promise.all([
            listAll(listRef).then((res) => {
              const promises = res.items.map((folderRef) => {
                return getDownloadURL(folderRef).then((link) =>  {
                  return link;
                });
              });
              return Promise.all(promises);
            })
          ]).then(async (results) => {
            const fetchedScreenshot = results[0];
            const processedURL = fetchedScreenshot.toString()
            console.log(fetchedScreenshot);
            console.log(processedURL)
            setScreenshot(fetchedScreenshot)
            await WebBrowser.openBrowserAsync(processedURL);
        });
    }

    function AllView () {
        const [newRole, setRole] = useState('')
        const [newStatus, setStatus] = useState('')
    
        //Placeholders
        const roleP = {
            label: 'select a role',
            value: null,
            color: 'black',
        };
    
        const statusP = {
            label: 'select a status',
            value: null,
            color: 'black',
        };
    
    
        const onApprove = ()  => {
            generateOTP();
            try {
                const docRef = setDoc(doc(db, "users", email), {
                    status: 'Awaiting'
                }, { merge:true });
                alert(`Account status changed to Awaiting`)
                navigation.replace('Review Pending Accounts')
            }
            catch (e) {
                console.log("Error updating document: ", e);
            }
        }

        const onReject = async () => {
            deleteDoc(doc(db, "users", email))
            deleteFolder(`/users/${email}`)

            let templateParams = {
                to_email: `${email}`,
                role: `${role}`,
                reason: `${reason}`
            }
            emailjs.send(serviceID, accountRejection, templateParams, publicKey).then(
                function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                },
                function (error) {
                    console.log('FAILED...', error);
                }
            )
            alert('Account Rejected and deleted')
            navigation.replace('Review Pending Accounts')
        }

        function deleteFolder(path) {
            const listRef = ref(storage, path)
            listAll(listRef)
                .then(dir => {
                    dir.items.forEach(fileRef => deleteObject(ref(storage, fileRef)));
                    console.log("Files deleted successfully from Firebase Storage");
                })
                .catch(error => console.log(error));
        }

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
        };
    
        return (
            <View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => onApprove()}>
                <Text style={styles.buttonTitle}>Approve Account Application</Text>
            </TouchableOpacity>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>If Reject:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Rejection Reason'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setReason(text)}
                    value={reason}
                    underlineColorAndroid="transparent"
                    autoCapitalize="sentences"
            />
            <TouchableOpacity style={[styles.button, 
                {opacity: reason ? 1: 0.2, backgroundColor: '#E4898b'}]} onPress={() => onReject()} 
                disabled={reason ? false : true} >
                <Text style={styles.buttonTitle}>Reject Account Application</Text>
            </TouchableOpacity>
            </View>
        )
    }
    
    if (role == "Business Owner") {
        return (
            <View>
                <Text style={styles.text}>ID: {JSON.stringify(id)}</Text>
                <Text style={styles.text}>Email: {JSON.stringify(email)}</Text>
                <Text style={styles.text}>First Name: {JSON.stringify(firstName)}</Text>
                <Text style={styles.text}>Last Name: {JSON.stringify(lastName)}</Text>
                <Text style={styles.text}>Role: {JSON.stringify(role)}</Text>
                <Text style={styles.text}>UEN: {JSON.stringify(UEN)}</Text>
                <Text style={styles.text}>Status: {JSON.stringify(status)}</Text>
                <Text>{"\n"}</Text>
                <AllView/>
            </View>
        )
    }
    else if (role == "LOL") {
        return (
            <View>
                <Text style={styles.text}>ID: {JSON.stringify(id)}</Text>
                <Text style={styles.text}>Email: {JSON.stringify(email)}</Text>
                <Text style={styles.text}>First Name: {JSON.stringify(firstName)}</Text>
                <Text style={styles.text}>Last Name: {JSON.stringify(lastName)}</Text>
                <Text style={styles.text}>Role: {JSON.stringify(role)}</Text>
                <Text style={styles.text}>Social Media Handle: {JSON.stringify(socialMediaHandle)}</Text>
                <Text style={styles.text}>Social Media Platform: {JSON.stringify(socialMediaPlatform)}</Text>
                <Text style={styles.text}>Status: {JSON.stringify(status)}</Text>
                <TouchableOpacity style={styles.button} onPress={()=> getScreenshot()}>
                    <Text style={styles.buttonTitle}>View follower count screenshot</Text>
                </TouchableOpacity>
                <Text>{"\n"}</Text>
                <AllView/>
            </View>
        )
    }
}