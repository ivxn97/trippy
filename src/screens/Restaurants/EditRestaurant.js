import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, mapSearch } from '../../../config';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes, deleteObject, listAll } from "firebase/storage";
import { FilteredTextInput } from '../commonFunctions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function EditRestaurant ( { route, navigation }) {
    const {name, typeOfCuisine, price, ageGroup, groupSize, openingTime, closingTime, language, description, TNC, capacity, address} = route.params;

    const [openingHour, openingMinute] = openingTime.split(":");
    const [closingHour, closingMinute] = closingTime.split(":");

    const [newTypeOfCuisine, setType] = useState(typeOfCuisine);
    const [newPrice, setPrice] = useState(price);
    const [newAgeGroup, setAge] = useState(ageGroup);
    const [newGroupSize, setGroupSize] = useState(groupSize);
    const [newOpeningHour, setOpeningHour] = useState(openingHour);
    const [newOpeningMinute, setOpeningMinute] = useState(openingMinute);
    const [newClosingHour, setClosingHour] = useState(closingHour);
    const [newClosingMinute, setClosingMinute] = useState(closingMinute);
    const [newLanguage, setLanguage] = useState(language);
    const [newDescription, setDescription] = useState(description);
    const [newTNC, setTNC] = useState(TNC);
    const [image, setImage] = useState(null);
    const storage = getStorage();
    const [typeOfCuisineData, setTypeData] = useState('');
    const [languageData, setLanguageData] = useState();
    const [ageGroupData, setAgeGroupData] = useState();
    const [loading, setLoading] = useState(true)
    const [newCapacity, setCapacity] = useState(capacity);
    const [newAddress, setAddress] = useState();
    const [mapURL, setMapURL] = useState();
    const [latitude, setLat] = useState();
    const [longitude, setLong] = useState();

    const deleteImages = () => {
        deleteFolder(`/restaurants/${name}/images`)
    }

    function deleteFolder(path) {
        const listRef = ref(storage, path)
        listAll(listRef)
            .then(dir => {
            dir.items.forEach(fileRef => deleteObject(ref(storage, fileRef)));
            console.log("Files deleted successfully from Firebase Storage");
            })
        .catch(error => console.log(error));
    }

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
          setImage(result.uri);
          const storageRef = ref(storage, `restaurants/${name}/images/${fileName}`)
          uploadBytes(storageRef, blobFile).then((snapshot) => {
            alert("Image uploaded!");
            console.log("Image uploaded!");
        })}
        else {
            console.log('No Image uploaded!')
        };
    };

    const pickMenu = async () => {
        let result = await DocumentPicker.getDocumentAsync({});
    
        console.log(result);
        const fileName = result.uri.split('/').pop();
        const fileType = fileName.split('.').pop();
        console.log(fileName, fileType);
    
        const response = await fetch(result.uri)
        const blobFile = await response.blob()
    
        const storage = getStorage();
        if (!result.canceled) {
          setMenu(result.uri);
          deleteFolder(`restaurants/${name}/menu`)
          const storageRef = ref(storage, `restaurants/${name}/menu/${fileName}`)
          uploadBytes(storageRef, blobFile).then((snapshot) => {
            alert("Menu uploaded!");
            console.log("Menu uploaded!");
        })}
        else {
            console.log('No Menu uploaded!')
        };
    };

    const getCuisine = async () => {
        const docRef = doc(db, "types", "AddRestaurant");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const typesOfCuisine = docSnap.data().typesOfCuisine
            setTypeData(typesOfCuisine)
        }
        else {
            console.log("No data found")
        }
    }

    const getData = async () => {
        const docRef = doc(db, "types", "commonFields");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const language = docSnap.data().preferredLanguage
            const ageGroup = docSnap.data().ageGroup
            setLanguageData(language)
            setAgeGroupData(ageGroup)
        }
        else {
            console.log("No data found")
        }
        setLoading(false)
    }

    useEffect(() => {
        if (loading) {
            getCuisine();
            getData();
        }
    }, [ageGroupData]);

    const onSubmitPress = async () => {
        const timeSlots = [];
        for (let i = Number(openingHour); i <= Number(closingHour); i++) {
            for (let j = Number(openingMinute); j < 60; j+= 30) {
                if (i === Number(closingHour) && j > Number(closingMinute)) {
                    break;
                }
                let time = i + '';
                    if (j === 0) {
                        time += '00';
                    } else {
                    time += j;
                    }
                    //Add time slot to the array
                    timeSlots.push({
                    time: time,
                    capacity: capacity
                });
            }
        }
        console.log(timeSlots)
            try {
                await setDoc(doc(db, "restaurants", name), {
                    typeOfCuisine: newTypeOfCuisine,
                    price: newPrice,
                    ageGroup: newAgeGroup,
                    groupSize: newGroupSize,
                    timeSlots: timeSlots,
                    openingTime: newOpeningHour + ':' + newOpeningMinute,
                    closingTime: newClosingHour + ':' + newClosingMinute,
                    capacity: newCapacity,
                    address: newAddress,
                    longitude: longitude,
                    latitude: latitude,
                    mapURL: mapURL,
                    language: newLanguage,
                    description: newDescription,
                    TNC: newTNC
                }, {merge:true});
                //console.log("Document written with ID: ", docRef.id);
                navigation.navigate('BO Page')
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
            <Text style={[styles.text, {fontSize:20}]}>Name: {JSON.stringify(name).replace(/"/g,"")}</Text>
            <Text style={styles.text}>Upload Images:</Text>
            <TouchableOpacity style={styles.button} onPress={pickImage} >
                <Text>Upload New Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor: '#E4898b'}]} onPress={deleteImages} >
                <Text>Delete All Uploaded Images</Text>
            </TouchableOpacity>
            <Text style={styles.text}>Type of Cuisine:</Text>
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                value={newTypeOfCuisine}
                onValueChange={(value) => setType(value)}
                items = {typeOfCuisineData}
            />
            <Text style={styles.text}>Price:</Text>
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                value={newPrice}
                onValueChange={(value) => setPrice(value)}
                items = {[
                    {label:'$', value:'$'},
                    {label:'$$', value:'$$'},
                    {label:'$$$', value:'$$$'},
                    {label:'$$$$', value:'$$$$'},
                    {label:'$$$$$', value:'$$$$$'},
                ]}
            />
            <Text style={styles.text}>Age Group:</Text>
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                value={newAgeGroup}
                onValueChange={(value) => setAge(value)}
                items = {ageGroupData}
            />
            <Text style={styles.text}>Group Size:</Text>
            <TextInput
                style={styles.input}
                placeholder='Group Size'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setGroupSize(Text)}
                value={newGroupSize}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                keyboardType="numeric"
            />
            <Text style={styles.text}>Opening Hours:</Text>
            {/*Opening Hour */}
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                value={newOpeningHour}
                onValueChange={(value) => setOpeningHour(value)}
                items = {[
                    {label:'00', value:'00'}, {label:'01', value:'01'}, {label:'02', value:'02'},
                    {label:'03', value:'03'}, {label:'04', value:'04'}, {label:'05', value:'05'},
                    {label:'06', value:'06'}, {label:'07', value:'07'}, {label:'08', value:'08'},
                    {label:'09', value:'09'}, {label:'10', value:'10'}, {label:'11', value:'11'},
                    {label:'12', value:'12'}, {label:'13', value:'13'}, {label:'14', value:'14'},
                    {label:'15', value:'15'}, {label:'16', value:'16'}, {label:'17', value:'17'},
                    {label:'18', value:'18'}, {label:'19', value:'19'}, {label:'20', value:'20'},
                    {label:'21', value:'21'}, {label:'22', value:'22'}, {label:'23', value:'23'},
                ]}
            />
            {/*Opening Minute */}
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                value={newOpeningMinute}
                onValueChange={(value) => setOpeningMinute(value)}
                items = {[{label:'00', value:'00'}, {label:'30', value:'30'}]}
            />
            <Text style={styles.text}>Closing Hours:</Text>
            {/*Closing Hour */}
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                value={newClosingHour}
                onValueChange={(value) => setClosingHour(value)}
                items = {[
                    {label:'00', value:'00'}, {label:'01', value:'01'}, {label:'02', value:'02'},
                    {label:'03', value:'03'}, {label:'04', value:'04'}, {label:'05', value:'05'},
                    {label:'06', value:'06'}, {label:'07', value:'07'}, {label:'08', value:'08'},
                    {label:'09', value:'09'}, {label:'10', value:'10'}, {label:'11', value:'11'},
                    {label:'12', value:'12'}, {label:'13', value:'13'}, {label:'14', value:'14'},
                    {label:'15', value:'15'}, {label:'16', value:'16'}, {label:'17', value:'17'},
                    {label:'18', value:'18'}, {label:'19', value:'19'}, {label:'20', value:'20'},
                    {label:'21', value:'21'}, {label:'22', value:'22'}, {label:'23', value:'23'},
                ]}
            />
            {/*Closing Minute */}
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                value={newClosingMinute}
                onValueChange={(value) => setClosingMinute(value)}
                items = {[{label:'00', value:'00'}, {label:'30', value:'30'}]}
            />

            <Text style={styles.text}>Capacity:</Text>
            <TextInput
                style={styles.input}
                placeholder='Enter Capacity Per 30 minutes interval'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setCapacity(Text)}
                value={capacity}
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                keyboardType="numeric"
            />

            <Text style={styles.text}>Language Preferences:</Text>
            <RNPickerSelect
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    value={newLanguage}
                    placeholderTextColor="#aaaaaa"
                    onValueChange={(value) => setLanguage(value)}
                    items={languageData}
                />

            <Text style={styles.text}>Menu:</Text>
            <TouchableOpacity style={[styles.button, {opacity: name ? 1: 0.2}]} onPress={pickMenu} 
                disabled={name ? false : true} >
                <Text>Upload New Menu</Text>
            </TouchableOpacity>
            <Text style={styles.text}>Location:</Text>
            <GooglePlacesAutocomplete 
                placeholder={address}
                fetchDetails
                GooglePlacesDetailsQuery={{fields: 'geometry,url'}}
                onPress={(data, details = null) => {
                    console.log('Data address:', data.description,'Location Details: ', details)
                    const lat = details.geometry.location.lat
                    const long = details.geometry.location.lng
                    const mapURL = details.url
                    const address = data.description
                    setLat(lat);
                    setLong(long);
                    setMapURL(mapURL);
                    setAddress(address);
                }}
                query={mapSearch}
                styles={{textInput:styles.input}}/>
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
            <Text style={styles.text}>Terms & Conditions:</Text>
            <FilteredTextInput
                style={styles.desc}
                placeholder='Terms & Conditions'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setTNC(Text)}
                value={newTNC}
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                multiline
            />
            <TouchableOpacity
                    style={styles.button}
                    onPress={() => onSubmitPress()}>
                    <Text style={styles.buttonTitle}>Edit Restaurant</Text>
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
        paddingLeft: 16,
        color: 'black'
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
        paddingLeft: 16,
        color: 'black'
      }
})