import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';

export default function RestaurantList( {navigation}) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [restaurants, setRestaurants] = useState([]); // Initial empty array of restaurants
   //List
   navigation.addListener('willFocus', () => {
    
})

useEffect(async () => {
  const querySnapshot = await getDocs(collection(db, "restaurants"));
      querySnapshot.forEach(documentSnapshot => {
       restaurants.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });

      setRestaurants(restaurants);
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
        <TouchableOpacity style={styles.buttonListLeft}>
          <Text style={styles.buttonSmallListText}>Sort</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonListRight}>
          <Text style={styles.buttonSmallListText}>Filter</Text>
        </TouchableOpacity>
    </View>
  <FlatList
    data={restaurants}
    extraData={restaurants}
    renderItem={({ item }) => (
      <TouchableHighlight
      underlayColor="#C8c9c9"
      onPress={() => {navigation.navigate('Restaurant Details', {name: item.name, typeOfCuisine: item.typeOfCuisine, 
      price: item.price, ageGroup: item.ageGroup, groupSize: item.groupSize, openingTime: item.openingTime,
      closingTime: item.closingTime, menu: item.menu, description: item.description, TNC: item.TNC, language: item.language})}}>
      <View style={styles.list}>
        <Text>{item.name}</Text>
        <Text>{item.price}</Text>
      </View>
      </TouchableHighlight>
    )}
  />
  </View>
);
}