import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, mapSearch } from '../../../config';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilteredTextInput } from '../commonFunctions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const classPlaceholder = {
    label: 'Hotel Class',
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

const languagePlaceholder = {
    label: 'Language',
    value: null,
    color: 'black',
};

export default function AddHotel({ navigation }) {
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [hotelClass, setHotelClass] = useState('');
    const [checkInHour, setCheckInHour] = useState('');
    const [checkInMinute, setCheckInMinute] = useState('');
    const [checkOutHour, setCheckOutHour] = useState('');
    const [checkOutMinute, setCheckOutMinute] = useState('');
    const [language, setLanguage] = useState('');
    const [languageData, setLanguageData] = useState();
    const [description, setDescription] = useState('');
    const [TNC, setTNC] = useState('');
    const [image, setImage] = useState(null);
    const [docAmenitiesData, setAmenitiesData] = useState([])
    const [docRoomFeaturesData, setRoomFeaturesData] = useState([])
    const [address, setAddress] = useState();
    const [mapURL, setMapURL] = useState();
    const [latitude, setLat] = useState();
    const [longitude, setLong] = useState();
    const [capacity, setCapacity] = useState();
    const [imageCount, setImageCount] = useState(0)
    const [images, setImages] = useState([]);
    const [hotelRooms, setHotelRooms] = useState(1)
    const [price, setPrice] = useState()
    const [type, setType] = useState()
    const [roomTypes, setRoomTypes] = useState([]);
    const [currentRooms, setCurrentRooms] = useState([]);
    const [imageUploaded, setImageUploaded] = useState(false)

    const storage = getStorage();

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
        deleteFolder(`/hotels/${name}/images`)
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
        const listRef = ref(storage, `hotels/${name}/images`);
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
          const storageRef = ref(storage, `hotels/${name}/images/${fileName}`)
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

    const getData = async () => {
        const docRef = doc(db, "types", "AddHotel");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const amenitiesData = docSnap.data().amenitiesData
            const roomFeaturesData = docSnap.data().roomFeaturesData
            const roomTypesData = docSnap.data().roomTypesData
            setAmenitiesData(amenitiesData);
            setRoomFeaturesData(roomFeaturesData);
        }
        else {
            console.log("No data found")
        }
    }

    const getLanguages = async () => {
        const docRef = doc(db, "types", "commonFields");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const language = docSnap.data().preferredLanguage
            setLanguageData(language)
        }
        else {
            console.log("No data found")
        }
        setLoading(false)
    }

    useEffect(() => {
        if (loading) {
        getData();
        getLanguages()
        }
    }, [languageData]);
    
    const setAmenities = (item) => {
        
        setAmenitiesData(
            docAmenitiesData.map(curr => {
                if (item.name === curr.name) {
                    if (curr.isChecked == false) {
                        return {...curr, isChecked: true};
                        
                    }
                    else if (curr.isChecked == true) {
                        return {...curr, isChecked: false};
                    }
                }
                 else {
                    return curr;
                }
            })
        )
        //setUserAmenities(current => [...current, item.name]);
        console.log(docAmenitiesData);
    }

    const setRoomFeatures = (item) => {

        setRoomFeaturesData(
            docRoomFeaturesData.map(curr => {
                if (item.name === curr.name) {
                    if (curr.isChecked == false) {
                        return {...curr, isChecked: true};
                        
                    }
                    else if (curr.isChecked == true) {
                        return {...curr, isChecked: false};
                    }
                } else {
                    return curr;
                }
            })
        )
        //setUserRoomFeatures(current => [...current, item.name]);
        console.log(docRoomFeaturesData);
    }

    const submitRoomType = () => {
        const roomType = {type: type, price: price, capacity: capacity}
        currentRooms.push(...currentRooms, type)
        roomTypes.push(...roomTypes, roomType)
        console.log(roomTypes)
        alert("Room Type Submitted")
        setHotelRooms(hotelRooms + 1)
        setType('')
        setPrice('')
        setCapacity('')
    }

    const deleteRooms = () => {
        setRoomTypes([])
        alert("Room Types Deleted")
    }
    
    const onSubmitPress = async () => {
        if (email !== '' && name !== '' && roomTypes !== '' && hotelClass !== '' && 
            checkInHour !== '' && checkInMinute !== '' && checkOutHour !== '' && checkOutMinute !== '' && 
            docAmenitiesData !== '' && docRoomFeaturesData !== '' && language !== '' &&  address !== '' && 
            description !== '' && TNC !== '' && imageUploaded == true) {
            try {
                await setDoc(doc(db, "hotels", name), {
                    addedBy: email,
                    name: name,
                    roomTypes: roomTypes,
                    hotelClass: hotelClass,
                    checkInTime: checkInHour + ':' + checkInMinute,
                    checkOutTime: checkOutHour + ':' + checkOutMinute,
                    amenities: docAmenitiesData,
                    roomFeatures: docRoomFeaturesData,
                    language: language,
                    address: address,
                    longitude: longitude,
                    latitude: latitude,
                    mapURL: mapURL,
                    description: description,
                    TNC: TNC,
                    activityType: 'hotels',
                    images:images
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
                    autoCapitalize="words"
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
                <Text style={[styles.text, {fontSize:18}]}>Current Rooms: {JSON.stringify(currentRooms).replace(/[\[\]"]/g, "")}</Text>
                <Text style={[styles.text, {fontSize:18}]}>Room Type No: {hotelRooms}</Text>
                <Text style={styles.text}>Name of Room Type:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Room Type'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(Text) => setType(Text)}
                    value={type}
                    underlineColorAndroid="transparent"
                    autoCapitalize="words"
                />
                <Text style={styles.text}>Price:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Price'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(Text) => setPrice(Text)}
                    value={price}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    keyboardType="numeric"
                />
                <Text style={styles.text}>Amount of Rooms:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Amount of Rooms'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(Text) => setCapacity(Text)}
                    value={capacity}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    keyboardType="numeric"
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => submitRoomType()}>
                    <Text style={styles.buttonTitle}>Submit Room Type</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {backgroundColor: '#E4898b'}]} onPress={() => deleteRooms()} >
                    <Text>Delete All Room Types</Text>
                </TouchableOpacity>
                <Text style={styles.text}>Hotel Class:</Text>
                <RNPickerSelect
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    placeholder={classPlaceholder}
                    onValueChange={(value) => setHotelClass(value)}
                    items={[
                        { label: '⭐', value: '⭐' },
                        { label: '⭐⭐', value: '⭐⭐' },
                        { label: '⭐⭐⭐', value: '⭐⭐⭐' },
                        { label: '⭐⭐⭐⭐', value: '⭐⭐⭐⭐' },
                        { label: '⭐⭐⭐⭐⭐', value: '⭐⭐⭐⭐⭐' },
                    ]}
                />

                <Text style={styles.text}>Check-In Hours:</Text>
                {/*CheckIn Hour */}
                <RNPickerSelect
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    placeholder={hourPlaceholder}
                    onValueChange={(value) => setCheckInHour(value)}
                    items={[
                        { label: '00', value: '00' }, { label: '01', value: '01' }, { label: '02', value: '02' },
                        { label: '03', value: '03' }, { label: '04', value: '04' }, { label: '05', value: '05' },
                        { label: '06', value: '06' }, { label: '07', value: '07' }, { label: '08', value: '08' },
                        { label: '09', value: '09' }, { label: '10', value: '10' }, { label: '11', value: '11' },
                        { label: '12', value: '12' }, { label: '13', value: '13' }, { label: '14', value: '14' },
                        { label: '15', value: '15' }, { label: '16', value: '16' }, { label: '17', value: '17' },
                        { label: '18', value: '18' }, { label: '19', value: '19' }, { label: '20', value: '20' },
                        { label: '21', value: '21' }, { label: '22', value: '22' }, { label: '23', value: '23' },
                    ]}
                />
                {/*CheckIn Minute */}
                <RNPickerSelect
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    placeholder={minutePlaceholder}
                    onValueChange={(value) => setCheckInMinute(value)}
                    items={[
                        { label: '00', value: '00' }, { label: '01', value: '01' }, { label: '02', value: '02' },
                        { label: '03', value: '03' }, { label: '04', value: '04' }, { label: '05', value: '05' },
                        { label: '06', value: '06' }, { label: '07', value: '07' }, { label: '08', value: '08' },
                        { label: '09', value: '09' }, { label: '10', value: '10' }, { label: '11', value: '11' },
                        { label: '12', value: '12' }, { label: '13', value: '13' }, { label: '14', value: '14' },
                        { label: '15', value: '15' }, { label: '16', value: '16' }, { label: '17', value: '17' },
                        { label: '18', value: '18' }, { label: '19', value: '19' }, { label: '20', value: '20' },
                        { label: '21', value: '21' }, { label: '22', value: '22' }, { label: '23', value: '23' },
                        { label: '24', value: '24' }, { label: '25', value: '25' }, { label: '26', value: '26' },
                        { label: '27', value: '27' }, { label: '28', value: '28' }, { label: '29', value: '29' },
                        { label: '30', value: '30' }, { label: '31', value: '31' }, { label: '32', value: '32' },
                        { label: '33', value: '33' }, { label: '34', value: '34' }, { label: '35', value: '35' },
                        { label: '36', value: '36' }, { label: '37', value: '37' }, { label: '38', value: '38' },
                        { label: '39', value: '39' }, { label: '40', value: '40' }, { label: '41', value: '41' },
                        { label: '42', value: '42' }, { label: '43', value: '43' }, { label: '44', value: '44' },
                        { label: '45', value: '45' }, { label: '46', value: '46' }, { label: '47', value: '47' },
                        { label: '48', value: '48' }, { label: '49', value: '49' }, { label: '50', value: '50' },
                        { label: '51', value: '51' }, { label: '52', value: '52' }, { label: '53', value: '53' },
                        { label: '54', value: '54' }, { label: '55', value: '55' }, { label: '56', value: '56' },
                        { label: '57', value: '57' }, { label: '58', value: '58' }, { label: '59', value: '59' },
                    ]}
                />
                <Text style={styles.text}>Check-Out Hours:</Text>
                {/*CheckOut Hour */}
                <RNPickerSelect
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    placeholder={hourPlaceholder}
                    onValueChange={(value) => setCheckOutHour(value)}
                    items={[
                        { label: '00', value: '00' }, { label: '01', value: '01' }, { label: '02', value: '02' },
                        { label: '03', value: '03' }, { label: '04', value: '04' }, { label: '05', value: '05' },
                        { label: '06', value: '06' }, { label: '07', value: '07' }, { label: '08', value: '08' },
                        { label: '09', value: '09' }, { label: '10', value: '10' }, { label: '11', value: '11' },
                        { label: '12', value: '12' }, { label: '13', value: '13' }, { label: '14', value: '14' },
                        { label: '15', value: '15' }, { label: '16', value: '16' }, { label: '17', value: '17' },
                        { label: '18', value: '18' }, { label: '19', value: '19' }, { label: '20', value: '20' },
                        { label: '21', value: '21' }, { label: '22', value: '22' }, { label: '23', value: '23' },
                    ]}
                />
                {/*CheckOut Minute */}
                <RNPickerSelect
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    placeholder={minutePlaceholder}
                    onValueChange={(value) => setCheckOutMinute(value)}
                    items={[
                        { label: '00', value: '00' }, { label: '01', value: '01' }, { label: '02', value: '02' },
                        { label: '03', value: '03' }, { label: '04', value: '04' }, { label: '05', value: '05' },
                        { label: '06', value: '06' }, { label: '07', value: '07' }, { label: '08', value: '08' },
                        { label: '09', value: '09' }, { label: '10', value: '10' }, { label: '11', value: '11' },
                        { label: '12', value: '12' }, { label: '13', value: '13' }, { label: '14', value: '14' },
                        { label: '15', value: '15' }, { label: '16', value: '16' }, { label: '17', value: '17' },
                        { label: '18', value: '18' }, { label: '19', value: '19' }, { label: '20', value: '20' },
                        { label: '21', value: '21' }, { label: '22', value: '22' }, { label: '23', value: '23' },
                        { label: '24', value: '24' }, { label: '25', value: '25' }, { label: '26', value: '26' },
                        { label: '27', value: '27' }, { label: '28', value: '28' }, { label: '29', value: '29' },
                        { label: '30', value: '30' }, { label: '31', value: '31' }, { label: '32', value: '32' },
                        { label: '33', value: '33' }, { label: '34', value: '34' }, { label: '35', value: '35' },
                        { label: '36', value: '36' }, { label: '37', value: '37' }, { label: '38', value: '38' },
                        { label: '39', value: '39' }, { label: '40', value: '40' }, { label: '41', value: '41' },
                        { label: '42', value: '42' }, { label: '43', value: '43' }, { label: '44', value: '44' },
                        { label: '45', value: '45' }, { label: '46', value: '46' }, { label: '47', value: '47' },
                        { label: '48', value: '48' }, { label: '49', value: '49' }, { label: '50', value: '50' },
                        { label: '51', value: '51' }, { label: '52', value: '52' }, { label: '53', value: '53' },
                        { label: '54', value: '54' }, { label: '55', value: '55' }, { label: '56', value: '56' },
                        { label: '57', value: '57' }, { label: '58', value: '58' }, { label: '59', value: '59' },
                    ]}
                />
                <Text style={styles.text}>Amenities:</Text>
                {docAmenitiesData.map((item, index) => (
                    <View style={styles.checklist} key={index}>
                        <Checkbox style={styles.checkbox} value={item.isChecked} onValueChange={() => setAmenities(item)} />
                        <Text>{item.name}</Text>
                    </View>
                ))}
                
                <Text style={styles.text}>Room Features:</Text>
                {docRoomFeaturesData.map((item, index) => (
                    <View style={styles.checklist} key={index}>
                        <Checkbox style={styles.checkbox} value={item.isChecked} onValueChange={() => setRoomFeatures(item)} />
                        <Text>{item.name}</Text>
                    </View>
                ))}

                <Text style={styles.text}>Language Preferences:</Text>
                <RNPickerSelect
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    placeholder={languagePlaceholder}
                    placeholderTextColor="#aaaaaa"
                    onValueChange={(value) => setLanguage(value)}
                    items={languageData}
                />
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
                <Text style={styles.text}>Terms & Conditions:</Text>
                <FilteredTextInput
                    style={styles.desc}
                    placeholder='Terms & Conditions'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(Text) => setTNC(Text)}
                    value={TNC}
                    underlineColorAndroid="transparent"
                    autoCapitalize="sentences"
                    multiline
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onSubmitPress()}>
                    <Text style={styles.buttonTitle}>Add Hotel</Text>
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