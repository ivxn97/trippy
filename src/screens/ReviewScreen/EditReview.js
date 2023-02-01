import React, { useEffect, useState } from 'react';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, TextInput, View, Text, TouchableOpacity, StyleSheet, Div } from 'react-native';
import { doc, setDoc, arrayUnion, collection, updateDoc } from "firebase/firestore";
import { db } from '../../../config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';

const ratingPlaceholder = {
    label: 'Rating',
    value: null,
    color: 'black',
};

export default function EditReview({route, navigation}) {
    const {name, index, review} = route.params;
    const [userName, setUserName] = useState ('');
    const [rating, setRating] = useState ('');
    const [comment, setComment] = useState ('');
    const [currReview, setCurrReview] = useState (review[index]);
    const [newRating, setNewRating] = useState (rating);
    const [newComment, setNewComment] = useState (comment);


    const onSubmitPress = async () => {
        currReview.comment = newComment;
        currReview.rating = newRating;
        review[index] = currReview;
        try {
            await updateDoc(doc(db, "restaurants", name), {
                review: review
            });
            //console.log("Document written with ID: ", docRef.id);
            navigation.navigate('Review Screen', {name});
        }
        catch (e) {
            console.log("Error adding document: ", e);
        }
    }

    const getReviewDetails = () => {
        setUserName(currReview.userName);
        setRating(currReview.rating);
        setComment(currReview.comment);
    }

    useEffect(() => {
        getReviewDetails();
    }, [])

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
            
            <Text style={styles.text}>Comment:</Text>
                <TextInput
                style={styles.desc}
                placeholder='Comment'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setNewComment(Text)}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                multiline
            />
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                placeholder={ratingPlaceholder}
                onValueChange={(value) => setNewRating(value)}
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
                    <Text style={styles.buttonTitle}>Edit Review</Text>
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