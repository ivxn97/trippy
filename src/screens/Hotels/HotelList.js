import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput, TouchableHighlight, Modal, StyleSheet } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
import { check } from 'leo-profanity';

export default function HotelList({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [hotels, setHotels] = useState([]); // Initial empty array of hotels
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(hotels);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [innerDropdownVisible, setInnerDropdownVisible] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [checkboxFilter, setCheckboxFilter] = useState([]);
    const [typeOfRoomFilter, setTypeOfRoomFilter] = useState();
    const [roomTypesFilter, setRoomTypesFilter] = useState([]);

    const [hotelClassFilter, setHotelClassFilter] = useState();
    const [amenitiesFilter, setAmenitiesFilter] = useState();
    const [roomFeaturesFilter, setRoomFeaturesFilter] = useState();

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
        const querySnapshot = await getDocs(collection(db, "hotels"));
        querySnapshot.forEach(documentSnapshot => {
            hotels.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });

        const getRoomTypes = hotels.map(item => item.roomTypes);
        //roomType.splice(0, (roomType.length - 1));
        const allTypeOfRoom = getRoomTypes[0].map(item => ({
            name: item.name,
            value: item.name,
            isChecked: false,

        }));
        
        const reducedTOR = allTypeOfRoom.filter((item, index) => {
            return allTypeOfRoom.findIndex((otherItem) => otherItem.name === item.name) === index;
        });

        const allClass = hotels.map(item => ({
          name: item.hotelClass,
          isChecked: false,
        }));
        const reducedClass = allClass.filter((item, index) => {
          return allClass.findIndex((otherItem) => otherItem.name === item.name) === index;
        })

        setTypeOfRoomFilter(reducedTOR);
        setHotelClassFilter(reducedClass);

        setHotels(hotels);
        setLoading(false);
    }, []);

    async function handleSortChange(sort) {
        if (sort === 'asc' || sort === 'desc') {
            setSortOrder(sort);
            setInnerDropdownVisible(false);
            const sortedArray = await sortFiles(items, sortBy, sortOrder);
            setItems(sortedArray)

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
        const allTypeOfRoomIsTrue = typeOfRoomFilter.every(({ isChecked }) => isChecked)
        const allClassIsTrue = hotelClassFilter.every(({ isChecked }) => isChecked)
        if (allTypeOfRoomIsTrue) {typeOfRoomFilter.map(item => item.isChecked = false)}
        if (allClassIsTrue) {hotelClassFilter.map(item => item.isChecked = false)}
        setIsPressed(!isPressed);
        setModalVisible(!modalVisible)
    }

    const toggleButton = (filters) => {
        typeOfRoomFilter.map((item) => {
          if (filters.name === item.name) {
            item.isChecked = !item.isChecked;
            setIsPressed(!isPressed);
          }
        })
        hotelClassFilter.map((item) => {
          if (filters.name === item.name) {
            item.isChecked = !item.isChecked;
            setIsPressed(!isPressed);
          }
        })
    }

    const checker = (arr, target) => {
      target.every(v => arr.includes(v))
    }

    const onSubmitFilter = () => {
        setModalVisible(!modalVisible)
        const allTypeOfRoomIsFalse = typeOfRoomFilter.every(({ isChecked }) => !isChecked)
        const allClassIsFalse = hotelClassFilter.every(({ isChecked }) => !isChecked)
        
        if (allTypeOfRoomIsFalse) {
            typeOfRoomFilter.map(item => item.isChecked = true);
        }
    
        if (allClassIsFalse) {
            hotelClassFilter.map(item => item.isChecked = true);
        }
        //hotels.map (item => console.log(item.roomTypes));

        typeOfRoomFilter.map ((item) => {
            if (item.isChecked) {
              if(!roomTypesFilter.includes(item.name)) {
                roomTypesFilter.push(item.name);
              }
              //
            } else if (item.isChecked === false) {
              if(roomTypesFilter.includes(item.name)) {
                const index = roomTypesFilter.indexOf(item.name);
                roomTypesFilter.splice(index, 1);
              }
            } 
          })

          hotels.map (item => {
            const rooms = item.roomTypes;
            //const roomsInHotel = rooms.filter (filterItem => filterItem.isChecked === true);
            //console.log(roomsInHotel);
            var roomsInHotel = [];
            rooms.map (room => {
              if (room.isChecked) {
                roomsInHotel.push(room.name);
              }
            })
            console.log(item.name);
            console.log(roomsInHotel);
            //console.log(roomsInHotel.every(a=>roomTypesFilter.includes(a.name)));
            console.log(roomsInHotel.includes(roomTypesFilter));
            //roomsInHotel.map(a=>console.log(a.name));
            roomsInHotel.map (room => {
              if (checkboxFilter.includes(room.name)) {
                console.log(item.name);
                console.log(room);
                
              }
            })
              //console.log(roomTypesFilter);
              //console.log(roomsInHotel);
              //console.log(b);
          })
          //console.log(checker);
        
          hotelClassFilter.map ((item) => {
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
        const newData = hotels.filter(item => checkboxFilter.includes(item.hotelClass) && checkboxFilter.includes(item.roomTypes));
        
          setfilteredData(newData);
        } else {
          setfilteredData(hotels);
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
        onChangeText={(text) => searchFilter(text, hotels)}
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
                        data={['name', 'hotelClass']}
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
                    onPress={() => {
                    navigation.navigate('Details', {
                        name: item.name, roomTypes: item.roomTypes,
                        priceRange: item.priceRange, hotelClass: item.hotelClass, checkInTime: item.checkInTime,
                        checkOutTime: item.checkOutTime, amenities: item.amenities, roomFeatures: item.roomFeatures, 
                        language: item.language,description: item.description, TNC: item.TNC, activityType: item.activityType,
                        addedBy: item.addedBy, timeSlots: item.timeSlots, mapURL: item.mapURL, capacity: item.capacity, 
                        address: item.address 
                    })
                    }}>
                    <View style={styles.list}>
                        <Text>{item.name}</Text>
                        <Text>{item.hotelClass}</Text>
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
            <Text style={modal.modalText}>Type Of Room</Text>
            <View style={modal.buttonView}>
            {typeOfRoomFilter
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

            <Text style={modal.modalText}>Hotel Class</Text>
            <View style={modal.buttonView}>
            {hotelClassFilter
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