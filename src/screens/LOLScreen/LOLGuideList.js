import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LOLGuideList ({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [guides, setGuides] = useState([]); // Initial empty array of guides
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
    
      const getGuides = async () => {
        const collectionRef = collection(db, "guides")
        const q = query(collectionRef, where('addedBy', '==', email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            guides.push({
                ...doc.data(),
                key: doc.id
            })
        })
        setLoading(false);
      }
    
      useEffect(() => {
        getEmail();
        if (email) {
          getGuides();
        }
      },[email]);

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
        <Text style={styles.HeadingList}>Your Guides</Text>
        <TextInput
            style={styles.inputSearch}
            placeholder='search'
            placeholderTextColor="#aaaaaa"
            underlineColorAndroid="transparent"
            autoCapitalize="sentences"
        />
        <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.buttonListLeft} onPress={() =>
                            navigation.navigate('Add Guide')
                        }>
            <Text style={styles.buttonSmallListText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonListRight} onPress={() => {navigation.navigate('Edit Guides List')}}>
            <Text style={styles.buttonSmallListText}>Edit</Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={guides}
            extraData={guides}
            renderItem={({ item }) => (
        <TouchableHighlight
            underlayColor="#C8c9c9"
            onPress={() => {navigation.navigate('Guide Screen', {name : item.name, location: item.location,
                mrt: item.mrt, tips: item.tips, description: item.description, activityType: item.activityType, images: item.images
                , username: item.username, date: item.date, addedBy: item.addedBy})}}>
        <View style={styles.list}>
          <Text>{item.name}</Text>
        </View>
        </TouchableHighlight>
      )}
    />
        </View>
    )
}
