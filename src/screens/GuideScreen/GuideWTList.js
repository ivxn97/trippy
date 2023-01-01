import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';

export default function GuideWTList ({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [guides, setGuides] = useState([]); // Initial empty array of hotels
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(guides);

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
            <TouchableOpacity style={styles.buttonSmall}>
            <Text style={styles.buttonSmallListText}>Sort</Text>
            </TouchableOpacity>
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
            onPress={() => {navigation.navigate('Guide Screen', {name: item.name, location: item.location,
                                                                        mrt: item.mrt, tips: item.tips, description: item.description})}}>
        <View style={styles.list}>
          <Text>{item.name}</Text>
        </View>
        </TouchableHighlight>
      )}
    />
        </View>
    )
}
