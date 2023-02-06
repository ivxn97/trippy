import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';

export default function ReviewPendingAccounts( {navigation} ) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users
  const [search, setSearch] = useState('');
  const [filteredData, setfilteredData] = useState(users);

  useEffect(async () => {
    const collectionRef = collection(db, "users")
    const q = query(collectionRef, where('status', '==', 'Pending'))
    const querySnapshot = await getDocs(q);
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
          onChangeText={(text) => searchFilter(text, users)}
      />
      <FlatList
        data={filteredData}
        extraData={filteredData}
        renderItem={({ item }) => (
          <TouchableHighlight
          underlayColor="#C8c9c9"
          onPress={() => {navigation.navigate('Review Account', {email: item.email, UEN: item.UEN, firstName: item.firstName,
          lastName: item.lastName, role: item.role, id: item.id, status: item.status, socialMediaHandle: item.socialMediaHandle,
          socialMediaPlatform: item.socialMediaPlatform })}}>
          <View style={styles.list}>
            <Text>Email: {item.email}</Text>
            <Text>Role: {item.role}</Text>
          </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
}