import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, Text, TextInput, TouchableOpacity, View, 
    StyleSheet, Share, FlatList, SafeAreaView } from 'react-native';    
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from '../../../config';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Moment from "moment";
import { report } from '../commonFunctions';

export default function Thread({route, navigation}) {
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

    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setRegisteredButton(false);
                setEmail(email);
                console.log(email)
            }
            else {
                console.log("No Email Selected at Login")
                setRegisteredButton(true);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getUsername = async () => {
        try {
            const username = await AsyncStorage.getItem('username');
            if (username !== null) {
                setUsername(username);
                if (likedBy.includes(username)) {
                    setUserLiked(true);
                }
            }
            else {
                console.log("No Username Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onLike = async () => {
        if (!likedArr.includes(username)) {
            await updateDoc (doc(db, "forum", title), {
                likedBy: arrayUnion(username)
            })
            likedArr.push(username)
            setUserLiked(true)
        }
        else if (likedArr.includes(username)) {
            await updateDoc (doc(db, "forum", title), {
                likedBy: arrayRemove(username)
            })
            const arrFilter = likedArr.filter(item => item !== username)
            setLikedArr(arrFilter)
            setUserLiked(false)
        }
    }


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

    useFocusEffect(React.useCallback(async ()=> {
        getEmail();
        getUsername();
    }, []));    

    const onShare = async () => {
        try {
            await Share.share({message:`Check out this amazing post - ${title} I found on TripAid!  
                ${title} title: ${title} 
                Download the App here: URL`})
        }
        catch (error) {
            console.log(error);
        }
    }

    const ItemView = ({item}) => {
        return (
            <TouchableHighlight
                underlayColor="#C8c9c9"
                onPress={() => {navigation.navigate('Edit Reply', {title : item.title, description: item.description,
                 section: item.section, comment_id: item.comment_id, addedBy: item.addedBy, datetime: item.datetime, email: email})}}>
                <View style={styles.list}>
                    <Text>{item.addedBy}</Text>
                    <Text>{item.description}</Text>
                </View>
            </TouchableHighlight>
        )
       }

    if (addedBy == username) {
        return(
            <View style={styles.threadContainer}>
                <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>

                {/* Header */}
                <Text style={styles.Heading}>{JSON.stringify(title).replace(/"/g,"")}</Text>

                {/* buttons */}
                <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.buttonSmall}  onPress={() => {navigation.navigate('Edit Post', {title : title, description: description,
                            section: section, addedBy: addedBy})}}>
                    <Text style={styles.buttonSmallListText}>Edit</Text>
                </TouchableOpacity>
            </View>

                {/* details */}
                <Text style={styles.textNB}>Section: {JSON.stringify(section).replace(/"/g,"")}</Text>
                <Text style={styles.textNB}>Posted: {Moment(datetime.toDate()).fromNow()} {"\n"}</Text>
                <Text style={styles.textNB}>Description: {JSON.stringify(description).replace(/"/g,"")}</Text>
                
                {/* buttons */}
                <View style={{ flexDirection:"row" }}>
                        <TouchableOpacity style={[styles.buttonSmall, {opacity: registeredButton ? 0.3 : 1}]}
                        disabled ={registeredButton} onPress={() => onLike()}>
                                <Text style={styles.buttonSmallText}>{userLiked ? 'Liked' : 'Like'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttonSmall, {opacity: registeredButton ? 0.3 : 1}]} 
                        disabled ={registeredButton} onPress={() => {navigation.navigate('Create Reply', {title : title})}}>
                                <Text style={styles.buttonSmallText}>Comment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonSmall} onPress={() => onShare()}>
                                <Text style={styles.buttonSmallText}>Share</Text>
                        </TouchableOpacity>
                        </View>

                {/* FlatList -- replies */}
                
                    <FlatList
                        data={reply}
                        renderItem={ItemView}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    </ScrollView>
            </View>
        )
            } else {
            
                return(
                    <View style={styles.threadContainer}>
                        <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>
            
                        {/* Header */}
                        <Text style={styles.Heading}>{JSON.stringify(title).replace(/"/g,"")}</Text>
            
                        {/* buttons */}
                        <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={[styles.buttonSmall, {opacity: registeredButton ? 0.3 : 1}]}  
                        disabled ={registeredButton} onPress={() => report("Forum Post", addedBy, title, email)}>
                            <Text style={styles.buttonSmallListText}>Report</Text>
                        </TouchableOpacity>
                        </View>
            
                        {/* details */}
                        <Text style={styles.textNB}>Section: {JSON.stringify(section).replace(/"/g,"")}</Text>
                        <Text style={styles.textNB}>Posted: {Moment(datetime.toDate()).fromNow()} {"\n"}</Text>
                        <Text style={styles.textNB}>{JSON.stringify(description).replace(/"/g,"")}</Text>
                        
                        {/* buttons */}
                        <View style={{ flexDirection:"row" }}>
                                <TouchableOpacity style={[styles.buttonSmall, {opacity: registeredButton ? 0.3 : 1}]}
                                disabled ={registeredButton} onPress={() => onLike()}>
                                        <Text style={styles.buttonSmallText}>Like</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buttonSmall, {opacity: registeredButton ? 0.3 : 1}]} 
                                disabled ={registeredButton} onPress={() => {navigation.navigate('Create Reply', {title : title})}}>
                                        <Text style={styles.buttonSmallText}>Comment</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonSmall} onPress={() => onShare()}>
                                        <Text style={styles.buttonSmallText}>Share</Text>
                                </TouchableOpacity>
                            </View>
            
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
}
