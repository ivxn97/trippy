import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db, mapSearch } from '../../../config';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, uploadString } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilteredTextInput } from '../commonFunctions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


export default function AddGuide({ navigation }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [mrt, setMRT] = useState('');
    const [tips, setTips] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState();
    const [section, setSection] = useState();
    const [mapURL, setMapURL] = useState();
    const [latitude, setLat] = useState();
    const [longitude, setLong] = useState();
    const [loading, setLoading] = useState(true)
    const [sections, setSections] = useState([]);
    const [locationCount, setLocationCount] = useState(1);
    const [locationArr, setLocationArr] = useState([])

    const typePlaceholder = {
        label: 'Section Category',
        value: null,
        color: 'black',
    };

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
    getEmail();

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [41, 25],
          quality: 1,
        });
    
        console.log(result);
        const fileName = result.uri.split('/').pop();
        const fileType = fileName.split('.').pop();
        console.log(fileName, fileType);

        const response = await fetch(result.uri)
        const blobFile = await response.blob()

        const storage = getStorage();
        if (!result.canceled) {
          const storageRef = ref(storage, `guides/${name}/images/${fileName}`)
          uploadBytes(storageRef, blobFile).then((snapshot) => {
            alert("Image uploaded!");
            console.log("Image uploaded!");
        })}
        else {
            console.log('No Image uploaded!')
        };
    };

    const getTypes = async ()  => {
        const querySnapshot = await getDocs(collection(db, "guide sections"));
        querySnapshot.forEach(documentSnapshot => {
          sections.push({label: documentSnapshot.data().name, value: documentSnapshot.data().name});
        });
        setLoading(false)
    }

    useEffect(() => {
        if (loading) {
        getTypes();
        }
    }) 

    const addLocation = () => {
        if (locationCount < 8) {
            setLocationCount(locationCount + 1)
        }
        else {
            alert("you have reached the location limit")
        }
    }

    const locationArray = Array.from({length: locationCount}, (_, i) => 
    <GooglePlacesAutocomplete 
        placeholder='Enter Location'
        fetchDetails
        GooglePlacesDetailsQuery={{fields: 'geometry,url'}}
        onPress={(data, details = null) => {
            console.log('Data address:', data.description,'Location Details: ', details)
            const lat = details.geometry.location.lat
            const long = details.geometry.location.lng
            const mapURL = details.url
            const address = data.description
            const createdArr = {address: address, mapURL: mapURL, lat: lat, long: long}
            setLocationArr(current=> [...current, createdArr])
        }}
        query={mapSearch}
        styles={{textInput:styles.input}}
    />);

    const onSubmitPress = async () => {
            try {
                await setDoc(doc(db, "guides", name), {
                    addedBy: email,
                    name: name,
                    location: locationArr,
                    expired: false,
                    mrt: mrt,
                    tips: tips,
                    description: description,
                    activityType: 'guides',
                    section: section
                });
                //console.log("Document written with ID: ", docRef.id);
                navigation.navigate('Profile Page')
            }
            catch (e) {
                console.log("Error adding document: ", e);
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
    
                <Text style={styles.text}>Guide Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Guide Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(Text) => setName(Text)}
                    value={name}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <Text style={styles.text}>Upload Images:</Text>
                <TouchableOpacity style={[styles.button, {opacity: name ? 1: 0.2}]} onPress={pickImage} 
                    disabled={name ? false : true} >
                    <Text>Upload Image</Text>
                </TouchableOpacity>

                <Text style={styles.text}>Guide Section:</Text>
                <RNPickerSelect
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    placeholder={typePlaceholder}
                    onValueChange={(value) => setSection(value)}
                    items = {sections}
                />
                
                <Text style={styles.text}>Location:</Text>
                {locationArray}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => addLocation()}>
                    <Text style={styles.buttonName}>Add another location</Text>
                </TouchableOpacity>

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
                <FilteredTextInput
                    style={styles.desc}
                    placeholder='Tips'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(Text) => setTips(Text)}
                    value={tips}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
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
                    <Text style={styles.buttonName}>Add Guide</Text>
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