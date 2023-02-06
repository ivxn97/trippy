import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableHighlight, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs} from "firebase/firestore";
import { db } from '../../../config';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ActiveThreadEditList({ navigation }) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [items, setItems] = useState([]); 
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(items);

    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [sortIsPressed, setSortIsPressed] = useState(false);
    const [sortByData, setSortByData] = useState();
    const [sortOrderData, setSortOrderData] = useState();
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    

    //List
    navigation.addListener('willFocus', () => {

    })

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
    const getThreads = async () => {
        const q = query(collection(db, "forum"), where("addedBy", "==", username));
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(documentSnapshot => {
            items.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });
        setItems(items);
        setLoading(false);
    }

    useEffect(() => {
        getUsername()
        if (username) {
            getThreads();
        }
    }, [username]);

    useEffect(async () => {
        const sortByChoice = ["title", "section"];
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

    if (loading) {
        return <ActivityIndicator />;
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

    return (
        <View>
            <TextInput
                style={styles.inputSearch}
                placeholder='search'
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                value={search}
                onChangeText={(text) => searchFilter(text, items)}
            />
            <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.buttonListRight} onPress={() => onPressSort()}>
                    <Text style={styles.buttonSmallListText}>Sort</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonListRight}>
                    <Text style={styles.buttonSmallListText}>Filter</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredData}
                extraData={filteredData}
                renderItem={({ item }) => (
                    <TouchableHighlight
                        underlayColor="#C8c9c9"
                        onPress={() => {
                            navigation.navigate('Edit Thread', {
                                title: item.title, section: item.section, description: item.description
                            })
                        }}>
                        <View style={styles.list}>
                            <Text>{item.title}</Text>
                            <Text>{item.section}</Text>
                        </View>
                    </TouchableHighlight>
                )}
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
    );
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