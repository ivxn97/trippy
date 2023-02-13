import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableHighlight, TouchableOpacity, TextInput, Modal, Button, ScrollView } from 'react-native';
import { doc, getDoc, collection, getDocs, deleteDoc, query, where } from "firebase/firestore";
import { db } from '../../../config';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getStorage, ref, deleteObject, listAll } from "firebase/storage";
import firebase from 'firebase/app';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
const storage = getStorage();

export default function AdminDeleteGuides({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [items, setItems] = useState([]); // Initial empty array of guides
    const [selectedName, setSelectedName] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(items);

    // Get User email from Async Storage 
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

    // Get All Guides from Firestore Database
    const getGuides = async () => {
        const querySnapshot = await getDocs(collection(db, "guides"));
        querySnapshot.forEach((doc) => {
            items.push({
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
    }, [email]);



    const onDelete = (name) => {
        setSelectedName(name);
        setShowModal(true);
    }

    // Delete Selected Guides from Firestore Database and Delete its Images from Firebase Storage
    const onConfirmDelete = () => {
        deleteDoc(doc(db, "guides", selectedName));
        deleteFolder(`/guides/${selectedName}/images`)
        setItems((prevItems) => prevItems.filter((item) => item.name !== selectedName));
        setShowModal(false);
    }
    // Delete Images from Firebase Storage 
    function deleteFolder(path) {
        const listRef = ref(storage, path)
        listAll(listRef)
            .then(dir => {
                dir.items.forEach(fileRef => deleteObject(ref(storage, fileRef)));
                console.log("Files deleted successfully from Firebase Storage");
            })
            .catch(error => console.log(error));
    }

    if (loading) {
        return <ActivityIndicator />;
    }

    // Handles Search 
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
            <ScrollView>
                <Text style={styles.HeadingList}>Delete Guides</Text>
                <TextInput
                    style={styles.inputSearch}
                    placeholder='search'
                    placeholderTextColor="#aaaaaa"
                    underlineColorAndroid="transparent"
                    autoCapitalize="sentences"
                    value={search}
                    onChangeText={(text) => searchFilter(text, items)}
                />

                <FlatList
                    data={filteredData}
                    extraData={filteredData}
                    renderItem={({ item }) => (
                        <TouchableHighlight
                            underlayColor="#C8c9c9"
                            onPress={() => onDelete(item.name)}>
                            <View style={styles.list}>
                                <Text>{item.name}</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                    keyExtractor={(item) => item.name}
                />

                <Modal visible={showModal}>
                    <View style={styles.container}>
                        <Text style={styles.message}>Are you sure you want to delete this data?</Text>
                        <View style={styles.buttonContainer}>
                            <Button title="Confirm" onPress={onConfirmDelete} />
                            <View style={styles.space} />
                            <Button title="Cancel" onPress={() => setShowModal(false)} />

                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
}