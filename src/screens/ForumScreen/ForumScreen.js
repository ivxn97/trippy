import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ForumScreen ({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [forum, setForum] = useState([]); // Initial empty array of hotels
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(forum);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [innerDropdownVisible, setInnerDropdownVisible] = useState(false);
    const [postButton, setPostButton] = useState(true)

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

    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setPostButton(false);
                console.log(email)
            }
            else {
                console.log("No Email Selected at Login")
                setPostbutton(true);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useFocusEffect(React.useCallback(async ()=> {
        getEmail();
    }, []));

    useEffect(async () => {
        const querySnapshot = await getDocs(collection(db, "forum"));
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
                underlayColor="#C8c9c9"
                onPress={() => {navigation.navigate('Thread', {title : item.title, description: item.description, section: item.section})}}>
                <View style={styles.list}>
                <Text>{item.title}</Text>
                </View>
            </TouchableHighlight>
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
        <ScrollView>
        <Text style={styles.HeadingList}>TripAid</Text>
        <Text style={styles.HeadingList}>Forum</Text>


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
             <TouchableOpacity style={[styles.buttonSmallWrite, {opacity: postButton ? 0.3 : 1}]}
             onPress={() => {navigation.navigate('Create Post')}} disabled={postButton}>
            <Text style={styles.buttonSmallListText}>Write a post...</Text>
            
            </TouchableOpacity>
                {!sortBy && (
                    <TouchableOpacity style={styles.buttonListLeft} onPress={openDropdown}>
                        <Text style={styles.buttonSmallListText}>Sort</Text>
                    </TouchableOpacity>
                )}
                {sortBy && !sortOrder && (
                    <TouchableOpacity style={styles.buttonListLeft} onPress={openInnerDropdown}>
                        <Text style={styles.buttonSmallListText} >Sort by {sortBy}</Text>
                    </TouchableOpacity>
                )}
                {sortBy && sortOrder && (
                    <TouchableOpacity style={styles.buttonListLeft} onPress={openDropdown}>
                        <Text style={styles.buttonSmallListText}>Sort</Text>
                    </TouchableOpacity>
                )}
                {dropdownVisible && (
                    <FlatList
                        data={['title', 'section']}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSortChange(item)}>
                                <Text>Sort by {item}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item}
                    />
                )}
                {innerDropdownVisible && (
                    <FlatList
                        data={['asc', 'desc']}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSortChange(item)}>
                                <Text>{item}ending</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item}
                    />
                )}
            <TouchableOpacity style={styles.buttonListRight} onPress={() => navigation.navigate('Forum Sections')}>
            <Text style={styles.buttonSmallListText}>Browse Sections</Text>
            </TouchableOpacity>
        </View>


        {/* FlatList */}
        <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ItemView}
        />
        </ScrollView>
        </View>
    )
}
