import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function WalkingTourSectionExpired ({ route, navigation }) {
    const {sectionName} = route.params;
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [walkingTour, setWalkingTour] = useState([]); // Initial empty array
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(walkingTour);
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

    const getRole = async () => {
        try {
            const role = await AsyncStorage.getItem('role');
            if (role == "LOL") {
                setPostButton(false);
                console.log(role)
            }
            else {
                console.log("Invalid Role for posting")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useFocusEffect(React.useCallback(async ()=> {
        getRole();
    }, []));

    const getWalkingTourPosts = async () => {
        const collectionRef = collection(db, "walkingtours")
        console.log("Section Name:", sectionName)
        const q = query(collectionRef, where('section', '==', sectionName), where('expired', '==', true));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            walkingTour.push({
                ...doc.data(),
                key: doc.id
            })
        })
        setLoading(false);
    }

    useEffect(() => {
        getWalkingTourPosts();
    }, [walkingTour]);

    const searchFilter = (text) => {
        if (text) {
            const newData = walkingTour.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase()
                    : ''.toUpperCase()
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1;
            });
            setfilteredData(newData);
            setSearch(text);
        } else {
            setfilteredData(walkingTour);
            setSearch(text);
        }
       }

       const ItemView = ({item}) => {
        return (
            <TouchableHighlight
                underlayColor="#C8c9c9"
                onPress={() => {navigation.navigate('Walking Tour Screen', {name : item.name, location: item.location, 
                    tips: item.tips, description: item.description, activityType: item.activityType})}}>
                <View style={styles.list}>
                <Text>{item.name}</Text>
                <Text>Posted By {item.addedBy}</Text>
                </View>
            </TouchableHighlight>
        )
       }

    async function handleSortChange(sort) {
        if (sort === 'asc' || sort === 'desc') {
            setSortOrder(sort);
            setInnerDropdownVisible(false);
            const sortedArray = await sortFiles(walkingTour, sortBy, sortOrder);
            setWalkingTour(sortedArray)

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
        <Text style={styles.HeadingList}>{sectionName} Walking Tours (expired)</Text>

        {/* Search Bar */}

        <TextInput
            style={styles.inputSearch}
            value={search}
            placeholder="Search WalkingTour"
            underlineColorAndroid="transparent"  
            onChangeText={(text) => searchFilter(text)}              
        />

        {/* Buttons */}

        <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
             <TouchableOpacity style={[styles.buttonSmallWrite, {opacity: postButton ? 0.3 : 1}]}
             onPress={() => {navigation.navigate('Add Walking Tour')}} disabled={postButton}>
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
                        data={['name', 'section']}
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
