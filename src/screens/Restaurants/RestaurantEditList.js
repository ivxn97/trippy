import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RestaurantEditList( {navigation}) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [restaurants, setRestaurants] = useState([]); // Initial empty array of restaurants
  const [search, setSearch] = useState('');
  const [filteredData, setfilteredData] = useState(restaurants);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [innerDropdownVisible, setInnerDropdownVisible] = useState(false);
  const [email, setEmail] = useState('');

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

  const getEmail = async () => {
    try {
        const email = await AsyncStorage.getItem('email');
        if (email !== null) {
            setEmail(email);
        }
        else {
            console.log("No Email Selected at Login")
        }
    } catch (error) {
        console.log(error)
    }
  }

  const getRestaurants = async () => {
    const collectionRef = collection(db, "restaurants")
    const q = query(collectionRef, where('addedBy', '==', email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        restaurants.push({
            ...doc.data(),
            key: doc.id
        })
    })
    setLoading(false);
  }

  useEffect(() => {
        getEmail();
        if (email) {
          getRestaurants();
        }
  },[email]);

  async function handleSortChange(sort) {
    if (sort === 'asc' || sort === 'desc') {
      setSortOrder(sort);
      setInnerDropdownVisible(false);
      const sortedArray = await sortFiles(restaurants, sortBy, sortOrder);
      setRestaurants(sortedArray)

    } else {
      setSortBy(sort);
      setDropdownVisible(false);
      openInnerDropdown();
    }
  }

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
            data={['name', 'typeOfCuisine']}
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
        onPress={() => {navigation.navigate('Edit Restaurant', {name: item.name, typeOfCuisine: item.typeOfCuisine, 
          price: item.price, ageGroup: item.ageGroup, location: item.location, groupSize: item.groupSize, openingTime: item.openingTime,
          closingTime: item.closingTime, menu: item.menu, description: item.description, TNC: item.TNC, language: item.language
          , activityType: item.activityType, review: item.review, addedBy: item.addedBy, timeSlots: item.timeSlots, mapURL: item.mapURL, 
          capacity: item.capacity, address: item.address, images: item.images})}}>
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