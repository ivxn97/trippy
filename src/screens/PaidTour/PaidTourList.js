import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';

export default function PaidTourList({navigation}) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [paidtours, setPaidtours] = useState([]); // Initial empty array of attractions

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

  return (
    <FlatList
      data={paidtours}
      extraData={paidtours}
      renderItem={({ item }) => (
        <TouchableHighlight
        underlayColor="#C8c9c9"
        onPress={() => {navigation.navigate('Paid tour details', {title: item.tourTitle, tourType: item.tourType, 
        price: item.price, ageGroup: item.ageGroup, groupSize: item.groupSize, startingTime: item.startingTime,
        endingTime: item.endingTime, duration: item.duration, description: item.description, language: item.language,
        TNC: item.TNC})}}>
        <View style={styles.list}>
          <Text>{item.tourTitle}</Text>
          <Text>${item.price}</Text>
        </View>
        </TouchableHighlight>
      )}
    />
  );
}
