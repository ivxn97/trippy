import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Walking Tours List for LOL
export default function LOLWalkingToursList ({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [walkingtours, setWalkingTours] = useState([]); 
    const [email, setEmail] = useState('');

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
    
      const getWalkingTours = async () => {
        const collectionRef = collection(db, "walkingtours")
        const q = query(collectionRef, where('addedBy', '==', email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            walkingtours.push({
                ...doc.data(),
                key: doc.id
            })
        })
        setLoading(false);
      }
    
      useEffect(() => {
        getEmail();
        if (email) {
          getWalkingTours();
        }
      },[email]);

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
        <Text style={styles.HeadingList}>Walking Tours</Text>
        <TextInput
            style={styles.inputSearch}
            placeholder='search'
            placeholderTextColor="#aaaaaa"
            underlineColorAndroid="transparent"
            autoCapitalize="sentences"
        />
        <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.buttonListLeft} onPress={() =>
                            navigation.navigate('Add Walking Tour')
                        }>
            <Text style={styles.buttonSmallListText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonListRight} onPress={() =>
                            navigation.navigate('Edit Walking Tours List')
                        }>
            <Text style={styles.buttonSmallListText}>Edit</Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={walkingtours}
            extraData={walkingtours}
            renderItem={({ item }) => (
        <TouchableHighlight
            underlayColor="#C8c9c9"
            onPress={() => {navigation.navigate('Walking Tour Screen', {name : item.name, location: item.location, 
                tips: item.tips, description: item.description, activityType: item.activityType, images: item.images,
                username: item.username, date: item.date, addedBy: item.addedBy})}}>
        <View style={styles.list}>
          <Text>{item.name}</Text>
        </View>
        </TouchableHighlight>
      )}
    />
        </View>
    )
}
