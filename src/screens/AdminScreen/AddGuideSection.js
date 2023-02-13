import React, { useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilteredTextInput } from '../commonFunctions';

export default function AddGuideSection ( {navigation} ) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

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

    // Add new Guide Section to Firestore Database
    const onSubmitPress = async () => {
        if (name !== '' && description !== '') {
            if (role == 'Admin') {
                try {
                    await setDoc(doc(db, "guide sections", name), {
                        name: name,
                        addedBy: email,
                        description: description,
                    });
                    alert('Guide Section Added')
                    navigation.navigate('Admin Page')
                }
                catch (e) {
                    console.log(e)
                }
            }
            else {
                alert('Wrong Role')
            }
       }
       else {
           alert('Please fill up all required information')
       }
   }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
            <Text style={styles.text}>Sub-Guide Name:</Text>
            <TextInput
                style={styles.input}
                placeholder='Name'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setName(Text)}
                value={name}
                underlineColorAndroid="transparent"
                autoCapitalize="words"
            />
           <Text style={styles.text}>Description:</Text>
            <FilteredTextInput
                style={styles.desc}
                placeholder='Description'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setDescription(Text)}
                value={description}
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                multiline
            />
            <TouchableOpacity
                    style={styles.button}
                    onPress={() => onSubmitPress()}>
                    <Text style={styles.buttonTitle}>Add Sub-Guide</Text>
            </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    )
}
