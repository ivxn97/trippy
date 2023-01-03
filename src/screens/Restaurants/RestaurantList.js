import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import Checkbox from 'expo-checkbox';

export default function RestaurantList( {navigation}) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [restaurants, setRestaurants] = useState([]); // Initial empty array of restaurants
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(restaurants);
    const [checked, setChecked] = useState(false);
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
        setfilteredData(filteredData);
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

  const toggleCheckbox = (typeOfCuisine, type) => {
    setChecked(!typeOfCuisine.checked);
    console.log(checked + ' ' + typeOfCuisine);

    if (checked) {
      const newData = type.filter((item) => {
        if(item.typeOfCuisine === typeOfCuisine) {
          return {...item};
        }
      });
    
    setfilteredData(newData);
    } else {
      setfilteredData(type);
    }
    //console.log(filteredData)
  };
    

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
          <TouchableOpacity style={styles.buttonListLeft}>
            <Text style={styles.buttonSmallListText}>Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonListRight}>
            <Text style={styles.buttonSmallListText}>Filter</Text>
          </TouchableOpacity>
      </View>
      <View>
      {restaurants
        //.filter((item) => !checked || item.checked)
        .map((item, index) => (
          <View style={styles.checklist} key={index}>
              <Checkbox style={styles.checkbox} value={item.checked} onValueChange={() => toggleCheckbox(item.typeOfCuisine, restaurants)} />
              <Text>{item.typeOfCuisine}</Text>
          </View>
      ))}
      </View>
    <FlatList
      data={filteredData}
      extraData={filteredData}
      renderItem={({ item }) => (
        <TouchableHighlight
        underlayColor="#C8c9c9"
        onPress={() => {navigation.navigate('Restaurant Details', {name: item.name, typeOfCuisine: item.typeOfCuisine, 
        price: item.price, ageGroup: item.ageGroup, location: item.location, groupSize: item.groupSize, openingTime: item.openingTime,
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