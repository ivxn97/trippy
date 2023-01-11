import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { sortFiles } from '../commonFunctions';

export default function ForumSections ({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [forum, setForum] = useState([]); // Initial empty array of hotels
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(forum);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [innerDropdownVisible, setInnerDropdownVisible] = useState(false);

    function openDropdown() {
        setDropdownVisible(true);
    }

    function closeDropdown() {
        setDropdownVisible(false);
    }

    function openInnerDropdown() {
        setInnerDropdownVisible(true);
    }

    function closeInnerDropdown() {
        setInnerDropdownVisible(false);
    }

    navigation.addListener('willFocus', () => {

    })

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
            <TouchableOpacity
                underlayColor="#C8c9c9"
                onPress={() => navigation.navigate('Section', {sectionName: item.name})}>
                <View style={styles.list}>
                <Text>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )
       }

    async function handleSortChange(sort) {
        if (sort === 'asc' || sort === 'desc') {
            setSortOrder(sort);
            setInnerDropdownVisible(false);
            const sortedArray = await sortFiles(forum, sortBy, sortOrder);
            setForum(sortedArray)

        } else {
            setSortBy(sort);
            setDropdownVisible(false);
            openInnerDropdown();
        }
    }

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
        <Text style={styles.HeadingList}>Forum Sections</Text>

        {/* Search Bar */}

        <TextInput
            style={styles.inputSearch}
            value={search}
            placeholder="Search Forum"
            underlineColorAndroid="transparent"  
            onChangeText={(text) => searchFilter(text)}              
        />

        {/* FlatList */}
    
        <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ItemView}
    />
        </View>
    )
}
