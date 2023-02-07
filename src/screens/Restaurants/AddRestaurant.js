import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, mapSearch } from '../../../config';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilteredTextInput } from '../commonFunctions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

//Placeholders for SELECT lists
const typePlaceholder = {
    label: 'Type Of Cuisine',
    value: null,
    color: 'black',
};

const agePlaceholder = {
    label: 'Age Group',
    value: null,
    color: 'black',
};

const hourPlaceholder = {
    label: 'Hour',
    value: null,
    color: 'black',
};

const minutePlaceholder = {
    label: 'Minute',
    value: null,
    color: 'black',
};

const pricePlaceholder = {
    label: 'Price',
    value: null,
    color: 'black',
};

const languagePlaceholder = {
    label: 'Language',
    value: null,
    color: 'black',
};

export default function AddRestaurant ( { navigation }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [typeOfCuisine, setType] = useState('');
    const [typeOfCuisineData, setTypeData] = useState('');
    const [price, setPrice] = useState('');
    const [ageGroup, setAge] = useState('');
    const [groupSize, setGroupSize] = useState('');
    const [openingHour, setOpeningHour] = useState('');
    const [openingMinute, setOpeningMinute] = useState('');
    const [closingHour, setClosingHour] = useState('');
    const [closingMinute, setClosingMinute] = useState('');
    const [language, setLanguage] = useState('');
    const [description, setDescription] = useState('');
    const [TNC, setTNC] = useState('');
    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);
    const storage = getStorage();
    const [languageData, setLanguageData] = useState();
    const [ageGroupData, setAgeGroupData] = useState();
    const [loading, setLoading] = useState(true)
    const [capacity, setCapacity] = useState();
    const [address, setAddress] = useState();
    const [mapURL, setMapURL] = useState();
    const [latitude, setLat] = useState();
    const [longitude, setLong] = useState();
    const [imageCount, setImageCount] = useState(0)
    const [imageUploaded, setImageUploaded] = useState(false)

    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setEmail(email);
            }
            else {
                console.log("No Email Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }
    getEmail();

    const deleteImages = () => {
        deleteFolder(`/restaurants/${name}/images`)
        setImageUploaded(false)
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

    const getImages = async () => {
        const listRef = ref(storage, `restaurants/${name}/images`);
        Promise.all([
            listAll(listRef).then((res) => {
              const promises = res.items.map((folderRef) => {
                return getDownloadURL(folderRef).then((link) =>  {
                  return link;
                });
              });
              return Promise.all(promises);
            })
          ]).then((results) => {
            const fetchedImages = results[0];
            console.log(fetchedImages);
            console.log("Cover Image:", fetchedImages[0])
            setImages(fetchedImages);
            setImageUploaded(true)
          });
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
            const count = imageCount + 1
            setImageCount(count)
            getImages();
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
        deleteFolder(`restaurants/${name}/menu`);
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
        if (email !== '' && name !== '' && typeOfCuisine !== '' && price !== '' && ageGroup !== '' 
            && groupSize !== '' && openingHour !== '' && openingMinute !== '' && closingHour !== '' 
            && closingMinute !== '' && capacity !== '' && address !== '' && language !== '' 
            && description !== '' && TNC !== '' && imageUploaded == true) {
            try {
                await setDoc(doc(db, "restaurants", name), {
                    addedBy: email,
                    name: name,
                    typeOfCuisine: typeOfCuisine,
                    price: price,
                    ageGroup: ageGroup,
                    groupSize: groupSize,
                    timeSlots: timeSlots,
                    openingTime: openingHour + ':' + openingMinute,
                    closingTime: closingHour + ':' + closingMinute,
                    capacity:capacity,
                    address: address,
                    longitude: longitude,
                    latitude: latitude,
                    mapURL: mapURL,
                    language: language,
                    description: description,
                    activityType: 'restaurants',
                    images: images
                });
                //console.log("Document written with ID: ", docRef.id);
                navigation.navigate('BO Page')
            }
            catch (e) {
                console.log("Error adding document: ", e);
            }
            
        }
        else {
            alert('Please fill up all required information (incl images)')
        }
    }

    if (loading) {
        return <ActivityIndicator />;
    }


    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
            <Text style={styles.text}>Name:</Text>
            <TextInput
                style={styles.input}
                placeholder='Name'
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
            <Text style={styles.text}>Current Image Count: {imageCount}</Text>
            <TouchableOpacity style={[styles.button, {backgroundColor: '#E4898b'}]} onPress={deleteImages} >
                <Text>Delete All Uploaded Images</Text>
            </TouchableOpacity>
            <Text style={styles.text}>Type of Cuisine:</Text>
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                placeholder={typePlaceholder}
                onValueChange={(value) => setType(value)}
                items = {typeOfCuisineData}
            />
            <Text style={styles.text}>Price:</Text>
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                placeholder= {pricePlaceholder}
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
                placeholder={agePlaceholder}
                onValueChange={(value) => setAge(value)}
                items = {ageGroupData}
            />
            <Text style={styles.text}>Group Size:</Text>
            <TextInput
                style={styles.input}
                placeholder='Group Size'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setGroupSize(Text)}
                value={groupSize}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                keyboardType="numeric"
            />
            <Text style={styles.text}>Opening Hours:</Text>
            {/*Opening Hour */}
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                placeholder={hourPlaceholder}
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
                placeholder={minutePlaceholder}
                onValueChange={(value) => setOpeningMinute(value)}
                items = {[{label:'00', value:'00'}, {label:'30', value:'30'}]}
            />
            <Text style={styles.text}>Closing Hours:</Text>
            {/*Closing Hour */}
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                placeholder={hourPlaceholder}
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
                placeholder={minutePlaceholder}
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
                    placeholder={languagePlaceholder}
                    placeholderTextColor="#aaaaaa"
                    onValueChange={(value) => setLanguage(value)}
                    items={languageData}
                />

            <Text style={styles.text}>Menu:</Text>
            <TouchableOpacity style={[styles.button, {opacity: name ? 1: 0.2}]} onPress={pickMenu} 
                disabled={name ? false : true} >
                <Text>Upload Menu</Text>
            </TouchableOpacity>
            <Text style={styles.text}>Location:</Text>
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
                value={description}
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                multiline
            />
            <TouchableOpacity
                    style={styles.button}
                    onPress={() => onSubmitPress()}>
                    <Text style={styles.buttonTitle}>Add Restaurant</Text>
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