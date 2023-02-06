import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { sortFiles } from '../commonFunctions';

export default function ManageForumSections ({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [forum, setForum] = useState([]); // Initial empty array of hotels
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(forum);

    useEffect(async () => {
        const querySnapshot = await getDocs(collection(db, "forum sections"));
        querySnapshot.forEach(documentSnapshot => {
            forum.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });

        setForum(forum);
        setLoading(false);
    }, []);

    const searchFilter = (text) => {
        if (text) {
            const newData = forum.filter((item) => {
                const itemData = item.title ? item.title.toUpperCase()
                    : ''.toUpperCase()
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1;
            });
            setfilteredData(newData);
            setSearch(text);
        } else {
            setfilteredData(forum);
            setSearch(text);
        }
       }

       const ItemView = ({item}) => {
        return (
            <TouchableHighlight
                underlayColor="#C8c9c9">
                <View style={styles.list}>
                <Text>{item.name}</Text>
                </View>
            </TouchableHighlight>
        )
       }

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
        <Text style={styles.HeadingList}>Forum Section</Text>
        <Text style={styles.HeadingList}>Management</Text>


        {/* Search Bar */}

        <TextInput
            style={styles.inputSearch}
            value={search}
            placeholder="Search Forum"
            underlineColorAndroid="transparent"  
            onChangeText={(text) => searchFilter(text)}              
        />



        {/* Buttons */}

        <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
        <TouchableOpacity style={styles.buttonSmall} onPress={() =>
                            navigation.navigate('Add Forum Section')
                        }>
            <Text style={styles.buttonSmallListText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Forum Sections Edit List')}>
            <Text style={styles.buttonSmallListText}>Edit</Text>
            </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Forum Sections Delete List')}>
            <Text style={styles.buttonSmallListText}>Delete</Text>
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
