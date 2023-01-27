import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserDealsList( { navigation }) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [deals, setDeals] = useState([]); // Initial empty array of deals
  const [search, setSearch] = useState('');
  const [filteredData, setfilteredData] = useState();
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [innerDropdownVisible, setInnerDropdownVisible] = useState(false);
  const [email, setEmail] = useState();
  const [dealInfo, setDealInfo] = useState([]);
  const [redeemableDeals, setRedeemableDeals] = useState([]);
  const [claimedDeals, setClaimedDeals] = useState();
  const [shouldRun, setShouldRun] = useState(true);

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
  
  async function handleSortChange(sort) {
    if (sort === 'asc' || sort === 'desc') {
      setSortOrder(sort);
      setInnerDropdownVisible(false);
      const sortedArray = await sortFiles(deals, sortBy, sortOrder);
      setDeals(sortedArray)

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
            data={['name', 'dealType']}
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
    </View>
  );
}