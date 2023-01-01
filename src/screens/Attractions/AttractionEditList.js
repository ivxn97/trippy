import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';

export default function AttractionEditList( {navigation }) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [attractions, setAttractions] = useState([]); // Initial empty array of attractions
  const [search, setSearch] = useState('');
  const [filteredData, setfilteredData] = useState(attractions);

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
        onChangeText={(text) => searchFilter(text, attractions)}
    />
    <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
        <TouchableOpacity style={styles.buttonListLeft}>
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
        onPress={() => {navigation.navigate('Edit Attraction', {name: item.name, attractionType: item.attractionType, 
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