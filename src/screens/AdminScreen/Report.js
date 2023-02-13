import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilteredTextInput } from '../commonFunctions';
import { useFocusEffect } from '@react-navigation/native';

// This File handles reports submitted by other users
export default function Report ( {route, navigation} ) {
    const {activityType, addedBy, content, reportedBy, name} = route.params;
    const [description, setDescription] = useState('')

    // Remove activity/ forum post from Database
    const remove = async () => {
        try {
            await deleteDoc(doc(db, activityType, name));
            await deleteDoc(doc(db, "reports", name));
            alert("Content Removed")
            navigation.navigate('Admin page')
        }
        catch (e) {
            console.log(e);
        }
    }

    // Remove activity/ forum post from database and suspend the user that wrote it
    const removeAndSuspend = async () => {
        try {
            await deleteDoc(doc(db, activityType, name));
            await setDoc(doc(db, "users", addedBy), {
                status: "Suspended"
            }, {merge: true})
            await deleteDoc(doc(db, "reports", name));
            alert("Content Removed and User suspended")
            navigation.navigate('Admin page')
        }
        catch (e) {
            console.log(e);
        }
    }

    // Ignore report, Report gets removed from Firestore DB
    const ignore = async () => {
        await deleteDoc(doc(db, "reports", name));
        alert("Report Removed")
        navigation.replace("Reports List")
    }

    return (
        <View style={styles.container}>
        <KeyboardAwareScrollView
            style={{ flex: 1, width: '100%' }}
            keyboardShouldPersistTaps="always">
        <Text style={styles.text}>Title: {JSON.stringify(name).replace(/"/g,"")}</Text>
        <Text style={styles.text}>Type: {JSON.stringify(activityType).replace(/"/g,"")}</Text>
        <Text style={styles.text}>Content Added By: {JSON.stringify(addedBy).replace(/"/g,"")}</Text>
        <Text style={styles.text}>Content Reported By: {JSON.stringify(reportedBy).replace(/"/g,"")}</Text>
        <Text style={styles.text}>Offending Content:</Text>
        <Text style={styles.desc}>{content}</Text>
        <TouchableOpacity
                style={styles.button}
                onPress={() => removeAndSuspend()}>
                <Text style={styles.buttonTitle}>Remove Offensive Content & Suspend User</Text>
        </TouchableOpacity>
        <TouchableOpacity
                style={styles.button}
                onPress={() => remove()}>
                <Text style={styles.buttonTitle}>Remove Offensive Content</Text>
        </TouchableOpacity>
        <TouchableOpacity
                style={styles.button}
                onPress={() => ignore()}>
                <Text style={styles.buttonTitle}>Ignore Content</Text>
        </TouchableOpacity>
        </KeyboardAwareScrollView>
    </View>
    )
    // delete reply

    const onConfirmDelete = async () => {
        try {
            await deleteDoc(doc(db, "forum reply", comment_id));
            
            navigation.replace('Forum Page')
        }
        catch (e) {
            console.log("Error deleting reply: ", e);
        }
    }

    if (addedBy == username) {
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    style={{ flex: 1, width: '100%' }}
                    keyboardShouldPersistTaps="always">
                <Text style={styles.text}>Post Title: {JSON.stringify(title).replace(/"/g,"")}</Text>
                <Text style={styles.text}>Description:</Text>
                <FilteredTextInput
                    style={styles.desc}
                    placeholder='Description'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(Text) => setDescription(Text)}
                    value={newDescription}
                    underlineColorAndroid="transparent"
                    autoCapitalize="sentences"
                    multiline
                />
                <TouchableOpacity
                        style={styles.button}
                        onPress={() => onSubmitPress()}>
                        <Text style={styles.buttonTitle}>Edit Forum Reply</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                        style={styles.button}
                        onPress={() => onConfirmDelete()}>
                        <Text style={styles.buttonTitle}>Delete Forum Reply</Text>
                </TouchableOpacity>
                </KeyboardAwareScrollView>
            </View>
        )
    }
    else if (username !== null){
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    style={{ flex: 1, width: '100%' }}
                    keyboardShouldPersistTaps="always">
                <Text style={styles.text}>Post Title: {JSON.stringify(title).replace(/"/g,"")}</Text>
                <Text style={styles.text}>Description:</Text>
                <Text style={styles.desc}>{newDescription}</Text>
                <TouchableOpacity
                        style={styles.button}
                        onPress={() => report("Forum Reply", addedBy, newDescription, email)}>
                        <Text style={styles.buttonTitle}>Report</Text>
                </TouchableOpacity>
                </KeyboardAwareScrollView>
            </View>
        )
    }
    else {
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    style={{ flex: 1, width: '100%' }}
                    keyboardShouldPersistTaps="always">
                <Text style={styles.text}>Post Title: {JSON.stringify(title).replace(/"/g,"")}</Text>
                <Text style={styles.text}>Description:</Text>
                <Text style={styles.desc}>{newDescription}</Text>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}
