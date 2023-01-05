import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput, Modal, Button } from 'react-native';
import { doc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getStorage, ref, deleteObject, listAll } from "firebase/storage";
import firebase from 'firebase/app';
import { sortFiles } from '../commonFunctions';
const storage = getStorage();




function Item({ title, onPress }) {
    return (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
}



export default function DeleteDeal({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [items, setItems] = useState([]); // Initial empty array of deals
    const [selectedName, setSelectedName] = useState(null);
    const [showModal, setShowModal] = useState(false);
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

    useEffect(async () => {
        const querySnapshot = await getDocs(collection(db, "deals"));
        querySnapshot.forEach(documentSnapshot => {
            items.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });

        setItems(items);
        setLoading(false);
    }, []);

    const onDelete = (name) => {
        setSelectedName(name);
        setShowModal(true);
    }

    const onConfirmDelete = () => {
        deleteDoc(doc(db, "deals", selectedName));
        deleteFolder(`/deals/${selectedName}/images`)
        setItems((prevItems) => prevItems.filter((item) => item.name !== selectedName));
        setShowModal(false);
    }

    function deleteFolder(path) {
        const listRef = ref(storage, path)
        listAll(listRef)
            .then(dir => {
                dir.items.forEach(fileRef => deleteObject(ref(storage, fileRef)));
                console.log("Files deleted successfully from Firebase Storage");
            })
            .catch(error => console.log(error));
    }

    async function handleSortChange(sort) {
        if (sort === 'asc' || sort === 'desc') {
            setSortOrder(sort);
            setInnerDropdownVisible(false);
            const sortedArray = await sortFiles(items, sortBy, sortOrder);
            setItems(sortedArray)

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
            <TextInput
                style={styles.inputSearch}
                placeholder='search'
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
            />
            <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
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
                        data={['name', 'dealType']}
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
                <TouchableOpacity style={styles.buttonListRight}>
                    <Text style={styles.buttonSmallListText}>Filter</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={items}
                renderItem={({ item }) => (
                    <TouchableHighlight
                        underlayColor="#C8c9c9"attractions
                        onPress={() => onDelete(item.dealname)}>
                        <View style={styles.list}>
                            <Text>{item.dealname}</Text>
                            <Text>{item.dealType}</Text>
                        </View>
                    </TouchableHighlight>
                )}
                keyExtractor={(item) => item.dealname}
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

        </View>
    );
}