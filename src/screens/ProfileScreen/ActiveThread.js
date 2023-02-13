import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ActiveThread({ navigation }) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [items, setItems] = useState([]); 
    const [forum, setForum] = useState([]); // Initial empty array of forums
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(items);
    
    const getUsername = async () => {
        try {
            const username = await AsyncStorage.getItem('username');
            if (username !== null) {
                setUsername(username);
            }
            else {
                console.log("No username Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }

    // get forum posts where it was added by user
    const getThreads = async() => {
        const q = query(collection(db, "forum"), where("addedBy", "==", username));
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(documentSnapshot => {
            items.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });
        setItems(items);
        console.log(items.length)
        setLoading(false);
    }

    useEffect(() => {
        getUsername()
        if (username) {
            getThreads();
        }
    }, [username]);

    
    if (loading) {
        return <ActivityIndicator />;
    }
    
    const ItemView = ({ item }) => {
        return (
            <TouchableHighlight
                underlayColor="#C8c9c9"
                onPress={() => { navigation.navigate('Thread', {title : item.title, description: item.description, 
                    section: item.section, addedBy: item.addedBy, likedBy: item.likedBy, datetime: item.datetime}) }}>
                <View style={styles.list}>
                    <Text>{item.title}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    const searchFilter = (text, type) => {
        if (text) {
            const newData = type.filter((item) => {
                const itemData = item.title ? item.title.toUpperCase()
                    : ''.toUpperCase()
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1;
            });
            setfilteredData(newData);
            setSearch(text);
        } else {
            setfilteredData(type);
            setSearch(text);
        }
    }

    return (
        <View>
            <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>
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
                onChangeText={(text) => searchFilter(text, items)}
            />



            {/* Buttons */}

            <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Edit Thread List')}>
                    <Text style={styles.buttonSmallListText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall} onPress={() =>
                    navigation.navigate('Delete Thread')}>
                    <Text style={styles.buttonSmallListText}>Remove</Text>
                </TouchableOpacity>
                
            </View>


            {/* FlatList */}

            <FlatList
                data={filteredData}
                extraData = {filteredData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ItemView}
            />
        </ScrollView>
        </View>
    )
}
