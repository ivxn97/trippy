import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, ScrollView } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';

export default function ListOfUsers( {navigation} ) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users
  const [search, setSearch] = useState('');
  const [filteredData, setfilteredData] = useState(users);

  // Get all users from Firestore DB
  useEffect(async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach(documentSnapshot => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setUsers(users);
        setLoading(false);
      },[]);
  
  if (loading) {
    return <ActivityIndicator />;
  }

  //Handles Search
  const searchFilter = (text, type) => {
    if (text) {
        const newData = type.filter((item) => {
            const itemData = item.email ? item.email.toUpperCase()
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
      <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>
      <TextInput
          style={styles.inputSearch}
          placeholder='search'
          placeholderTextColor="#aaaaaa"
          underlineColorAndroid="transparent"
          autoCapitalize="sentences"
          value={search}
          onChangeText={(text) => searchFilter(text, users)}
      />
      <FlatList
        data={filteredData}
        extraData={filteredData}
        renderItem={({ item }) => (
          <TouchableHighlight
          underlayColor="#C8c9c9"
          onPress={() => {navigation.navigate('Admin View Account', {email: item.email, UEN: item.UEN, firstName: item.firstName,
          lastName: item.lastName, role: item.role, id: item.id, status: item.status, socialMediaHandle: item.socialMediaHandle,
          socialMediaPlatform: item.socialMediaPlatform, username: item.username })}}>
          <View style={styles.list}>
            <Text>Email: {item.email}</Text>
            <Text>Role: {item.role}</Text>
          </View>
          </TouchableHighlight>
        )}
      />
      </ScrollView>
    </View>
  );
}