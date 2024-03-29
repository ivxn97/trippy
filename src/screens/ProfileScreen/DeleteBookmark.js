import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, QuerySnapshot, arrayRemove, updateDoc } from "firebase/firestore";
import { db } from '../../../config';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DeleteBookmark ( {navigation} ) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [email, setEmail] = useState();
    const [bookmarksArr, setBookmarksArr] = useState();
    const [shouldRun, setShouldRun] = useState(true);

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

    async function getBookmarks (email) {
        var loginRef = doc(db, "users", email);
        const docSnap = await getDoc(loginRef);

        if (docSnap.exists()) {
            //console.log("Document data: ", docSnap.data());
            const bookmarksData = docSnap.data().bookmarks
            setBookmarksArr(bookmarksData);
            setShouldRun(false);
            setLoading(false)
        }
        else {
            console.log("Error", error)
        }
    }

    const delBookmark = async (activity) => {
        const docRef = doc(db, "users", email);
        await updateDoc(docRef, {bookmarks: arrayRemove(activity)})
        alert(`${activity} removed from your Bookmarks!`)
        navigation.replace('Bookmarks')
    }

    useFocusEffect(React.useCallback(() => {
        if (shouldRun) {
            getEmail();
            getBookmarks(email);
        }
    },[shouldRun, email, bookmarksArr]))

    if (loading) {
        return <ActivityIndicator />;
    }

    if (bookmarksArr == null ) {
        return (
            <View>
                <Text style={styles.Heading}>Bookmark is empty!</Text>
            </View>
        )
    }
    else {
        return (
            <View>
                <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>
                <Text style={styles.HeadingList}>Remove From Bookmarks</Text>
                <FlatList
                    data={bookmarksArr}
                    extraData={bookmarksArr}
                    renderItem={({ item }) => (
                    <TouchableHighlight
                    underlayColor="#C8c9c9"
                    onPress={() => delBookmark(item)}>
                    <View style={styles.list}>
                        <Text>{item}</Text>
                    </View>
                    </TouchableHighlight>
                    )}
                />
                </ScrollView>
            </View>
        )
    }
}