import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, mapSearch } from '../../../config';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, deleteObject, listAll } from "firebase/storage";
import { FilteredTextInput } from '../commonFunctions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import moment from 'moment';


export default function EditPaidTour ( { route, navigation }) {
    const {name, tourType, price, ageGroup, groupSize, startingTime, endingTime, language, duration, description, TNC, address, capacity} = route.params;

    const [startingHour, startingMinute] = startingTime.split(":");
    const [endingHour, endingMinute] = endingTime.split(":");

    const [newTourType, setType] = useState(tourType);
    const [newPrice, setPrice] = useState(price);
    const [newAgeGroup, setAge] = useState(ageGroup);
    const [newGroupSize, setGroupSize] = useState(groupSize);
    const [newStartingHour, setStartingHour] = useState(startingHour);
    const [newStartingMinute, setStartingMinute] = useState(startingMinute);
    const [newEndingMinute, setEndingMinute] = useState(endingHour);
    const [newEndingHour, setEndingHour] = useState(endingMinute);
    const [newDescription, setDescription] = useState(description);
    const [newTNC, setTNC] = useState(TNC);
    const [newLanguage, setLanguage] = useState(language);
    const [newDurationMinute, setDurationMinute] = useState(duration);
    const [image, setImage] = useState(null);
    const storage = getStorage();
    const [languageData, setLanguageData] = useState();
    const [tourTypeData, setTourTypeData] = useState();
    const [ageGroupData, setAgeGroupData] = useState();
    const [newCapacity, setCapacity] = useState(capacity);
    const [newAddress, setAddress] = useState();
    const [mapURL, setMapURL] = useState();
    const [latitude, setLat] = useState();
    const [longitude, setLong] = useState();
    const [loading, setLoading] = useState(true)
    const [imageCount, setImageCount] = useState(0)


    const deleteImages = () => {
        deleteFolder(`/paidtours/${name}/images`)
    }

    function deleteFolder(path) {
        const listRef = ref(storage, path)
        listAll(listRef)
            .then(dir => {
            dir.items.forEach(fileRef => deleteObject(ref(storage, fileRef)));
            console.log("Files deleted successfully from Firebase Storage");
            setImageCount(0)
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
          const storageRef = ref(storage, `paidtours/${name}/images/${fileName}`)
          uploadBytes(storageRef, blobFile).then((snapshot) => {
            alert("Image uploaded!");
            console.log("Image uploaded!");
            const count = imageCount + 1
            setImageCount(count)
        })}
        else {
            console.log('No Image uploaded!')
        };
    };

    const getTourTypes = async () => {
        const docRef = doc(db, "types", "AddPaidTour");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const paidTourType = docSnap.data().paidTourType
            setTourTypeData(paidTourType)
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
            getTourTypes();
            getData();
        }
    }, [ageGroupData]);

    const onSubmitPress = async () => {
        const timeSlots = [];

        const startingTime = startingHour+startingMinute
        const endingTime = endingHour+endingMinute
        const interval = durationMinute

        let currentTime = moment(startingTime, 'HHmm');

        while (currentTime.isBefore(moment(endingTime, 'HHmm'))) {
            timeSlots.push({
                time: currentTime.format('HHmm'),
                capacity: capacity
            })
            currentTime.add(interval, 'minutes');
        }

        console.log(timeSlots)
            try {
                await setDoc(doc(db, "paidtours", name), {
                    tourType: tourType,
                    language: language,
                    price: price,
                    ageGroup: ageGroup,
                    groupSize: groupSize,
                    timeSlots: timeSlots,
                    startingTime: startingHour + ':' + startingMinute,
                    endingTime: endingHour + ':' + endingMinute,
                    duration: durationMinute,
                    description: description,
                    TNC: TNC,
                    capacity: newCapacity,
                    address: newAddress,
                    longitude: longitude,
                    latitude: latitude,
                    mapURL: mapURL,
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
            <Text style={[styles.text, {fontSize:20}]}>Title: {JSON.stringify(name).replace(/"/g,"")}</Text>
            <Text style={styles.text}>Upload Images:</Text>
                <TouchableOpacity style={styles.button} onPress={pickImage}  >
                    <Text>Upload New Image</Text>
                </TouchableOpacity>
                <Text style={styles.text}>New Image Count: {imageCount}</Text>
                <TouchableOpacity style={[styles.button, {backgroundColor: '#E4898b'}]} onPress={deleteImages} >
                <Text>Delete All Uploaded Images</Text>
            </TouchableOpacity>
            <Text style={styles.text}>Paid Tour Type:</Text>
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                value={newTourType}
                onValueChange={(value) => setType(value)}
                items = {tourTypeData}
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

            <Text style={styles.text}>Price:</Text>
            <TextInput
                style={styles.input}
                placeholder='Price'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setPrice(Text)}
                value={newPrice}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                keyboardType="numeric"
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
            <Text style={styles.text}>Starting Time:</Text>
            {/*Opening Hour */}
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                value={newStartingHour}
                onValueChange={(value) => setStartingHour(value)}
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
                value={newStartingMinute}
                onValueChange={(value) => setStartingMinute(value)}
                items = {[{label:'00', value:'00'}, {label:'15', value:'15'}, {label:'30', value:'30'}, {label:'45', value:'45'},]}
                />
            
            <Text style={styles.text}>Ending Time:</Text>
            {/*Ending Hour */}
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                value={newEndingHour}
                onValueChange={(value) => setEndingHour(value)}
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

            {/*Ending Minute */}
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                value={newEndingMinute}
                onValueChange={(value) => setEndingMinute(value)}
                items = {[{label:'00', value:'00'}, {label:'15', value:'15'}, {label:'30', value:'30'}, {label:'45', value:'45'},]}
                />

            <Text style={styles.text}>Duration in minutes:</Text>
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                onValueChange={(value) => setDurationMinute(value)}
                items = {[
                    {label:'15', value:'15'}, 
                    {label:'30', value:'30'}, 
                    {label:'45', value:'45'},
                    {label:'60', value:'60'},
                    {label:'75', value:'75'},
                    {label:'90', value:'90'},
                    {label:'105', value:'105'},
                    {label:'120', value:'120'},
                    {label:'150', value:'150'},
                    {label:'180', value:'180'},
                ]}
            />

            <Text style={styles.text}>Capacity:</Text>
            <TextInput
                style={styles.input}
                placeholder='Enter Capacity'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setCapacity(Text)}
                value={capacity}
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                keyboardType="numeric"
            />

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
                    <Text style={styles.buttonTitle}>Edit Paid Tour</Text>
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