import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableHighlight, TouchableOpacity, TextInput, Modal, Button, StyleSheet} from 'react-native';
import { doc, getDoc, collection, getDocs, deleteDoc, query, where } from "firebase/firestore";
import { db } from '../../../config';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getStorage, ref, deleteObject, listAll } from "firebase/storage";
import firebase from 'firebase/app';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
const storage = getStorage();

export default function DeletePaidTour({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [items, setItems] = useState([]); 
    const [selectedName, setSelectedName] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(items);

    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [sortIsPressed, setSortIsPressed] = useState(false);
    const [sortByData, setSortByData] = useState();
    const [sortOrderData, setSortOrderData] = useState();
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const [modalVisible, setModalVisible] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [checkboxFilter, setCheckboxFilter] = useState([]);
    const [typesOfAttraction, setTypesOfAttraction] = useState();
  

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
    
      const getPaidTours = async () => {
        const collectionRef = collection(db, "paidtours")
        const q = query(collectionRef, where('addedBy', '==', email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            items.push({
                ...doc.data(),
                key: doc.id
            })
        })

        const allTypeOfAttraction = items.map(item => ({
            name: item.tourType,
            isChecked: false,
          }))
      
          const reducedType = allTypeOfAttraction.filter((item, index) => {
            return allTypeOfAttraction.findIndex((otherItem) => otherItem.name === item.name) === index;
          })
          setTypesOfAttraction(reducedType);
        setLoading(false);
      }
    
      useEffect(() => {
        getEmail();
        if (email) {
          getPaidTours();
        }
      },[email]);

    useEffect(async () => {
        const sortByChoice = ["name", "tourType"];
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

    const onDelete = (name) => {
        setSelectedName(name);
        setShowModal(true);
    }

    const onConfirmDelete = () => {
        deleteDoc(doc(db, "paidtours", selectedName));
        deleteFolder(`/paidtours/${selectedName}/images`)
        setItems((prevItems) => prevItems.filter((item) => item.name !== selectedName));
        setShowModal(false);
        navigation.navigate('BO Page')
    }

    function deleteFolder(path) {
        const listRef = ref(storage, path)
        listAll(listRef)
          .then(dir => {
            dir.items.forEach(fileRef => deleteObject(ref(storage, fileRef)));
            console.log("Files deleted successfully from Firebase Storage");
          })
          .catch(error => console.log(error));
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
          const newData = items.filter(item => checkboxFilter.includes(item.tourType));
          setfilteredData(newData);
        } else {
          setfilteredData(items);
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
                onChangeText={(text) => searchFilter(text, items)}
            />
            <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.buttonListRight} onPress={() => onPressSort()}>
                    <Text style={styles.buttonSmallListText}>Sort</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={styles.buttonListRight} onPress={() => onPressFilter()}>
                    <Text style={styles.buttonSmallListText}>Filter</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredData}
                extraData={filteredData}
                renderItem={({ item }) => (
                    <TouchableHighlight
                    underlayColor="#C8c9c9"
                    onPress={() => onDelete(item.tourTitle)}>
                    <View style={styles.list}>
                        <Text>{item.name}</Text>
                        <Text>${item.price}</Text>
                    </View>
                </TouchableHighlight>
                )}
                keyExtractor={(item) => item.name}
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
          <View style={modal.centeredView}>
            <View style={modal.modalView}>
              <Text style={modal.modalText}>Type Of Tour</Text>
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
            <Modal visible={showModal}>
                <View style={styles.container}>
                    <Text style={styles.message}>Are you sure you want to delete this data?</Text>
                    <View style={styles.buttonContainer}>
                        <Button title="Confirm" onPress={onConfirmDelete} />
                        <View style={styles.space} />
                        <Button title="Cancel" onPress={() => setShowModal(false)} />
                        
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