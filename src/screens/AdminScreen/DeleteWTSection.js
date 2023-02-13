import React, { useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilteredTextInput } from '../commonFunctions';

export default function DeleteWTSection ( {route, navigation} ) {
    const {name, description} = route.params;
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [newDescription, setDescription] = useState(description);

    // Get User email from Async Storage 
    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setEmail(email);
            }
            else {
                console.log("No Email Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }
    getEmail();

    // Get User Role from Async Storage
    const getRole = async () => {
        try {
            const role = await AsyncStorage.getItem('role');
            if (role !== null) {
                setRole(role);
                console.log(role)
            }
            else {
                console.log("Account has no role")
            }
        } catch (error) {
            console.log(error)
        }
    }
    getRole();

    // Delete a Walking Tour section from firestore DB
    const onConfirmDelete = async () => {
        if (role == 'Admin') {
            try {
                await deleteDoc(doc(db, "walking tour sections", name));
                
                navigation.replace('Admin Page')
            }
            catch (e) {
                console.log("Error deleting walking tour section: ", e);
            }
        }
        else {
            alert('Wrong Role')
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
            <Text style={styles.text}>Sub-Walking Tour Name:</Text>
            <Text style={styles.text}>{JSON.stringify(name)}</Text>
           <Text style={styles.text}>Description:</Text>
            <FilteredTextInput
                style={styles.desc}
                placeholder='Description'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setDescription(Text)}
                value={newDescription}
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                multiline
            />
            <TouchableOpacity
                        style={styles.button}
                        onPress={() => onConfirmDelete()}>
                        <Text style={styles.buttonTitle}>Delete Sub-Walking Tour</Text>
                </TouchableOpacity>

            </KeyboardAwareScrollView>
        </View>
    )
}
