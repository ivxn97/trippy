import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';

export default function BORestaurantList( {navigation}) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [restaurants, setRestaurants] = useState([]); // Initial empty array of restaurants
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(restaurants);
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
        onChangeText={(text) => searchFilter(text, restaurants)}
    />
    <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
    <TouchableOpacity style={styles.buttonSmall} onPress={() =>
                        navigation.navigate('Add Restaurant')
                    } >
          <Text style={styles.buttonSmallListText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Restaurant Edit List')}>
          <Text style={styles.buttonSmallListText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Delete Restaurant')}>
          <Text style={styles.buttonSmallListText}>Remove</Text>
        </TouchableOpacity>
    </View>
  <FlatList
      data={filteredData}
      extraData={filteredData}
    renderItem={({ item }) => (
      <TouchableHighlight
      underlayColor="#C8c9c9"
      onPress={() => {navigation.navigate('Details', {name: item.name, typeOfCuisine: item.typeOfCuisine, 
      price: item.price, ageGroup: item.ageGroup, location: item.location, groupSize: item.groupSize, openingTime: item.openingTime,
      closingTime: item.closingTime, menu: item.menu, description: item.description, TNC: item.TNC, language: item.language, activityType: item.activityType})}}>
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