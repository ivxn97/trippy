import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../../../config';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes, deleteObject, listAll } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilteredTextInput } from '../commonFunctions';
import {MultipleSelectList }from 'react-native-dropdown-select-list'

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
    const storage = getStorage();
    const [languageData, setLanguageData] = useState();
    const [ageGroupData, setAgeGroupData] = useState();
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState("")
    const [selectedTime, setTime] = useState([])
    const [capacity, setCapacity] = useState();

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
    /*
    const time = [
        {key:'0000', value: '0000'}, {key:'0015', value: '0015'}, {key:'0030', value: '0030'}, {key:'0045', value: '0045'},
        {key:'0100', value: '0100'}, {key:'0115', value: '0115'}, {key:'0130', value: '0130'}, {key:'0145', value: '0145'},
        {key:'0200', value: '0200'}, {key:'0215', value: '0215'}, {key:'0230', value: '0230'}, {key:'0245', value: '0245'},
        {key:'0300', value: '0300'}, {key:'0315', value: '0315'}, {key:'0330', value: '0330'}, {key:'0345', value: '0345'},
        {key:'0400', value: '0400'}, {key:'0415', value: '0415'}, {key:'0430', value: '0430'}, {key:'0445', value: '0445'},
        {key:'0500', value: '0500'}, {key:'0515', value: '0515'}, {key:'0530', value: '0530'}, {key:'0545', value: '0545'},
        {key:'0600', value: '0600'}, {key:'0615', value: '0615'}, {key:'0630', value: '0630'}, {key:'0645', value: '0645'},
        {key:'0700', value: '0700'}, {key:'0715', value: '0715'}, {key:'0730', value: '0730'}, {key:'0745', value: '0745'},
        {key:'0800', value: '0800'}, {key:'0815', value: '0815'}, {key:'0830', value: '0830'}, {key:'0845', value: '0845'},
        {key:'0900', value: '0900'}, {key:'0915', value: '0915'}, {key:'0930', value: '0930'}, {key:'0945', value: '0945'},
        {key:'1000', value: '1000'}, {key:'1015', value: '1015'}, {key:'1030', value: '1030'}, {key:'1045', value: '1045'},
        {key:'1100', value: '1100'}, {key:'1115', value: '1115'}, {key:'1130', value: '1130'}, {key:'1145', value: '1145'},
        {key:'1200', value: '1200'}, {key:'1215', value: '1215'}, {key:'1230', value: '1230'}, {key:'1245', value: '1245'},
        {key:'1300', value: '1300'}, {key:'1315', value: '1315'}, {key:'1330', value: '1330'}, {key:'1345', value: '1345'},
        {key:'1400', value: '1400'}, {key:'1415', value: '1415'}, {key:'1430', value: '1430'}, {key:'1445', value: '1445'},
        {key:'1500', value: '1500'}, {key:'1515', value: '1515'}, {key:'1530', value: '1530'}, {key:'1545', value: '1545'},
        {key:'1600', value: '1600'}, {key:'1615', value: '1615'}, {key:'1630', value: '1630'}, {key:'1645', value: '1645'},
        {key:'1700', value: '1700'}, {key:'1715', value: '1715'}, {key:'1730', value: '1730'}, {key:'1745', value: '1745'},
        {key:'1800', value: '1800'}, {key:'1815', value: '1815'}, {key:'1830', value: '1830'}, {key:'1845', value: '1845'},
        {key:'1900', value: '1900'}, {key:'1915', value: '1915'}, {key:'1930', value: '1930'}, {key:'1945', value: '1945'},
        {key:'2000', value: '2000'}, {key:'2015', value: '2015'}, {key:'2030', value: '2030'}, {key:'2045', value: '2045'},
        {key:'2100', value: '2100'}, {key:'2115', value: '2115'}, {key:'2130', value: '2130'}, {key:'2145', value: '2145'},
        {key:'2200', value: '2200'}, {key:'2215', value: '2215'}, {key:'2230', value: '2230'}, {key:'2245', value: '2245'},
        {key:'2300', value: '2300'}, {key:'2315', value: '2315'}, {key:'2330', value: '2330'}, {key:'2345', value: '2345'},
    ]
*/
    const onSubmitPress = async () => {
        const timeSlots = [];
        for (let i = openingHour; i <= closingHour; i++) {
            for (let j = openingMinute; j <= 60; j+= 30) {
                if (i === closingHour && j > closingMinute) {
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
        /*
            try {
                await setDoc(doc(db, "restaurants", name), {
                    addedBy: email,
                    name: name,
                    typeOfCuisine: typeOfCuisine,
                    price: price,
                    ageGroup: ageGroup,
                    groupSize: groupSize,
                    openingTime: openingHour + ':' + openingMinute,
                    closingTime: closingHour + ':' + closingMinute,
                    location: '',
                    language: language,
                    description: description,
                    TNC: TNC,
                    activityType: 'restaurants'
                });
                //console.log("Document written with ID: ", docRef.id);
                navigation.navigate('BO Page')
            }
            catch (e) {
                console.log("Error adding document: ", e);
            }
            */
        }

    if (loading) {
        return <ActivityIndicator />;
    }


    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
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
                items = {[
                    {label:'00', value:'00'}, {label:'01', value:'01'}, {label:'02', value:'02'},
                    {label:'03', value:'03'}, {label:'04', value:'04'}, {label:'05', value:'05'},
                    {label:'06', value:'06'}, {label:'07', value:'07'}, {label:'08', value:'08'},
                    {label:'09', value:'09'}, {label:'10', value:'10'}, {label:'11', value:'11'},
                    {label:'12', value:'12'}, {label:'13', value:'13'}, {label:'14', value:'14'},
                    {label:'15', value:'15'}, {label:'16', value:'16'}, {label:'17', value:'17'},
                    {label:'18', value:'18'}, {label:'19', value:'19'}, {label:'20', value:'20'},
                    {label:'21', value:'21'}, {label:'22', value:'22'}, {label:'23', value:'23'},
                    {label:'24', value:'24'}, {label:'25', value:'25'}, {label:'26', value:'26'},
                    {label:'27', value:'27'}, {label:'28', value:'28'}, {label:'29', value:'29'},
                    {label:'30', value:'30'}, {label:'31', value:'31'}, {label:'32', value:'32'},
                    {label:'33', value:'33'}, {label:'34', value:'34'}, {label:'35', value:'35'},
                    {label:'36', value:'36'}, {label:'37', value:'37'}, {label:'38', value:'38'},
                    {label:'39', value:'39'}, {label:'40', value:'40'}, {label:'41', value:'41'},
                    {label:'42', value:'42'}, {label:'43', value:'43'}, {label:'44', value:'44'},
                    {label:'45', value:'45'}, {label:'46', value:'46'}, {label:'47', value:'47'},
                    {label:'48', value:'48'}, {label:'49', value:'49'}, {label:'50', value:'50'},
                    {label:'51', value:'51'}, {label:'52', value:'52'}, {label:'53', value:'53'},
                    {label:'54', value:'54'}, {label:'55', value:'55'}, {label:'56', value:'56'},
                    {label:'57', value:'57'}, {label:'58', value:'58'}, {label:'59', value:'59'},
                ]}
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
                items = {[
                    {label:'00', value:'00'}, {label:'01', value:'01'}, {label:'02', value:'02'},
                    {label:'03', value:'03'}, {label:'04', value:'04'}, {label:'05', value:'05'},
                    {label:'06', value:'06'}, {label:'07', value:'07'}, {label:'08', value:'08'},
                    {label:'09', value:'09'}, {label:'10', value:'10'}, {label:'11', value:'11'},
                    {label:'12', value:'12'}, {label:'13', value:'13'}, {label:'14', value:'14'},
                    {label:'15', value:'15'}, {label:'16', value:'16'}, {label:'17', value:'17'},
                    {label:'18', value:'18'}, {label:'19', value:'19'}, {label:'20', value:'20'},
                    {label:'21', value:'21'}, {label:'22', value:'22'}, {label:'23', value:'23'},
                    {label:'24', value:'24'}, {label:'25', value:'25'}, {label:'26', value:'26'},
                    {label:'27', value:'27'}, {label:'28', value:'28'}, {label:'29', value:'29'},
                    {label:'30', value:'30'}, {label:'31', value:'31'}, {label:'32', value:'32'},
                    {label:'33', value:'33'}, {label:'34', value:'34'}, {label:'35', value:'35'},
                    {label:'36', value:'36'}, {label:'37', value:'37'}, {label:'38', value:'38'},
                    {label:'39', value:'39'}, {label:'40', value:'40'}, {label:'41', value:'41'},
                    {label:'42', value:'42'}, {label:'43', value:'43'}, {label:'44', value:'44'},
                    {label:'45', value:'45'}, {label:'46', value:'46'}, {label:'47', value:'47'},
                    {label:'48', value:'48'}, {label:'49', value:'49'}, {label:'50', value:'50'},
                    {label:'51', value:'51'}, {label:'52', value:'52'}, {label:'53', value:'53'},
                    {label:'54', value:'54'}, {label:'55', value:'55'}, {label:'56', value:'56'},
                    {label:'57', value:'57'}, {label:'58', value:'58'}, {label:'59', value:'59'},
                ]}
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
            <TextInput
                style={styles.input}
                placeholder='Enter Location Name'
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
            />
            {/* insert google maps API and mapview here
            https://betterprogramming.pub/google-maps-and-places-in-a-real-world-react-native-app-100eff7474c6 */}
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