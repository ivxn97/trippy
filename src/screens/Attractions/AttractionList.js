import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput, TouchableHighlight, StyleSheet, Modal } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import styles from './styles';
import { sortFiles } from '../commonFunctions';

export default function AttractionList( {navigation }) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [attractions, setAttractions] = useState([]); // Initial empty array of attractions
  const [search, setSearch] = useState('');
  const [filteredData, setfilteredData] = useState(attractions);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [innerDropdownVisible, setInnerDropdownVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [checkboxFilter, setCheckboxFilter] = useState([]);
  const [typesOfAttraction, setTypesOfAttraction] = useState();

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
    const querySnapshot = await getDocs(collection(db, "attractions"));
        querySnapshot.forEach(documentSnapshot => {
          attractions.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

    const allTypeOfAttraction = attractions.map(item => ({
      name: item.attractionType,
      isChecked: false,
    }))

    const reducedType = allTypeOfAttraction.filter((item, index) => {
      return allTypeOfAttraction.findIndex((otherItem) => otherItem.name === item.name) === index;
    })
    console.log(reducedType);

        setTypesOfAttraction(reducedType);
        setAttractions(attractions);
        setLoading(false);
      },[]);
  
  async function handleSortChange(sort) {
    if (sort === 'asc' || sort === 'desc') {
      setSortOrder(sort);
      setInnerDropdownVisible(false);
      const sortedArray = await sortFiles(attractions, sortBy, sortOrder);
      setAttractions(sortedArray)

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

  const onPressFilter =() => {
    const allTypeIsTrue = typesOfAttraction.every(({ isChecked }) => isChecked)
    if (allTypeIsTrue) {typesOfAttraction.map(item => item.isChecked = false)}
    setIsPressed(!isPressed);
    setModalVisible(!modalVisible)
  }

  const toggleButton = (filters) => {
    typesOfAttraction.map((item) => {
      if (filters.name === item.name) {
        item.isChecked = !item.isChecked;
        setIsPressed(!isPressed);
      }
    })
    console.log(isPressed);
  }

  const onSubmitFilter = () => {
    setModalVisible(!modalVisible)
    const allTypeIsFalse = typesOfAttraction.every(({ isChecked }) => !isChecked)
    
    if (allTypeIsFalse) {
      typesOfAttraction.map(item => item.isChecked = true);
    }

      typesOfAttraction.map ((item) => {
        const allIsTrue = typesOfAttraction.every(({ isChecked }) => isChecked)
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
    console.log(checkboxFilter);
    

    if(checkboxFilter?.length > 0) {
      const newData = attractions.filter(item => checkboxFilter.includes(item.attractionType));
      setfilteredData(newData);
    } else {
      setfilteredData(attractions);
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
            data={['name', 'attractionType']}
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
        <TouchableOpacity style={styles.buttonListRight} onPress={()=>onPressFilter()}>
          <Text style={styles.buttonSmallListText}>Filter</Text>
        </TouchableOpacity>
    </View>
    <FlatList
      data={filteredData}
      extraData={filteredData}
      renderItem={({ item }) => (
        <TouchableHighlight
        underlayColor="#C8c9c9"
        onPress={() => {navigation.navigate('Details', {name: item.name, attractionType: item.attractionType, 
        price: item.price, ageGroup: item.ageGroup, groupSize: item.groupSize, openingTime: item.openingTime,
        closingTime: item.closingTime, description: item.description, language: item.language, TNC: item.TNC, 
        activityType: item.activityType, mapURL: item.mapURL, capacity: item.capacity, address: item.address,
        addedBy: item.addedBy, images: item.images})}}>
        <View style={styles.list}>
          <Text>{item.name}</Text>
          <Text>${item.price}</Text>
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
            <Text style={modal.modalText}>Type Of Attraction</Text>
            <View style={modal.buttonView}>
            {typesOfAttraction
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