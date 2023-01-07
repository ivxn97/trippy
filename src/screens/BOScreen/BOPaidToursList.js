import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';

export default function BOPaidTourList({navigation}) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [paidtours, setPaidtours] = useState([]); // Initial empty array of paid tours
  const [search, setSearch] = useState('');
  const [filteredData, setfilteredData] = useState(paidtours);

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
    <TouchableOpacity style={styles.buttonSmall} onPress={() =>
                        navigation.navigate('Add Paid Tour')
                    }>
          <Text style={styles.buttonSmallListText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Paid Tours Edit List')}>
          <Text style={styles.buttonSmallListText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Delete Paid Tour')}>
          <Text style={styles.buttonSmallListText}>Remove</Text>
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
        TNC: item.TNC, activityType: item.activityType})}}>
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
