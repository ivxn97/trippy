import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import Checkbox from 'expo-checkbox';
import { sortFiles } from '../commonFunctions';

export default function RestaurantList( {navigation}) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [restaurants, setRestaurants] = useState([]); // Initial empty array of restaurants
  const [search, setSearch] = useState('');
  const [filteredData, setfilteredData] = useState(restaurants);
  const [reducedType, setReducedType] = useState();
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

        const typesOf = restaurants.map(item => ({
          name: item.typeOfCuisine,
          isChecked: false
      }))
    
      const reducedTypes = typesOf.filter((item, index) => {
        return typesOf.findIndex((otherItem) => otherItem.name === item.name) === index;
      });

        setRestaurants(restaurants);
        setfilteredData(filteredData);
        setReducedType(reducedTypes);
        setLoading(false);
      },[]);
      
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

  const toggleCheckbox = (filters, type) => {
    setReducedType(prevState => {
      return prevState.map(status => {
        if (filters.name === status.name) {
          if (status.isChecked == false) {
            const newData = type.filter((item) => {
              if(item.typeOfCuisine === filters.name) {
                return {...item};
              }
            });
            setfilteredData(newData);
            return {...status, isChecked: true};
          } 
          else if (status.isChecked == true) {
            setfilteredData(type);
            return {...status, isChecked: false}
          }
        }
        return status;
      });
    });
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
      <View>
      {reducedType
        //.filter((item) => !checked || item.checked)
        .map((item, index) => (
          <View style={styles.checklist} key={index}>
              <Checkbox style={styles.checkbox} value={item.isChecked} onValueChange={() => toggleCheckbox(item, restaurants)} />
              <Text>{item.name}</Text>
          </View>
      ))}
      </View>
    <FlatList
      data={filteredData}
      extraData={filteredData}
      renderItem={({ item }) => (
        <TouchableHighlight
        underlayColor="#C8c9c9"
        onPress={() => {navigation.navigate('Details', {name: item.name, typeOfCuisine: item.typeOfCuisine, 
        price: item.price, ageGroup: item.ageGroup, location: item.location, groupSize: item.groupSize, openingTime: item.openingTime,
        closingTime: item.closingTime, menu: item.menu, description: item.description, TNC: item.TNC, language: item.language
        , activityType: item.activityType, review: item.review})}}>
        <View style={styles.list}>
          <Text>{item.name}</Text>
          <Text>{item.typeOfCuisine}</Text>
        </View>
        </TouchableHighlight>
      )}
    />
    </View>
  );
}