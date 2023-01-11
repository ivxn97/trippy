import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, getDocs, setDoc, collection } from "firebase/firestore";
import { db } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilteredTextInput } from '../commonFunctions';

const sectionPlaceholder = {
    label: 'Forum Section',
    value: null,
    color: 'black',
};

export default function CreatePost ( {navigation} ) {
    const [username, setUsername] = useState('');
    const [title, setTitle] = useState('');
    const [section, setSection] = useState('');
    const [description, setDescription] = useState('');
    const [forumSections, setForumSections] = useState([]);
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const datetime = new Date();

    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                const [username, website] = email.split("@")
                setUsername(username);
            }
            else {
                console.log("No Email Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }
    getEmail();

    const getSections = async () => {
        const querySnapshot = await getDocs(collection(db, "forum sections"));
        querySnapshot.forEach(docSnap => {
            forumSections.push({label: docSnap.data().name, value: docSnap.data().name})
        })
        setLoading(false)
    }

    useEffect(() => {
        getSections();
    }, [forumSections]);

    const onSubmitPress = async () => {
        try {
            await setDoc(doc(db, "forum", title), {
                addedBy: username,
                title: title,
                section: section,
                description: description,
                datetime: datetime
            });
            
            navigation.replace('Forum Page')
        }
        catch (e) {
            console.log("Error adding Post: ", e);
        }
    }

    if (loading) {
        return <ActivityIndicator />;
    }


    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
            <Text style={styles.text}>Title:</Text>
            <FilteredTextInput
                style={styles.input}
                placeholder='Title'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setTitle(Text)}
                value={title}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <Text style={styles.text}>Forum Section:</Text>
                <RNPickerSelect
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    placeholder={sectionPlaceholder}
                    placeholderTextColor="#aaaaaa"
                    onValueChange={(value) => setSection(value)}
                    items={forumSections}
            />
           <Text style={styles.text}>Description:</Text>
            <FilteredTextInput
                style={styles.desc}
                placeholder='Description'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setDescription(Text)}
                value={description}
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                multiline
            />
            <TouchableOpacity
                    style={styles.button}
                    onPress={() => onSubmitPress()}>
                    <Text style={styles.buttonTitle}>Create Forum Post</Text>
            </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    )
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