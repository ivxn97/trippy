import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';

export default function BOAttractionList( {navigation }) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [attractions, setAttractions] = useState([]); // Initial empty array of attractions

  //List
  navigation.addListener('willFocus', () => {
    
  })

  useEffect(async () => {
    const querySnapshot = await getDocs(collection(db, "attractions"));
        querySnapshot.forEach(documentSnapshot => {
          attractions.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setAttractions(attractions);
        setLoading(false);
      },[]);
  
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
    <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
    <TouchableOpacity style={styles.buttonSmall} onPress={() =>
                    navigation.navigate('Add Attraction')
                }>
          <Text style={styles.buttonSmallListText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall}>
          <Text style={styles.buttonSmallListText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall}>
          <Text style={styles.buttonSmallListText}>Remove</Text>
        </TouchableOpacity>
    </View>
    <FlatList
      data={attractions}
      extraData={attractions}
      renderItem={({ item }) => (
        <TouchableHighlight
        underlayColor="#C8c9c9"
        onPress={() => {navigation.navigate('Attraction Details', {name: item.name, attractionType: item.attractionType, 
        price: item.price, ageGroup: item.ageGroup, groupSize: item.groupSize, openingTime: item.openingTime,
        closingTime: item.closingTime, description: item.description, language: item.language, TNC: item.TNC})}}>
        <View style={styles.list}>
          <Text>{item.name}</Text>
          <Text>${item.price}</Text>
        </View>
        </TouchableHighlight>
      )}
    />
    </View>
  );
}