import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import RNPickerSelect from 'react-native-picker-select';
import styles from './styles';
import { db } from '../../../config';

export default function AdminViewUser ({route, navigation}) {
    const {email, UEN, firstName, lastName, role, id, status, socialMediaHandle, socialMediaPlatform} = route.params;

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
    
        const onChangeRolePress = ()  => {
            try {
                const docRef = setDoc(doc(db, "users", email), {
                    role: newRole
                }, { merge:true });
                navigation.navigate('List Of Users')
            }
            catch (e) {
                console.log("Error updating document: ", e);
            }
        }
    
        const onChangeStatusPress = ()  => {
            try {
                const docRef = setDoc(doc(db, "users", email), {
                    status: newStatus
                }, { merge:true });
                navigation.navigate('List Of Users')
            }
            catch (e) {
                console.log("Error updating document: ", e);
            }
        }
    
        const onDeletePress = ()  => {
            deleteDoc(doc(db, "users", email));
            navigation.navigate('List Of Users')
        }
    
        return (
            <View>
                <Text>Change Account Role:</Text>
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
    
            <Text>Change Account Status</Text>
            <RNPickerSelect
                style={pickerSelectStyles}
                placeholder={statusP}
                useNativeAndroidPickerStyle={false}
                onValueChange={(value) => setStatus(value)}
                items = {[
                    {label:'Approved', value:'Approved'},
                    {label:'Pending', value:'Pending'},
                    {label:'Suspended', value:'Suspended'},
                ]}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => onChangeStatusPress()}>
                <Text style={styles.buttonTitle}>Change Status</Text>
            </TouchableOpacity>
    
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
                <Text>ID: {JSON.stringify(id)}</Text>
                <Text>Email: {JSON.stringify(email)}</Text>
                <Text>First Name: {JSON.stringify(firstName)}</Text>
                <Text>Last Name: {JSON.stringify(lastName)}</Text>
                <Text>Role: {JSON.stringify(role)}</Text>
                <Text>Status: {JSON.stringify(status)}</Text>
                <AllView/>
            </View>
        )
        
    }
    else if (role == "Business Owner") {
        return (
            <View>
                <Text>ID: {JSON.stringify(id)}</Text>
                <Text>Email: {JSON.stringify(email)}</Text>
                <Text>First Name: {JSON.stringify(firstName)}</Text>
                <Text>Last Name: {JSON.stringify(lastName)}</Text>
                <Text>Role: {JSON.stringify(role)}</Text>
                <Text>UEN: {JSON.stringify(UEN)}</Text>
                <Text>Status: {JSON.stringify(status)}</Text>
                <AllView/>
            </View>
        )
    }
    else if (role == "LOL") {
        return (
            <View>
                <Text>ID: {JSON.stringify(id)}</Text>
                <Text>Email: {JSON.stringify(email)}</Text>
                <Text>First Name: {JSON.stringify(firstName)}</Text>
                <Text>Last Name: {JSON.stringify(lastName)}</Text>
                <Text>Role: {JSON.stringify(role)}</Text>
                <Text>Social Media Handle: {JSON.stringify(socialMediaHandle)}</Text>
                <Text>Social Media Platform: {JSON.stringify(socialMediaPlatform)}</Text>
                <Text>Status: {JSON.stringify(status)}</Text>
                <AllView/>
            </View>
        )
    }
    else if (role == "Admin") {
        return (
            <View>
                <Text>ID: {JSON.stringify(id)}</Text>
                <Text>Email: {JSON.stringify(email)}</Text>
                <Text>First Name: {JSON.stringify(firstName)}</Text>
                <Text>Last Name: {JSON.stringify(lastName)}</Text>
                <Text>Role: {JSON.stringify(role)}</Text>
                <Text>Status: {JSON.stringify(status)}</Text>
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