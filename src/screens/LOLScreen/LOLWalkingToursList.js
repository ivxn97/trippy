import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';


export default function LOLWalkingToursList ({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [walkingtours, setWalkingTours] = useState([]); // Initial empty array of hotels

    navigation.addListener('willFocus', () => {

    })

    useEffect(async () => {
        const querySnapshot = await getDocs(collection(db, "walkingtours"));
        querySnapshot.forEach(documentSnapshot => {
            walkingtours.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });

        setWalkingTours(walkingtours);
        setLoading(false);
    }, []);

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
        <Text style={styles.HeadingList}>Walking Tours</Text>
        <TextInput
            style={styles.inputSearch}
            placeholder='search'
            placeholderTextColor="#aaaaaa"
            underlineColorAndroid="transparent"
            autoCapitalize="sentences"
        />
        <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.buttonListLeft} onPress={() =>
                            navigation.navigate('Add Walking Tour')
                        }>
            <Text style={styles.buttonSmallListText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonListRight}>
            <Text style={styles.buttonSmallListText}>Edit</Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={walkingtours}
            extraData={walkingtours}
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
