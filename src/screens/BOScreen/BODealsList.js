import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BODeals( { navigation }) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [deals, setDeals] = useState([]); // Initial empty array of deals
  const [search, setSearch] = useState('');
  const [filteredData, setfilteredData] = useState(deals);
  const [email, setEmail] = useState('');

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

  const getDeals = async () => {
    const collectionRef = collection(db, "deals")
    const q = query(collectionRef, where('addedBy', '==', email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        deals.push({
            ...doc.data(),
            key: doc.id
        })
    })
    setLoading(false);
  }

  useEffect(() => {
    getEmail();
    if (email) {
      getDeals();
    }
  },[email]);
  
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
        onChangeText={(text) => searchFilter(text, deals)}
    />
    <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
        <TouchableOpacity style={styles.buttonSmall} onPress={() =>
                        navigation.navigate('Add Deal')
                    }>
          <Text style={styles.buttonSmallListText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Deals Edit List')}>
          <Text style={styles.buttonSmallListText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Delete Deal')}>
          <Text style={styles.buttonSmallListText}>Remove</Text>
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