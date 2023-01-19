import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity, Modal, TouchableHighlight, StyleSheet } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import styles from './styles';
import Checkbox from 'expo-checkbox';
import { sortFiles } from '../commonFunctions';
import { check } from 'leo-profanity';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [checkboxFilter, setCheckboxFilter] = useState([]);

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
        console.log(restaurants);

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

  const toggleButton = (filters) => {
    reducedType.map((item) => {
      if (filters.name === item.name) {
        item.isChecked = !item.isChecked;
        setIsPressed(!isPressed);
      }
    })
    //console.log(reducedType);
  }

  const onSubmitFilter = () => {
    setModalVisible(!modalVisible)
    reducedType.map ((item) => {
      const allIsFalse = reducedType.every(({ isChecked }) => !isChecked)
      const allIsTrue = reducedType.every(({ isChecked }) => isChecked)
      if (item.isChecked) {
        if(!checkboxFilter.includes(item.name)) {
          checkboxFilter.push(item.name);
        }
        //
      } else if (item.isChecked === false) {
        if(checkboxFilter.includes(item.name)) {
          const index = checkboxFilter.indexOf(item.name);
          checkboxFilter.splice(index, 1);
        }
      } 
    })
    
    if(checkboxFilter?.length > 0) {
      const newData = restaurants.filter(item => checkboxFilter.includes(item.typeOfCuisine));
      setfilteredData(newData);
    } else {
      setfilteredData(restaurants);
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
          <TouchableOpacity style={styles.buttonListRight} onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.buttonSmallListText}>Filter</Text>
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
        closingTime: item.closingTime, menu: item.menu, description: item.description, TNC: item.TNC, language: item.language
        , activityType: item.activityType, review: item.review})}}>
        <View style={styles.list}>
          <Text>{item.name}</Text>
          <Text>{item.typeOfCuisine}</Text>
        </View>
        </TouchableHighlight>
      )}
    />





      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={modal.centeredView}>
          <View style={modal.modalView}>
            <Text style={modal.modalText}>Type Of Cuisine</Text>
            <View style={modal.buttonView}>
            {reducedType
              //.filter((item) => !checked || item.checked)
              .map((item, index) => (
                <View style={styles.checklist} key={index}>
                    <TouchableHighlight 
                    onPress={() => toggleButton(item)}
                    style={item.isChecked? modal.buttonPressed : modal.button}>
                      <Text>{item.name}</Text>
                    </TouchableHighlight>
                </View>
            ))}
            </View>
            <TouchableHighlight 
                    onPress={() => onSubmitFilter()}
                    style={modal.button}>
                      <Text>Submit</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const modal = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    borderColor: 'grey',
    borderWidth: 2,
    marginRight: 10,
    marginBottom: 10,
  },
  buttonPressed: {
    borderRadius: 20,
    padding: 10,
    borderColor: 'grey',
    backgroundColor: 'lightgrey',
    borderWidth: 2,
    marginRight: 10,
    marginBottom: 10,
  },
  buttonView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});