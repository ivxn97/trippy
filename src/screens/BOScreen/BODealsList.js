import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';

export default function BODeals( { navigation }) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [deals, setDeals] = useState([]); // Initial empty array of attractions

  //List
  navigation.addListener('willFocus', () => {
    
  })

  useEffect(async () => {
    const querySnapshot = await getDocs(collection(db, "deals"));
        querySnapshot.forEach(documentSnapshot => {
          deals.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setDeals(deals);
        setLoading(false);
      },[]);
  
  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
    <TextInput
        style={styles.inputSearch}
        placeholder='search'
        placeholderTextColor="#aaaaaa"
        underlineColorAndroid="transparent"
        autoCapitalize="sentences"
    />
    <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
        <TouchableOpacity style={styles.buttonSmall} onPress={() =>
                        navigation.navigate('Add Deal')
                    }>
          <Text style={styles.buttonSmallListText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall}>
          <Text style={styles.buttonSmallListText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall}>
          <Text style={styles.buttonSmallListText}>Remove</Text>
        </TouchableOpacity>
    </View>
    <FlatList
      data={deals}
      extraData={deals}
      renderItem={({ item }) => (
        <TouchableHighlight
        underlayColor="#C8c9c9"
        onPress={() => {navigation.navigate('Deal detail', {name: item.dealname, dealType: item.type, 
        code: item.code, description: item.description, quantity: item.quantity, TNC: item.TNC})}}>
        <View style={styles.list}>
          <Text>{item.dealname}</Text>
          <Text>{item.quantity}% off</Text>
        </View>
        </TouchableHighlight>
      )}
    />
    </View>
  );
}