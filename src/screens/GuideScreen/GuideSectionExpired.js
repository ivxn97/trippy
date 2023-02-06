import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableHighlight, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { ScrollView } from 'react-native-gesture-handler';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function GuideSectionExpired ({ route, navigation }) {
    const {sectionName} = route.params;
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [guide, setGuide] = useState([]); // Initial empty array
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(guide);
    const [postButton, setPostButton] = useState(true)

    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [sortIsPressed, setSortIsPressed] = useState(false);
    const [sortByData, setSortByData] = useState();
    const [sortOrderData, setSortOrderData] = useState();
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");


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
                console.log("Invalid role for posting")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useFocusEffect(React.useCallback(async ()=> {
        getRole();
    }, []));

    const getGuidePosts = async () => {
        const collectionRef = collection(db, "guides")
        console.log("Section Name:", sectionName)
        const q = query(collectionRef, where('section', '==', sectionName), where('expired', '==', true));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            guide.push({
                ...doc.data(),
                key: doc.id
            })
        })
        setLoading(false);
    }

    useEffect(() => {
        getGuidePosts();
    }, [guide]);

    useEffect(async () => {
        const sortByChoice = ["name", "location"];
        const sortByResult = sortByChoice.map(attributeName => ({
            name: attributeName,
            value: attributeName,
            isChecked: false
        }));
        const sortOrderChoice = ["asc", "desc"];
        const sortOrderResult = sortOrderChoice.map(attributeName => ({
            name: attributeName,
            value: attributeName,
            isChecked: false
        }));

        setSortByData(sortByResult);
        setSortOrderData(sortOrderResult);
    }, []);

    const searchFilter = (text) => {
        if (text) {
            const newData = guide.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase()
                    : ''.toUpperCase()
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1;
            });
            setfilteredData(newData);
            setSearch(text);
        } else {
            setfilteredData(guide);
            setSearch(text);
        }
       }

       const ItemView = ({item}) => {
        return (
            <TouchableHighlight
                underlayColor="#C8c9c9"
                onPress={() => {navigation.navigate('Guide Screen', {name : item.name, location: item.location,
                     mrt: item.mrt, tips: item.tips, description: item.description, activityType: item.activityType, username: item.username})}}>
                <View style={styles.list}>
                <Text>{item.name}</Text>
                <Text>Posted By {item.username}</Text>
                </View>
            </TouchableHighlight>
        )
       }

    const onPressSort = () => {
        const sortByDataIsTrue = sortByData.every(({ isChecked }) => isChecked)
        const sortOrderIsTrue = sortOrderData.every(({ isChecked }) => isChecked)
        if (sortByDataIsTrue) { sortByData.map(item => item.isChecked = false) }
        if (sortOrderIsTrue) { sortOrderData.map(item => item.isChecked = false) }
        setSortIsPressed(!sortIsPressed);
        setSortModalVisible(!sortModalVisible)
    }



    const sortToggleButton = (sort) => {
        sortByData.map((item) => {
            if (sort.name === item.name) {
                if (item.isChecked) {
                    item.isChecked = false;
                } else {
                    sortByData.map(item => item.isChecked = false);
                    item.isChecked = true;
                }
                setSortIsPressed(!sortIsPressed);
                setSortBy(item.name)
            }
        })
        sortOrderData.map((item) => {
            if (sort.name === item.name) {
                if (item.isChecked) {
                    item.isChecked = false;
                } else {
                    sortOrderData.map(item => item.isChecked = false);
                    item.isChecked = true;
                }
                setSortIsPressed(!sortIsPressed);
                setSortOrder(item.name)
            }
        })
    }

    async function onSubmitSort() {
        const sortByDataIsFalse = sortByData.every(({ isChecked }) => !isChecked)
        const sortOrderDataIsFalse = sortOrderData.every(({ isChecked }) => !isChecked)

        if (sortByDataIsFalse) {
            sortByData.map(item => item.isChecked = true);
        }

        if (sortOrderDataIsFalse) {
            sortOrderData.map(item => item.isChecked = true);
        }
        setSortModalVisible(!sortModalVisible)
        const sortedArray = await sortFiles(filteredData, sortBy, sortOrder);
        setfilteredData(sortedArray);
        setSortBy("");
        setSortOrder("");
        sortByData.map(item => item.isChecked = false); // set all to false
        sortOrderData.map(item => item.isChecked = false); // set all to false
    }

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
        <Text style={styles.HeadingList}>{sectionName} Guides (Expired)</Text>

        {/* Search Bar */}

        <TextInput
            style={styles.inputSearch}
            value={search}
            placeholder="Search Guide"
            underlineColorAndroid="transparent"  
            onChangeText={(text) => searchFilter(text)}              
        />



        {/* Buttons */}

        <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
             <TouchableOpacity style={[styles.buttonSmallWrite, {opacity: postButton ? 0.3 : 1}]}
             onPress={() => {navigation.navigate('Add Guide')}} disabled={postButton}>
            <Text style={styles.buttonSmallListText}>Write a post...</Text>
            
            </TouchableOpacity>
                <TouchableOpacity style={styles.buttonListRight} onPress={() => onPressSort()}>
                    <Text style={styles.buttonSmallListText}>Sort</Text>
                </TouchableOpacity>
        </View>

        {/* FlatList */}
        <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ItemView}
        />
            {sortModalVisible && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={sortModalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setSortModalVisible(!sortModalVisible);
                    }}>
                    <View style={modal.centeredView}>
                        <View style={modal.modalView}>
                            <Text style={modal.modalText}>Sort By</Text>
                            <View style={modal.buttonView}>
                                {sortByData
                                    //.filter((item) => !checked || item.checked)
                                    .map((item, index) => (
                                        <View style={styles.checklist} key={index}>
                                            <TouchableHighlight
                                                onPress={() => sortToggleButton(item)}
                                                style={item.isChecked ? modal.buttonPressed : modal.button}>
                                                <Text>{item.name}</Text>
                                            </TouchableHighlight>
                                        </View>
                                    ))}
                            </View>

                            <Text style={modal.modalText}>Sort Order</Text>
                            <View style={modal.buttonView}>
                                {sortOrderData
                                    //.filter((item) => !checked || item.checked)
                                    .map((item, index) => (
                                        <View style={styles.checklist} key={index}>
                                            <TouchableHighlight
                                                onPress={() => sortToggleButton(item)}
                                                style={item.isChecked ? modal.buttonPressed : modal.button}>
                                                <Text>{item.name}</Text>
                                            </TouchableHighlight>
                                        </View>
                                    ))}
                            </View>
                            <TouchableHighlight
                                onPress={() => onSubmitSort()}
                                style={modal.button}>
                                <Text>Submit</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    )
}

const modal = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        borderColor: 'grey',
        borderWidth: 2,
        marginRight: 10,
        marginBottom: 10,
    },
    buttonPressed: {
        borderRadius: 20,
        padding: 10,
        borderColor: 'grey',
        backgroundColor: 'lightgrey',
        borderWidth: 2,
        marginRight: 10,
        marginBottom: 10,
    },
    buttonView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});