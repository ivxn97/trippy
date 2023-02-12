import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, getDocs, setDoc, collection } from "firebase/firestore";
import { db } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilteredTextInput } from '../commonFunctions';

const sectionPlaceholder = {
    label: 'Forum Section',
    value: null,
    color: 'black',
};

export default function CreatePost ( {route, navigation} ) {
    const {sectionName} = route.params;
    const [username, setUsername] = useState('');
    const [title, setTitle] = useState('');
    const [section, setSection] = useState('');
    const [description, setDescription] = useState('');
    const datetime = new Date();

    const getUsername = async () => {
        try {
            const username = await AsyncStorage.getItem('username');
            if (username !== null) {
                setUsername(username);
            }
            else {
                console.log("No username Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }
    getUsername();



    const onSubmitPress = async () => {
        if (title !== '' && description !== '') {
            try {
                await setDoc(doc(db, "forum", title), {
                    addedBy: username,
                    title: title,
                    section: sectionName,
                    description: description,
                    datetime: datetime,
                    likedBy: ''
                });
                navigation.replace('Forum Page')
            }
            catch (e) {
                console.log("Error adding Post: ", e);
            }
       }
       else {
           alert('Please fill up all required information')
       }
   }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
            <Text style={styles.text}>Title:</Text>
            <FilteredTextInput
                style={styles.input}
                placeholder='Title'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setTitle(Text)}
                value={title}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <Text style={styles.text}>Forum Section: {JSON.stringify(sectionName).replace(/"/g,"")}</Text>
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
                    <Text style={styles.buttonTitle}>Create Forum Post</Text>
            </TouchableOpacity>
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
