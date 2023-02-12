import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableHighlight, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserDealsList( { navigation }) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [deals, setDeals] = useState([]); // Initial empty array of deals
  const [search, setSearch] = useState('');
  const [filteredData, setfilteredData] = useState();
  const [email, setEmail] = useState();
  const [dealInfo, setDealInfo] = useState([]);
  const [redeemableDeals, setRedeemableDeals] = useState([]);
  const [claimedDeals, setClaimedDeals] = useState();
  const [shouldRun, setShouldRun] = useState(true);
      const [status, setStatus] = useState('Loading Claimed Deals')

  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortIsPressed, setSortIsPressed] = useState(false);
  const [sortByData, setSortByData] = useState();
  const [sortOrderData, setSortOrderData] = useState();
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  
  //Get email from storage
  const getEmail = async () => {
    try {
        const email = await AsyncStorage.getItem('email');
        if (email !== null) {
            setEmail(email);
            console.log(email)
        }
        else {
            console.log("No Email Selected at Login")
        }
    } catch (error) {
        console.log(error)
    }
  }

  const getClaimedDeals = async () => {
    const docRef = doc(db, "users", email)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setClaimedDeals(docSnap.data().claimedDeals)
    }
    setShouldRun(false)
  }

  const getDealInfo = async () => {
    const querySnapshot = await getDocs(collection(db, "deals"))
    querySnapshot.forEach(documentSnapshot => {
      dealInfo.push({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
      });
    })

    //Filter the deals to only the ones that the user has redeemed
    console.log(dealInfo,"SPlit",  claimedDeals)
    const firstFilter = dealInfo.filter(item => claimedDeals.includes(item.code))
    setRedeemableDeals(firstFilter);
    setfilteredData(firstFilter)
    console.log(firstFilter)
    setLoading(false)
  }


  useEffect(() => {
    if (shouldRun) {
      getEmail();
      if (email) {
        getClaimedDeals();
        if (claimedDeals) {
          getDealInfo();
        }
      }
    }
  },[email, claimedDeals])
  
  useEffect(async () => {
    const sortByChoice = ["dealname", "type", "discount"];
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

    useEffect(() => {
        const interval = setInterval(() => {
            setStatus('Claimed Deals is empty!');
        }, 8000);
        return () => clearInterval(interval)
    })

    if (loading) {
        return (
            <View>
                <ActivityIndicator />
                <Text style={styles.Heading}>{status}</Text>
            </View>);
    }

  const searchFilter = (text, type) => {
    if (text) {
        const newData = type.filter((item) => {
            const itemData = item.dealname ? item.dealname.toUpperCase()
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
        onChangeText={(text) => searchFilter(text, redeemableDeals)}
    />
    <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
        <TouchableOpacity style={styles.buttonListRight} onPress={() => onPressSort()}>
          <Text style={styles.buttonSmallListText}>Sort</Text>
        </TouchableOpacity> 
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
        onPress={() => {navigation.navigate('Deal detail', {name: item.dealname, dealType: item.type, 
        code: item.code, description: item.description, discount: item.discount, quantity: item.quantity, TNC: item.TNC,
        businessName: item.businessName, expiry: item.expiry})}}>
        <View style={styles.list}>
          <Text>{item.dealname}</Text>
          <Text>{item.discount}% off</Text>
        </View>
        </TouchableHighlight>
      )}
    />
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