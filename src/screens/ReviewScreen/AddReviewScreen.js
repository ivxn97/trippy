import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc, arrayUnion, collection, updateDoc } from "firebase/firestore";
import { db } from '../../../config';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes, deleteObject, listAll } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilteredTextInput } from '../commonFunctions';

//Placeholders for SELECT lists
const ratingPlaceholder = {
    label: 'Rating',
    value: null,
    color: 'black',
};

export default function AddReviewScreen ( { route, navigation }) {
    const {name, review} = route.params;
    

    const [userName, setUserName] = useState('');
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [addReview, setAddReview] = useState([]);

    const getUserName = async () => {
        try {
            const fullName = await AsyncStorage.getItem('userName');
            if (fullName !== null) {
                setUserName(fullName);
                //console.log(fullName);
            }
            else {
                console.log("No Name Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
        
    }

    getUserName();
    console.log(name);
    const onSubmitPress = async () => {
        try {
            await updateDoc(doc(db, "restaurants", name), {
                review: arrayUnion(...[{comment: comment,
                        rating: rating,
                        userName: userName}])
            }, {merge:true});
            //console.log("Document written with ID: ", docRef.id);
            navigation.navigate('Review Screen', {name, review});
        }
        catch (e) {
            console.log("Error adding document: ", e);
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
            
            <Text style={styles.text}>Comment:</Text>
                <TextInput
                style={styles.input}
                placeholder='Comment'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setComment(Text)}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                placeholder={ratingPlaceholder}
                onValueChange={(value) => setRating(value)}
                items={[
                    { label: '⭐', value: '⭐' },
                    { label: '⭐⭐', value: '⭐⭐' },
                    { label: '⭐⭐⭐', value: '⭐⭐⭐' },
                    { label: '⭐⭐⭐⭐', value: '⭐⭐⭐⭐' },
                    { label: '⭐⭐⭐⭐⭐', value: '⭐⭐⭐⭐⭐' },
                ]}
            />
            <TouchableOpacity
                    style={styles.button}
                    onPress={() => onSubmitPress()}>
                    <Text style={styles.buttonTitle}>Add Review</Text>
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