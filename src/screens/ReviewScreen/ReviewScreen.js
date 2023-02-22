import React, { useEffect, useState } from 'react';
import styles from './styles';
import { doc, setDoc, getDocs, collection, updateDoc } from "firebase/firestore";
import { db } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, Button } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

export default function ReviewScreen({route, navigation}) {
    const {name, activityType} = route.params;
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [email, setEmail] = useState('');
    const [review, setReview] = useState([]);
    const [activity, setActivity] = useState([]);
    const [reviewButton, setReviewButton] = useState(true);

    useFocusEffect(React.useCallback(async ()=> {
        getUserInfo();
    }, []));

    useEffect(async () => {
        const querySnapshot = await getDocs(collection(db, activityType));
        querySnapshot.forEach(documentSnapshot => {
            activity.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });
        
        activity.map((item) => {
            if (item.name === name) {
                setReview(item.review);
            }
        });

        setActivity(activity);
        
        setLoading(false);
    },[]);

    const getUserInfo = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setReviewButton(false)
                setEmail(email);
                //console.log(fullName);
            }
            else {
                setReviewButton(true)
                console.log("No Name Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
        
    }

    return(
        <View>
            <Text style={styles.Heading}>{name}</Text>
            <FlatList
            data = {review}
            renderItem={({ item }) => (
                <TouchableHighlight 
                underlayColor="#C8c9c9"
                onPress={() => navigation.navigate('Review Detail Screen', {name: name, review: review, index: review.indexOf(item), activityType: activityType})}>
                <View style={styles.list}>
                    <Text>{item.userName}</Text>
                    <Text>{item.rating}</Text>
                    <Text numberOfLines={1}>{item.comment}</Text>
                </View>
                </TouchableHighlight>
            )}
            />
            <View>
                <TouchableOpacity style={[styles.buttonSmall, {opacity: reviewButton ? 0.3 : 1}]} onPress={() => navigation.replace('Add Review Screen', {name, activityType})}
                    disabled={reviewButton}>
                            <Text style={styles.buttonSmallText}>Add Review</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}