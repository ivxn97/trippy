import React, { useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../../config';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, deleteObject, listAll } from "firebase/storage";
import { FilteredTextInput } from '../commonFunctions';

export default function EditAttraction ( { route, navigation }) {
    const {name, attractionType, price, ageGroup, groupSize, openingTime, closingTime, description,language, TNC} = route.params;
    const [openingHour, openingMinute] = openingTime.split(":");
    const [closingHour, closingMinute] = closingTime.split(":");

    const [newAttractionType, setType] = useState(attractionType);
    const [newPrice, setPrice] = useState(price);
    const [newAgeGroup, setAge] = useState(ageGroup);
    const [newGroupSize, setGroupSize] = useState(groupSize);
    const [newOpeningHour, setOpeningHour] = useState(openingHour);
    const [newOpeningMinute, setOpeningMinute] = useState(openingMinute);
    const [newClosingHour, setClosingHour] = useState(closingHour);
    const [newClosingMinute, setClosingMinute] = useState(closingMinute);
    const [newDescription, setDescription] = useState(description);
    const [newLanguage, setLanguage] = useState(language);
    const [newTNC, setTNC] = useState(TNC);
    const [image, setImage] = useState(null);
    const storage = getStorage();

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
          const storageRef = ref(storage, `attractions/${name}/images/${fileName}`)
          uploadBytes(storageRef, blobFile).then((snapshot) => {
            alert("Image uploaded!");
            console.log("Image uploaded!");
        })}
        else {
            console.log('No Image uploaded!')
        };
    };

    const deleteImages = () => {
        deleteFolder(`/attractions/${name}/images`)
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

      
    const onSubmitPress = async () => {
            try {
                await setDoc(doc(db, "attractions", name), {
                    attractionType: newAttractionType,
                    price: newPrice,
                    ageGroup: newAgeGroup,
                    groupSize: newGroupSize,
                    openingTime: newOpeningHour + ':' + newOpeningMinute,
                    closingTime: newClosingHour + ':' + newClosingMinute,
                    location: '',
                    description: newDescription,
                    language: newLanguage,
                    TNC: newTNC
                });
                navigation.navigate('BO Page')
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
            <Text style={[styles.text, {fontSize:20}]}>Name: {JSON.stringify(name).replace(/"/g,"")}</Text>
            <Text style={styles.text}>Upload Images:</Text>
            <TouchableOpacity style={styles.button} onPress={pickImage} >
                <Text>Upload New Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor: '#E4898b'}]} onPress={deleteImages} >
                <Text>Delete All Uploaded Images</Text>
            </TouchableOpacity>
            <Text style={styles.text}>Attraction Type:</Text>
            <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                value={newAttractionType}
                onValueChange={(value) => setType(value)}
                items = {[
                    {label:'Museum', value:'Museum'},
                    {label:'Theme Park', value:'Theme Park'},
                    {label:'Natural Landscape', value:'Natural Landscape'},
                    {label:'Observation Site', value:'Observation Site'},
                    {label:'Historical Site', value:'Historical Site'},
                    {label:'Regular Show', value:'Regular Show'},
                    {label:'Aquariums & Zoos', value:'Aquariums & Zoos'},
                    {label:'Outdoors', value:'Outdoors'},
                ]}
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
                items = {[
                    {label:'All Ages', value:'All Ages'},
                    {label:'13+', value:'13+'},
                    {label:'18+', value:'18+'},
                    {label:'Adults Only', value:'Adults Only'},
                ]}
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
            <Text style={styles.text}>Language Preferences:</Text>
            <RNPickerSelect
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    value={newLanguage}
                    placeholderTextColor="#aaaaaa"
                    onValueChange={(value) => setLanguage(value)}
                    items={[
                        { label: 'Any', value: 'Any'},
                        { label: 'English', value: 'English' },
                        { label: 'Chinese', value: 'Chinese' },
                    ]}
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
            <TextInput
                style={styles.input}
                placeholder='Enter Location Name'
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
            />
            {/* insert google maps API and mapview here
            https://betterprogramming.pub/google-maps-and-places-in-a-real-world-react-native-app-100eff7474c6 */}
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
                    <Text style={styles.buttonTitle}>Edit Attraction</Text>
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
        color:'black'
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
        color:'black'
      }
})