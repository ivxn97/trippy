import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator, Switch } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db, mapSearch } from '../../../config';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilteredTextInput } from '../commonFunctions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function EditWalkingTour({ route, navigation }) {
    const {name, location, tips, description, section, expired, images} = route.params;
    const [newTips, setTips] = useState(tips);
    const [newDescription, setDescription] = useState(description);
    const [locationCount, setLocationCount] = useState(1);
    const [locationArr, setLocationArr] = useState(location)
    const [loading, setLoading] = useState(true)
    const [sections, setSections] = useState([]);
    const [newSection, setSection] = useState(section);
    const [isExpired, setIsExpired] = useState(expired)
    const [imageCount, setImageCount] = useState(0)
    const [newImages, setImages] = useState(images);
    const [imageUploaded, setImageUploaded] = useState(true)

    const storage = getStorage();

    const typePlaceholder = {
        label: 'Section Category',
        value: null,
        color: 'black',
    };

    let locationString = '';
    locationArr.forEach((address) => {
        locationString += '[' + address.address + '],';
    })
    locationString = locationString.slice(0, -1);
    console.log(locationString)

    const deleteImages = () => {
        deleteFolder(`/walkingtours/${name}/images`)
        setImageUploaded(false)
    }

    function deleteFolder(path) {
        const listRef = ref(storage, path)
        listAll(listRef)
            .then(dir => {
            dir.items.forEach(fileRef => deleteObject(ref(storage, fileRef)));
            console.log("Files deleted successfully from Firebase Storage");
            alert("Images Deleted")
            setImageCount(0)
            })
        .catch(error => console.log(error));
    }

    const getImages = async () => {
        const listRef = ref(storage, `walkingtours/${name}/images`);
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
            setImages(fetchedImages);
            setImageUploaded(true)
          });
    }

    const getTypes = async ()  => {
        const querySnapshot = await getDocs(collection(db, "walking tour sections"));
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
          const storageRef = ref(storage, `walkingtours/${name}/images/${fileName}`)
          uploadBytes(storageRef, blobFile).then((snapshot) => {
            alert("Image uploaded!");
            console.log("Image uploaded!");
            const count = imageCount + 1
            setImageCount(count)
            getImages()
        })}
        else {
            console.log('No Image uploaded!')
        };
    };

    const addLocation = () => {
        if (locationCount < 5) {
            setLocationCount(locationCount + 1)
        }
        else {
            alert("you have reached the location limit")
        }
    }

    const locationArray = Array.from({length: locationCount}, (_, i) => 
    <GooglePlacesAutocomplete 
        placeholder={'Enter Location'}
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
        if (imageUploaded == true) {
            try {
                await setDoc(doc(db, "walkingtours", name), {
                    location: locationArr,
                    tips: newTips,
                    description: newDescription,
                    activityType: 'walkingtours',
                    section: newSection,
                    expired: isExpired,
                    images: newImages
                }, {merge:true});
                //console.log("Document written with ID: ", docRef.id);
                navigation.navigate('Profile Page')
            }
            catch (e) {
                console.log("Error adding document: ", e);
            }
        }
        else {
            alert('Please Upload images');
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
    
                <Text style={styles.text}>Walking Tour Name: {name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.text}>Mark as Expired: </Text>
                <Switch value={isExpired} onValueChange={() => setIsExpired(!isExpired)} />
                </View>
                <Text style={styles.text}>Upload Images:</Text>
                <TouchableOpacity style={[styles.button, {opacity: name ? 1: 0.2}]} onPress={pickImage}  >
                    <Text>Upload Image</Text>
                </TouchableOpacity>
                <Text style={styles.text}>New Image Count: {imageCount}</Text>
                <TouchableOpacity style={[styles.button, {backgroundColor: '#E4898b'}]} onPress={deleteImages} >
                <Text>Delete All Uploaded Images</Text>
                </TouchableOpacity>

                <Text style={styles.text}>Walking Tour Section:</Text>
                <RNPickerSelect
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    placeholder={typePlaceholder}
                    onValueChange={(value) => setSection(value)}
                    items = {sections}
                />
                <Text style={styles.text}>Current Locations: {locationString}</Text>
                <Text style={styles.text}>Change Locations:</Text>
                {locationArray}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => addLocation()}>
                    <Text style={styles.buttonName}>Add another location</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {backgroundColor: '#E4898b'}]} onPress={() => setLocationArr([])} >
                <Text>Delete All Locations</Text>
                </TouchableOpacity>
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
                    <Text style={styles.buttonName}>Edit Walking Tour</Text>
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