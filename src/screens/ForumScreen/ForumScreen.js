import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ForumScreen ({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [forum, setForum] = useState([]); // Initial empty array of hotels
    const [writeButton, setWriteButton] = useState(true);

    navigation.addListener('willFocus', () => {

    })

    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setWriteButton(false);
                console.log(email)
            }
            else {
                console.log("No Email Selected at Login")
                setWriteButton(true);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect( async () => {
        const querySnapshot = await getDocs(collection(db, "forum"));
        querySnapshot.forEach(documentSnapshot => {
            forum.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });
        setForum(forum);
        setLoading(false);
    },[])

    useFocusEffect(React.useCallback(async ()=> {
        getEmail();
    }, []));

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
        <Text style={styles.HeadingList}>TripAid</Text>
        <Text style={styles.HeadingList}>Forum</Text>
        <TextInput
            style={styles.inputSearch}
            placeholder='search'
            placeholderTextColor="#aaaaaa"
            underlineColorAndroid="transparent"
            autoCapitalize="sentences"
        />
        <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
             <TouchableOpacity style={[styles.buttonSmallWrite, {opacity: writeButton ? 0.3 : 1}]} 
             disabled={writeButton}
             onPress={() => {navigation.navigate('Create Post')}}>
            <Text style={styles.buttonSmallListText}>Write a post...</Text>
            
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonListLeft}>
            <Text style={styles.buttonSmallListText}>Sort</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonListRight}>
            <Text style={styles.buttonSmallListText}>Browse Forum</Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={forum}
            extraData={forum}
            renderItem={({ item }) => (
        <TouchableHighlight
            underlayColor="#C8c9c9">
        <View style={styles.list}>
          <Text>{item.title}</Text>
        </View>
        </TouchableHighlight>
      )}
    />
        </View>
    )
}
