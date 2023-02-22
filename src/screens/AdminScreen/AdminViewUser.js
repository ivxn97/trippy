import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import RNPickerSelect from 'react-native-picker-select';
import styles from './styles';
import { db } from '../../../config';
import * as WebBrowser from 'expo-web-browser';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

export default function AdminViewUser ({route, navigation}) {
    const {email, UEN, firstName, lastName, role, id, status, socialMediaHandle, socialMediaPlatform, username} = route.params;
    const [screenshot, setScreenshot] = useState();
    const storage = getStorage();

    // Get Images uploaded from the LOL 
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
    
        // Submits Role Change to Firestore DB
        const onChangeRolePress = ()  => {
            if (newRole !== '') {
                try {
                    const docRef = setDoc(doc(db, "users", email), {
                        role: newRole
                    }, { merge:true });
                    alert(`Role changed to ${newRole}`)
                    navigation.navigate('Admin Page')
                }
                catch (e) {
                    console.log("Error updating document: ", e);
                }
            }
            else {
                alert("No Role selected")
            }
        }
    
        // Submits Status change to Firestore DB
        const onChangeStatusPress = ()  => {
            if (newStatus !== '') {
                try {
                    const docRef = setDoc(doc(db, "users", email), {
                        status: newStatus
                    }, { merge:true });
                    alert(`Account status changed to ${newStatus}`)
                    navigation.navigate('Admin Page')
                }
                catch (e) {
                    console.log("Error updating document: ", e);
                }
            }
            else {
                alert("No Status selected")
            }
        }
    
        // Deletes user Account
        const onDeletePress = ()  => {
            deleteDoc(doc(db, "users", email));
            deleteFolder(`/users/${email}/profile/`)
            alert(`Account deleted`)
            navigation.navigate('Admin Page')
        }

        // Delete Images from Firebase Storage 
        function deleteFolder(path) {
            const listRef = ref(storage, path)
            listAll(listRef)
                .then(dir => {
                    dir.items.forEach(fileRef => deleteObject(ref(storage, fileRef)));
                    console.log("Files deleted successfully from Firebase Storage");
                })
                .catch(error => console.log(error));
        }
    
        return (
            <View>
                <Text style={styles.text}>Change Account Role:</Text>
                <RNPickerSelect
                style={pickerSelectStyles}
                placeholder={roleP}
                useNativeAndroidPickerStyle={false}
                onValueChange={(value) => setRole(value)}
                items = {[
                    {label:'Registered User', value:'Registered User'},
                    {label:'LOL', value:'LOL'},
                    {label:'Business Owner', value:'Business Owner'},
                    {label:'Admin', value:'Admin'},
                ]}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => onChangeRolePress()}>
                <Text style={styles.buttonTitle}>Change Role</Text>
            </TouchableOpacity>
    
            <Text>{"\n"}</Text>
            <Text style={styles.text}>Change Account Status</Text>
            <RNPickerSelect
                style={pickerSelectStyles}
                placeholder={statusP}
                useNativeAndroidPickerStyle={false}
                onValueChange={(value) => setStatus(value)}
                items = {[
                    {label:'Approved', value:'Approved'},
                    {label:'Awaiting', value:'Awaiting'},
                    {label:'Pending', value:'Pending'},
                    {label:'Suspended', value:'Suspended'},
                ]}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => onChangeStatusPress()}>
                <Text style={styles.buttonTitle}>Change Status</Text>
            </TouchableOpacity>
            <Text>{"\n"}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => onDeletePress()}>
                <Text style={styles.buttonTitle}>Delete Account</Text>
            </TouchableOpacity>
            </View>
        )
    }
    
    if (role == "Registered User") {
        return (
            <View>
                <Text style={styles.text}>ID: {JSON.stringify(id)}</Text>
                <Text style={styles.text}>Email: {JSON.stringify(email)}</Text>
                <Text style={styles.text}>Last Name: {JSON.stringify(username)}</Text>
                <Text style={styles.text}>First Name: {JSON.stringify(firstName)}</Text>
                <Text style={styles.text}>Last Name: {JSON.stringify(lastName)}</Text>
                <Text style={styles.text}>Role: {JSON.stringify(role)}</Text>
                <Text style={styles.text}>Status: {JSON.stringify(status)}</Text>
                <Text>{"\n"}</Text>
                <AllView/>
            </View>
        )
        
    }
    else if (role == "Business Owner") {
        return (
            <View>
                <Text style={styles.text}>ID: {JSON.stringify(id)}</Text>
                <Text style={styles.text}>Email: {JSON.stringify(email)}</Text>
                <Text style={styles.text}>Last Name: {JSON.stringify(username)}</Text>
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
                <Text style={styles.text}>Last Name: {JSON.stringify(username)}</Text>
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
    else if (role == "Admin") {
        return (
            <View>
                <Text style={styles.text}>ID: {JSON.stringify(id)}</Text>
                <Text style={styles.text}>Email: {JSON.stringify(email)}</Text>
                <Text style={styles.text}>Last Name: {JSON.stringify(username)}</Text>
                <Text style={styles.text}>First Name: {JSON.stringify(firstName)}</Text>
                <Text style={styles.text}>Last Name: {JSON.stringify(lastName)}</Text>
                <Text style={styles.text}>Role: {JSON.stringify(role)}</Text>
                <Text style={styles.text}>Status: {JSON.stringify(status)}</Text>
                <Text>{"\n"}</Text>
                <AllView/>
            </View>
        )
    }
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