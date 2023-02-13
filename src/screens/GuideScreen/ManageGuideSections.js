import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
// View all Guide Sections (Business Owner)
export default function ManageGuideSections ({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [section, setSection] = useState([]); // Initial empty array of guide sections
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(section);
    
    useEffect(async () => {
        const querySnapshot = await getDocs(collection(db, "guide sections"));
        querySnapshot.forEach(documentSnapshot => {
            section.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });

        setSection(section);
        setLoading(false);
    }, []);

    const searchFilter = (text) => {
        if (text) {
            const newData = section.filter((item) => {
                const itemData = item.title ? item.title.toUpperCase()
                    : ''.toUpperCase()
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1;
            });
            setfilteredData(newData);
            setSearch(text);
        } else {
            setfilteredData(section);
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
        <Text style={styles.HeadingList}>Guide Section</Text>
        <Text style={styles.HeadingList}>Management</Text>


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
        <TouchableOpacity style={styles.buttonSmall} onPress={() =>
                            navigation.navigate('Add Guide Section')
                        }>
            <Text style={styles.buttonSmallListText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Guide Sections Edit List')}>
            <Text style={styles.buttonSmallListText}>Edit</Text>
            </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Guide Sections Delete List') }>
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
