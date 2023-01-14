import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ForumScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [forum, setForum] = useState([]); // Initial empty array of hotels
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    
    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                const [username, website] = email.split("@")
                setUsername(username);
            }
            else {
                console.log("No Email Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        getEmail();
    }, []);

    

    navigation.addListener('willFocus', () => {

    })

    

    useEffect(async () => {
        if (username === '') {
            console.log('Username is empty');
        }
        const querySnapshot = await getDocs(collection(db, "forum"));
        querySnapshot.forEach(documentSnapshot => {
            if (documentSnapshot.data().addedBy === username) {
                filteredData.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
            }
        });

        setFilteredData(filteredData)
        setLoading(false);
    }, []);

    

    const ItemView = ({ item }) => {
        return (
            <TouchableHighlight
                underlayColor="#C8c9c9">
                <View style={styles.list}>
                    <Text>{item.title}</Text>
                </View>
            </TouchableHighlight>
        )
    }

   

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
            <Text style={styles.HeadingList}>TripAid</Text>
            <Text style={styles.HeadingList}>Forum</Text>


            {/* Search Bar */}

            <TextInput
                style={styles.inputSearch}
                placeholder='search'
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                value={search}
                onChangeText={(text) => searchFilter(text, users)}
            />



            {/* Buttons */}

            <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Hotel Edit List')}>
                    <Text style={styles.buttonSmallListText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall} onPress={() =>
                    navigation.navigate('Delete Hotel')}>
                    <Text style={styles.buttonSmallListText}>Remove</Text>
                </TouchableOpacity>
                
            </View>


            {/* FlatList */}

            <FlatList
                data={filteredData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ItemView}
            />
        </View>
    )
}
