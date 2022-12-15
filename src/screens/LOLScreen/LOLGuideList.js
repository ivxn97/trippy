import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';


export default function LOLGuideList ({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [guides, setGuides] = useState([]); // Initial empty array of hotels

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

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
        <Text style={styles.HeadingList}>Guides</Text>
        <TextInput
            style={styles.inputSearch}
            placeholder='search'
            placeholderTextColor="#aaaaaa"
            underlineColorAndroid="transparent"
            autoCapitalize="sentences"
        />
        <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.buttonListLeft} onPress={() =>
                            navigation.navigate('Add Guide')
                        }>
            <Text style={styles.buttonSmallListText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonListRight}>
            <Text style={styles.buttonSmallListText}>Edit</Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={guides}
            extraData={guides}
            renderItem={({ item }) => (
        <TouchableHighlight
            underlayColor="#C8c9c9"
            onPress={() => {navigation.navigate('Guide Screen', {title: item.title, location: item.location,
                                                                        mrt: item.mrt, tips: item.tips, description: item.description})}}>
        <View style={styles.list}>
          <Text>{item.title}</Text>
        </View>
        </TouchableHighlight>
      )}
    />
        </View>
    )
}
