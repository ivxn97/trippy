import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilteredTextInput } from '../commonFunctions';
import uuid from 'react-native-uuid';
import { useFocusEffect } from '@react-navigation/native';

const sectionPlaceholder = {
    label: 'Forum Section',
    value: null,
    color: 'black',
};

export default function EditReply ( {route, navigation} ) {
    const {title, description, comment_id, addedBy} = route.params;
    const [username, setUsername] = useState('');
    const [newDescription, setDescription] = useState(description);
    const [disabledButton, setDisabledButton] = useState(true)
    const datetime = new Date();

    const getUsername = async () => {
        try {
            const username = await AsyncStorage.getItem('username');
            if (username !== null) {
                setUsername(username);
                if (addedBy == username) {
                    setDisabledButton(false)
                }
            }
            else {
                setDisabledButton(true)
                console.log("No Email Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }
    useFocusEffect(React.useCallback(async ()=> {
        getUsername();
    }, []));    

    // edit reply

    const onSubmitPress = async () => {
        try {
            await setDoc(doc(db, "forum reply", comment_id), {
                datetime: datetime,
                description: newDescription
            }, {merge:true});
            
            navigation.replace('Forum Page')
        }
        catch (e) {
            console.log("Error editing reply: ", e);
        }
    }

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
                    {/*<Image
                        style={styles.logo}
                        source={require('../../../assets/icon.png')}
                    />*/}
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
    else {
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    style={{ flex: 1, width: '100%' }}
                    keyboardShouldPersistTaps="always">
                    {/*<Image
                        style={styles.logo}
                        source={require('../../../assets/icon.png')}
                    />*/}
                <Text style={styles.text}>Post Title: {JSON.stringify(title).replace(/"/g,"")}</Text>
                <Text style={styles.text}>Description:</Text>
                <Text style={styles.desc}>{newDescription}</Text>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 16
    },
    inputAndroid: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 16
      }
})