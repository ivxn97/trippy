import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { sortFiles } from '../commonFunctions';

export default function PaidTourList({navigation}) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [paidtours, setPaidtours] = useState([]); // Initial empty array of paid tours
  const [search, setSearch] = useState('');
  const [filteredData, setfilteredData] = useState(paidtours);
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
    const querySnapshot = await getDocs(collection(db, "paidtours"));
        querySnapshot.forEach(documentSnapshot => {
            paidtours.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setPaidtours(paidtours);
        setLoading(false);
      },[]);

  async function handleSortChange(sort) {
    if (sort === 'asc' || sort === 'desc') {
      setSortOrder(sort);
      setInnerDropdownVisible(false);
      const sortedArray = await sortFiles(paidtours, sortBy, sortOrder);
      setPaidtours(sortedArray)

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
        onChangeText={(text) => searchFilter(text, paidtours)}
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
            data={['name', 'tourType']}
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
        onPress={() => {navigation.navigate('Details', {name: item.name, tourType: item.tourType, 
        price: item.price, ageGroup: item.ageGroup, groupSize: item.groupSize, startingTime: item.startingTime,
        endingTime: item.endingTime, duration: item.duration, description: item.description, language: item.language,
        TNC: item.TNC, activityType: item.activityType, addedBy: item.addedBy, timeSlots: item.timeSlots, mapURL: item.mapURL, 
        capacity: item.capacity, address: item.address})}}>
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
