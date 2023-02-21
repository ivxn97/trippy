import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TouchableHighlight, TextInput, Modal, StyleSheet, ScrollView } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HotelEditList({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [hotels, setHotels] = useState([]); // Initial empty array of hotels
    const [filteredData, setfilteredData] = useState(hotels); 
    const [search, setSearch] = useState('');
    const [email, setEmail] = useState('');
    
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [sortIsPressed, setSortIsPressed] = useState(false);
    const [sortByData, setSortByData] = useState();
    const [sortOrderData, setSortOrderData] = useState();
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const [modalVisible, setModalVisible] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [checkboxFilter, setCheckboxFilter] = useState([]);

    const [hotelClassFilter, setHotelClassFilter] = useState();
    const [roomFeaturesFilter, setRoomFeaturesFilter] = useState([]);
    const [roomFeaturesCheckbox, setRoomFeaturesCheckbox] = useState([]);
    const [amenitiesFilter, setAmenitiesFilter] = useState([]);
    const [amenitiesCheckbox, setAmenitiesCheckbox] = useState([]);
    

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

    const getHotels = async () => {
        const collectionRef = collection(db, "hotels")
        const q = query(collectionRef, where('addedBy', '==', email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            hotels.push({
                ...doc.data(),
                key: doc.id
            })
        })

        const roomFeature = hotels.map(item => item.roomFeatures);
        const allRoomFeature = roomFeature[0].map(item => ({
          name: item.name,
          isChecked: false,
        }));
        const reducedRoomFeature = allRoomFeature.filter((item, index) => {
          return allRoomFeature.findIndex((otherItem) => otherItem.name === item.name) === index;
        })

        const hotelAmenities = hotels.map(item => item.amenities);
        const allHotelAmenities = hotelAmenities[0].map(item => ({
          name: item.name,
          isChecked: false,
        }));
        const reducedHotelAmenities = allHotelAmenities.filter((item, index) => {
          return allHotelAmenities.findIndex((otherItem) => otherItem.name === item.name) === index;
        })

        const allClass = hotels.map(item => ({
          name: item.hotelClass,
          isChecked: false,
        }));
        const reducedClass = allClass.filter((item, index) => {
          return allClass.findIndex((otherItem) => otherItem.name === item.name) === index;
        })

        setAmenitiesFilter(reducedHotelAmenities);
        setRoomFeaturesFilter(reducedRoomFeature);
        setHotelClassFilter(reducedClass);
        setLoading(false);
    }

    useEffect(() => {
        getEmail();
        if (email) {
          getHotels();
        }
    },[email]);

    useEffect(async () => {
        const sortByChoice = ["name", "hotelClass"];
        const sortByResult = sortByChoice.map(attributeName => ({
            name: attributeName,
            value: attributeName,
            isChecked: false
        }));
        const sortOrderChoice = ["asc", "desc"];
        const sortOrderResult = sortOrderChoice.map(attributeName => ({
            name: attributeName,
            value: attributeName,
            isChecked: false
        }));

        setSortByData(sortByResult);
        setSortOrderData(sortOrderResult);
    }, []);

    if (loading) {
        return <ActivityIndicator />;
    }

    const onPressSort = () => {
        const sortByDataIsTrue = sortByData.every(({ isChecked }) => isChecked)
        const sortOrderIsTrue = sortOrderData.every(({ isChecked }) => isChecked)
        if (sortByDataIsTrue) { sortByData.map(item => item.isChecked = false) }
        if (sortOrderIsTrue) { sortOrderData.map(item => item.isChecked = false) }
        setSortIsPressed(!sortIsPressed);
        setSortModalVisible(!sortModalVisible)
    }



    const sortToggleButton = (sort) => {
        sortByData.map((item) => {
            if (sort.name === item.name) {
                if (item.isChecked) {
                    item.isChecked = false;
                } else {
                    sortByData.map(item => item.isChecked = false);
                    item.isChecked = true;
                }
                setSortIsPressed(!sortIsPressed);
                setSortBy(item.name)
            }
        })
        sortOrderData.map((item) => {
            if (sort.name === item.name) {
                if (item.isChecked) {
                    item.isChecked = false;
                } else {
                    sortOrderData.map(item => item.isChecked = false);
                    item.isChecked = true;
                }
                setSortIsPressed(!sortIsPressed);
                setSortOrder(item.name)
            }
        })
    }

    async function onSubmitSort() {
        const sortByDataIsFalse = sortByData.every(({ isChecked }) => !isChecked)
        const sortOrderDataIsFalse = sortOrderData.every(({ isChecked }) => !isChecked)

        if (sortByDataIsFalse) {
            sortByData.map(item => item.isChecked = true);
        }

        if (sortOrderDataIsFalse) {
            sortOrderData.map(item => item.isChecked = true);
        }
        setSortModalVisible(!sortModalVisible)
        const sortedArray = await sortFiles(filteredData, sortBy, sortOrder);
        setfilteredData(sortedArray);
        setSortBy("");
        setSortOrder("");
        sortByData.map(item => item.isChecked = false); // set all to false
        sortOrderData.map(item => item.isChecked = false); // set all to false
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
        const allClassIsTrue = hotelClassFilter.every(({ isChecked }) => isChecked)
        if (allClassIsTrue) {hotelClassFilter.map(item => item.isChecked = false)}

        const allRoomFeatureIsTrue = roomFeaturesFilter.every(({ isChecked }) => isChecked)
        if (allRoomFeatureIsTrue) {roomFeaturesFilter.map(item => item.isChecked = false)}

        const allAmenitiesIsTrue = amenitiesFilter.every(({ isChecked }) => isChecked)
        if (allAmenitiesIsTrue) {amenitiesFilter.map(item => item.isChecked = false)}
        
        setIsPressed(!isPressed);
        setModalVisible(!modalVisible)
    }

    const toggleButton = (filters) => {
        hotelClassFilter.map((item) => {
          if (filters.name === item.name) {
            item.isChecked = !item.isChecked;
            setIsPressed(!isPressed);
          }
        })
        roomFeaturesFilter.map((item) => {
          if (filters.name === item.name) {
            item.isChecked = !item.isChecked;
            setIsPressed(!isPressed);
          }
        })
        amenitiesFilter.map((item) => {
          if (filters.name === item.name) {
            item.isChecked = !item.isChecked;
            setIsPressed(!isPressed);
          }
        })
    }

    const onSubmitFilter = async() => {
        setModalVisible(!modalVisible)
        const allClassIsFalse = hotelClassFilter.every(({ isChecked }) => !isChecked)

        if (allClassIsFalse) {
            hotelClassFilter.map(item => item.isChecked = true);
        }
        
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

          roomFeaturesFilter.map ((item) => {
            if (item.isChecked) {
              if(!roomFeaturesCheckbox.includes(item.name)) {
                roomFeaturesCheckbox.push(item.name);
              }
              //
            } else if (item.isChecked === false) {
              if(roomFeaturesCheckbox.includes(item.name)) {
                const index = roomFeaturesCheckbox.indexOf(item.name);
                roomFeaturesCheckbox.splice(index, 1);
              }
            } 
          })

          amenitiesFilter.map ((item) => {
            if (item.isChecked) {
              if(!amenitiesCheckbox.includes(item.name)) {
                amenitiesCheckbox.push(item.name);
              }
              //
            } else if (item.isChecked === false) {
              if(amenitiesCheckbox.includes(item.name)) {
                const index = amenitiesCheckbox.indexOf(item.name);
                amenitiesCheckbox.splice(index, 1);
              }
            } 
          })


          hotels.map(item => {
            const roomF = item.roomFeatures;
            const roomFeaturesInHotel = [];
            roomF.map (filterItem => {
              if(filterItem.isChecked){
                roomFeaturesInHotel.push(filterItem.name);
              }
            })
            if (roomFeaturesCheckbox.every(a => roomFeaturesInHotel.includes(a))) {
              if (!checkboxFilter.includes(roomF)) {
                checkboxFilter.push(roomF)
              }
            } else if (!roomFeaturesCheckbox.every(a => roomFeaturesInHotel.includes(a))) {
              if (checkboxFilter.includes(roomF)) {
                const index = checkboxFilter.indexOf(roomF);
                checkboxFilter.splice(index, 1);
              }
            }

            const hotelA = item.amenities;
            const amenitiesInHotel = [];
            hotelA.map (filterItem => {
              if(filterItem.isChecked){
                amenitiesInHotel.push(filterItem.name);
              }
            })
            if (amenitiesCheckbox.every(a => amenitiesInHotel.includes(a))) {
              if (!checkboxFilter.includes(hotelA)) {
                checkboxFilter.push(hotelA)
              }
            } else if (!amenitiesCheckbox.every(a => amenitiesInHotel.includes(a))) {
              if (checkboxFilter.includes(hotelA)) {
                const index = checkboxFilter.indexOf(hotelA);
                checkboxFilter.splice(index, 1);
              }
            }
          });
        console.log(checkboxFilter);
        
    
        if(checkboxFilter?.length > 0) {
        const newData = hotels.filter(item => checkboxFilter.includes(item.hotelClass)
        && checkboxFilter.includes(item.roomFeatures)
        && checkboxFilter.includes(item.amenities));
        
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
        <TouchableOpacity style={styles.buttonListRight} onPress={() => onPressSort()}>
            <Text style={styles.buttonSmallListText}>Sort</Text>
        </TouchableOpacity>  
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
                    navigation.navigate('Edit Hotel', {
                        name: item.name, roomTypes: item.roomTypes,
                        hotelClass: item.hotelClass, checkInTime: item.checkInTime,
                        checkOutTime: item.checkOutTime, amenities: item.amenities, roomFeatures: item.roomFeatures, 
                        language: item.language,description: item.description, TNC: item.TNC, activityType: item.activityType,
                        addedBy: item.addedBy, timeSlots: item.timeSlots, mapURL: item.mapURL, address: item.address, images: item.images,
                        longitude: item.longitude, latitude: item.latitude, currRooms: item.currentRooms
                    })
                    }}>
                    <View style={styles.list}>
                        <Text>{item.name}</Text>
                        <Text>{item.hotelClass}</Text>
                    </View>
                </TouchableHighlight>
            )}
        />

{modalVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>
              <View style={modal.modalView}>
                <Text style={modal.modalText}>Room Features</Text>
                <View style={modal.buttonView}>
                  {roomFeaturesFilter
                    //.filter((item) => !checked || item.checked)
                    .map((item, index) => (
                      <View style={styles.checklist} key={index}>
                        <TouchableHighlight
                          onPress={() => toggleButton(item)}
                          style={item.isChecked ? modal.buttonPressed : modal.button}>
                          <Text>{item.name}</Text>
                        </TouchableHighlight>
                      </View>
                    ))}
                </View>

                <Text style={modal.modalText}>Amenities</Text>
                <View style={modal.buttonView}>
                  {amenitiesFilter
                    //.filter((item) => !checked || item.checked)
                    .map((item, index) => (
                      <View style={styles.checklist} key={index}>
                        <TouchableHighlight
                          onPress={() => toggleButton(item)}
                          style={item.isChecked ? modal.buttonPressed : modal.button}>
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
                          style={item.isChecked ? modal.buttonPressed : modal.button}>
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
          </ScrollView>
      </Modal>
        )}

            {sortModalVisible && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={sortModalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setSortModalVisible(!sortModalVisible);
                    }}>
                    <View style={modal.centeredView}>
                        <View style={modal.modalView}>
                            <Text style={modal.modalText}>Sort By</Text>
                            <View style={modal.buttonView}>
                                {sortByData
                                    //.filter((item) => !checked || item.checked)
                                    .map((item, index) => (
                                        <View style={styles.checklist} key={index}>
                                            <TouchableHighlight
                                                onPress={() => sortToggleButton(item)}
                                                style={item.isChecked ? modal.buttonPressed : modal.button}>
                                                <Text>{item.name}</Text>
                                            </TouchableHighlight>
                                        </View>
                                    ))}
                            </View>

                            <Text style={modal.modalText}>Sort Order</Text>
                            <View style={modal.buttonView}>
                                {sortOrderData
                                    //.filter((item) => !checked || item.checked)
                                    .map((item, index) => (
                                        <View style={styles.checklist} key={index}>
                                            <TouchableHighlight
                                                onPress={() => sortToggleButton(item)}
                                                style={item.isChecked ? modal.buttonPressed : modal.button}>
                                                <Text>{item.name}</Text>
                                            </TouchableHighlight>
                                        </View>
                                    ))}
                            </View>
                            <TouchableHighlight
                                onPress={() => onSubmitSort()}
                                style={modal.button}>
                                <Text>Submit</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            )}
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

