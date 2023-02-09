import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from '../LOLScreen/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReportsList ({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [reports, setReports] = useState([]); // Initial empty array of reports
    const [email, setEmail] = useState('');

    const getReports = async () => {
        const querySnapshot = await getDocs(collection(db, "reports"));
        querySnapshot.forEach(documentSnapshot => {
            reports.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });
        setLoading(false);
      }
    
      useEffect(() => {
        getReports();
      },[]);

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
        <Text style={styles.HeadingList}>Reports</Text>

        <FlatList
            data={reports}
            extraData={reports}
            renderItem={({ item }) => (
        <TouchableHighlight
            underlayColor="#C8c9c9"
            onPress={() =>
                navigation.navigate('Report', {activityType: item.activityType, addedBy: item.addedBy, content: item.content, reportedBy: item.reportedBy, name: item.name})}>
        <View style={styles.list}>
          <Text>{item.name}</Text>
        </View>
        </TouchableHighlight>
      )}
    />
        </View>
    )
}
