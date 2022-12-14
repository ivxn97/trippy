import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { sortFiles } from '../commonFunctions';

export default function GuideWTList ({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [guides, setGuides] = useState([]); // Initial empty array of hotels
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(guides);
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
        const querySnapshot = await getDocs(collection(db, "guides"));
        querySnapshot.forEach(documentSnapshot => {
            guides.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });

        setGuides(guides);
        setLoading(false);
    }, []);

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

    async function handleSortChange(sort) {
        if (sort === 'asc' || sort === 'desc') {
            setSortOrder(sort);
            setInnerDropdownVisible(false);
            const sortedArray = await sortFiles(guides, sortBy, sortOrder);
            setGuides(sortedArray)

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
        <Text style={styles.HeadingList}>Guides</Text>
        <Text style={styles.HeadingList}>And</Text>
        <Text style={styles.HeadingList}>Walking Tours</Text>
        <TextInput
            style={styles.inputSearch}
            placeholder='search'
            placeholderTextColor="#aaaaaa"
            underlineColorAndroid="transparent"
            autoCapitalize="sentences"
            value={search}
            onChangeText={(text) => searchFilter(text, guides)}
        />
        <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
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
                        data={['name', 'location']}
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
            <TouchableOpacity style={styles.buttonSmall}>
            <Text style={styles.buttonSmallListText}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSmall}>
            <Text style={styles.buttonSmallListText}>View Expired</Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={filteredData}
            extraData={filteredData}
            renderItem={({ item }) => (
        <TouchableHighlight
            underlayColor="#C8c9c9"
            onPress={() => {navigation.navigate('Details', {name: item.name, location: item.location,
                                                                        mrt: item.mrt, tips: item.tips, description: item.description, activityType: item.activityType})}}>
        <View style={styles.list}>
            <Text>{item.name}</Text>
            <Text>{item.location}</Text>
        </View>
        </TouchableHighlight>
      )}
    />
        </View>
    )
}
