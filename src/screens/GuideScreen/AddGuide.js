import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../../config';
import Checkbox from 'expo-checkbox';


//TODO: add image uploading, add account linkage for all Adds
export default function AddGuide({ navigation }) {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [mrt, setMRT] = useState('');
    const [tips, setTips] = useState('');
    const [description, setDescription] = useState('');

    const onSubmitPress = async () => {
            try {
                await setDoc(doc(db, "guides", title), {
                    title: title,
                    location: location,
                    mrt: mrt,
                    tips: tips,
                    description: description
                });
                //console.log("Document written with ID: ", docRef.id);
                navigation.navigate('Profile Page')
            }
            catch (e) {
                console.log("Error adding document: ", e);
            }
        }
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                
                <Text style={styles.text}>Upload Images:</Text>
                <Image
                    style={styles.imagePlaceholder}
                    source={require('../../../assets/imageUpload4.png')}
                />
                <Text style={styles.text}>Guide Title:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Guide Title'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(Text) => setTitle(Text)}
                    value={title}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                
                <Text style={styles.text}>Location:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Location Name'
                    placeholderTextColor="#aaaaaa"
                    underlineColorAndroid="transparent"
                    onChangeText={(Text) => setLocation(Text)}
                    value={location}
                    autoCapitalize="sentences"
                />
                {/* insert google maps API and mapview here
            https://betterprogramming.pub/google-maps-and-places-in-a-real-world-react-native-app-100eff7474c6 */}

                <Text style={styles.text}>Nearest MRT:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='MRT'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(Text) => setMRT(Text)}
                    value={mrt}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <Text style={styles.text}>Tips:</Text>
                <TextInput
                    style={styles.desc}
                    placeholder='Tips'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(Text) => setTips(Text)}
                    value={tips}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
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
                    <Text style={styles.buttonTitle}>Add Guide</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    )
}