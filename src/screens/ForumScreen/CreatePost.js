import React, { useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../../config';


const sectionPlaceholder = {
    label: 'Forum Section',
    value: null,
    color: 'black',
};


export default function CreatePost ( {navigation} ) {
    const [title, setTitle] = useState('');
    const [section, setSection] = useState('');
    const [description, setDescription] = useState('');

    const onSubmitPress = async () => {
        try {
            await setDoc(doc(db, "forum", title), {
                title: title,
                section: section,
                description: description
            });
            
            navigation.navigate('Forum Screen')
        }
        catch (e) {
            console.log("Error adding Post: ", e);
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                {/*<Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                />*/}
            <Text style={styles.text}>Title:</Text>
            <TextInput
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
                    items={[
                        { label: 'Food', value: 'Food'},
                        { label: 'Outdoors', value: 'Outdoors' },
                        { label: 'Hotel Talk', value: 'Hotel Talk' },
                        { label: 'Travel Gadgets & Gear', value: 'Travel Gadgets & Gear' },
                        { label: 'Travelling with Pets', value: 'Travelling with Pets' },
                        { label: 'Solo Travel', value: 'Solo Travel' },
                        { label: 'Honeymoons and Romance', value: 'Honeymoons and Romance' },
                        { label: 'Family Travel', value: 'Family Travel' },
                    ]}
            />
           <Text style={styles.text}>Description:</Text>
            <TextInput
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