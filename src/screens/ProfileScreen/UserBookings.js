import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableHighlight, TouchableOpacity, TextInput, Alert, StyleSheet, Modal } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserBookings ({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState();
    const [isPressed, setIsPressed] = useState (false);
    const [email, setEmail] = useState('');
    const [bookings, setBookings] = useState([]);

    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [sortIsPressed, setSortIsPressed] = useState(false);
    const [sortByData, setSortByData] = useState();
    const [sortOrderData, setSortOrderData] = useState();
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setEmail(email);
                console.log(email)
            }
            else {
                console.log("No Email Selected at Login")
                setRegisteredButton(true);
    
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getBookings = async () => {
        const collectionRef = collection(db, "bookings")
        const q = query(collectionRef, where('bookedBy', '==', email), where('expired', '==', false));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            bookings.push({
                ...doc.data(),
                key: doc.id
            })
        })
        setfilteredData(bookings)
        setLoading(false);
        console.log(bookings)
    }

    useEffect(() => {
        getEmail();
        if (email) {
            getBookings();
        }
    }, [email]);

    useEffect(async () => {
        const sortByChoice = ["name"];
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

    const onPressExpired = () => {
        navigation.navigate('User Previous Bookings', {email: email})
    }

    const searchFilter = (text, type) => {
        if (text) {
            const newData = type.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase()
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
    
    const ItemView = ({item}) => {
        return (
            <TouchableOpacity
                underlayColor="#C8c9c9"
                onPress={() => navigation.navigate('Booking Details', {date: item.date, orgPrice: item.orgPrice, 
                    discount: item.discount, finalPrice: item.finalPrice, groupSize: item.groupSize, id: item.id, 
                    name: item.name, time: item.time, email: item.bookedBy})}>
                <View style={styles.list}>
                <Text>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
        <Text style={styles.HeadingList}>Your</Text>
        <Text style={styles.HeadingList}>Bookings</Text>
        <TextInput
        style={styles.inputSearch}
        placeholder='search'
        placeholderTextColor="#aaaaaa"
        underlineColorAndroid="transparent"
        autoCapitalize="sentences"
        value={search}
        onChangeText={(text) => searchFilter(text, bookings)}
        />

        {/* Buttons */}
        <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.buttonListRight} onPress={() => onPressSort()}>
                <Text style={styles.buttonSmallListText}>Sort</Text>
            </TouchableOpacity> 
            <TouchableOpacity 
            style={[styles.buttonSmall, {height:35, width:200}]}
            onPress={() => onPressExpired()}>
            <Text style={styles.text}>View Previous Bookings</Text>
            </TouchableOpacity>
        </View>
        
        {/* Flatlist */}
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