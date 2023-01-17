import React, { useEffect, useState } from 'react';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, Button, Div } from 'react-native';
import { doc, setDoc, arrayUnion, collection, updateDoc } from "firebase/firestore";
import { db } from '../../../config';

export default function ReviewDetailScreen({route, navigation}) {
    const {name, index, review} = route.params;
    const [currentUserEmail, setCurrentUserEamil] = useState('');
    const [userName, setUserName] = useState ('');
    const [rating, setRating] = useState ('');
    const [comment, setComment] = useState ('');
    const [currReview, setCurrReview] = useState (review[index]);

    const getUserInfo = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setCurrentUserEamil(email);
                //console.log(fullName);
            }
            else {
                console.log("No Name Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
        
    }

    const getReviewDetails = () => {
        setUserName(currReview.userName);
        setRating(currReview.rating);
        setComment(currReview.comment);
    }

    const onDelete = async () => {
        review.splice(index, 1);
        console.log(review);
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

    useEffect(() => {
        getReviewDetails();
    }, [])
    
    getUserInfo();

    if (currReview.email === currentUserEmail) {
        return(
            <View>
                <View style={styles.desc}>
                    <Text>
                        <Text style={styles.text}>User Name:</Text>
                        <Text style={styles.textNB}> {userName}</Text>
                    </Text>
                    <Text>
                        <Text style={styles.text}>Ratings:</Text> 
                        <Text style={styles.textNB}> {rating}</Text>
                    </Text>
                    <Text>
                        <Text style={styles.text}>Comments:</Text> 
                        <Text style={styles.textNB}> {comment}</Text>
                    </Text>
                </View>
                <View>
                    <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Edit Review', {name: name, review: review, index: index})}>
                                <Text style={styles.buttonSmallText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonSmall} onPress={() => onDelete()}>
                                <Text style={styles.buttonSmallText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    } else {
        return(
            <View>
                <View style={styles.desc}>
                    <Text>
                        <Text style={styles.text}>User Name:</Text>
                        <Text style={styles.textNB}> {userName}</Text>
                    </Text>
                    <Text>
                        <Text style={styles.text}>Ratings:</Text> 
                        <Text style={styles.textNB}> {rating}</Text>
                    </Text>
                    <Text>
                        <Text style={styles.text}>Comments:</Text> 
                        <Text style={styles.textNB}> {comment}</Text>
                    </Text>
                </View>
            </View>
        )
    }
}