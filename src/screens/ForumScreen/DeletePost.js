import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, Text, TextInput, TouchableOpacity, View, 
    StyleSheet, Share, FlatList, SafeAreaView } from 'react-native';    
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayRemove, arrayUnion, deleteDoc } from "firebase/firestore";
import { db } from '../../../config';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Moment from "moment";
import { report } from '../commonFunctions';

export default function DeletePost({route, navigation}) {
    const {title, description, section, addedBy, likedBy, datetime} = route.params;
    console.log(datetime)
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [registeredButton, setRegisteredButton] = useState(true);
    const [username, setUsername] = useState('');
    const [reply, setReply] = useState([]); // Initial empty array of replies
    const [userLiked, setUserLiked] = useState(false)
    const [likedArr, setLikedArr] = useState(likedBy)


    useEffect(async () => {
        const q = query(collection(db, "forum reply"), where('title', '==', title))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(documentSnapshot => {
            reply.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });

        setReply(reply);
        setLoading(false);
    }, []);   

    const deletePost = async () => {
        deleteDoc(doc(db, "forum", title))
        alert("Post deleted")
        navigation.navigate('Admin Page')
    }

    const ItemView = ({item}) => {
        return (
            <TouchableHighlight
                underlayColor="#C8c9c9"
                onPress={() => {navigation.navigate('Delete Reply', {title : item.title, description: item.description,
                 section: item.section, comment_id: item.comment_id, addedBy: item.addedBy, datetime: item.datetime})}}>
                <View style={styles.list}>
                    <Text>{item.addedBy}</Text>
                    <Text>{item.description}</Text>
                </View>
            </TouchableHighlight>
        )
       }

    return(
        <View style={styles.threadContainer}>
            <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>

            {/* Header */}
            <Text style={styles.Heading}>{JSON.stringify(title).replace(/"/g,"")}</Text>

            {/* details */}
            <Text style={styles.textNB}>Section: {JSON.stringify(section).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Posted: {Moment(datetime.toDate()).fromNow()} {"\n"}</Text>
            <Text style={styles.textNB}>{JSON.stringify(description).replace(/"/g,"")}</Text>
            
            <TouchableOpacity
                style={styles.button}
                onPress={() => deletePost()}>
                <Text style={styles.buttonTitle}>Delete Post</Text>
            </TouchableOpacity>
            {/* FlatList -- replies */}
            
                <FlatList
                    data={reply}
                    renderItem={ItemView}
                    keyExtractor={(item, index) => index.toString()}
                />
                </ScrollView>
        </View>
    )
}
