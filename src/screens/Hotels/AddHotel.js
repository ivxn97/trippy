import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../../config';
import Checkbox from 'expo-checkbox';



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

//TODO: add image uploading
export default function AddHotel({ navigation }) {
    const [name, setName] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [hotelClass, setHotelClass] = useState('');
    const [checkInHour, setCheckInHour] = useState('');
    const [checkInMinute, setCheckInMinute] = useState('');
    const [checkOutHour, setCheckOutHour] = useState('');
    const [checkOutMinute, setCheckOutMinute] = useState('');
    const [language, setLanguage] = useState('');
    const [description, setDescription] = useState('');
    const [TNC, setTNC] = useState('');

    // amenities
    let amenitiesData = [{ name: 'Swimming Pools', value: 'Swimming Pools', isChecked: false },
        { name: 'Club Houses', value: 'Club Houses', isChecked: false },
        { name: 'Tennis Courts', value: 'Tennis Courts', isChecked: false },
        { name: 'Fitness Facilities', value: 'Fitness Facilities', isChecked: false },
        { name: 'Parking', value: 'Parking', isChecked: false },
        { name: 'Room Services', value: 'Room Services', isChecked: false },
        { name: 'Free Wifi', value: 'Free Wifi', isChecked: false }];
    const [docAmenitiesData, setAmenitiesData] = useState([])
    const [amenities, setUserAmenities] = useState([])
    

    // room features
    let roomFeaturesData = [{ name: 'Kitchen Facilities', value: 'Kitchen Facilities', isChecked: false },
    { name: 'TV', value: 'TV', isChecked: false },
    { name: 'Essential Kit', value: 'Essential Kit', isChecked: false },
    { name: 'Writing Desk', value: 'Writing Desk', isChecked: false },
    { name: 'Mattress', value: 'Mattress', isChecked: false },
    { name: 'Wardrobe', value: 'Wardrobe', isChecked: false },
    { name: 'Tea and Coffee Making Facilities', value: 'Tea and Coffee Making Facilities', isChecked: false }];
    const [docRoomFeaturesData, setRoomFeaturesData] = useState([])
    const [roomFeatures, setUserRoomFeatures] = useState([])

    //room Types
    let roomTypesData = [{ name: 'Single Room', value: 'Single Room', isChecked: false },
    { name: 'Twin or Double Room', value: 'Twin Or Double Room', isChecked: false },
    { name: 'Studio Room', value: 'Studio Room', isChecked: false },
    { name: 'Deluxe Room', value: 'Deluxe Room', isChecked: false },
    { name: 'Suites', value: 'Suites', isChecked: false },]
    const [docRoomTypesData, setRoomTypesData] = useState([])
    const [roomTypes, setUserRoomTypes] = useState([])

    useEffect(() => {
        setAmenitiesData(amenitiesData);
        setRoomFeaturesData(roomFeaturesData);
        setRoomTypesData(roomTypesData);
    }, []);

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
        console.log(amenities);
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
        console.log(roomFeatures);
        console.log(docRoomFeaturesData);
    }

    const setRoomTypes = (item) => {

        setRoomTypesData(
            docRoomTypesData.map(curr => {
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
        //setUserRoomTypes(current => [...current, item.name]);
        console.log(roomTypes);
        console.log(docRoomTypesData);
    }

    const onSubmitPress = async () => {
            try {
                await setDoc(doc(db, "hotels", name), {
                    name: name,
                    roomTypes: docRoomTypesData,
                    priceRange: priceRange,
                    hotelClass: hotelClass,
                    checkInTime: checkInHour + ':' + checkInMinute,
                    checkOutTime: checkOutHour + ':' + checkOutMinute,
                    amenities: docAmenitiesData,
                    roomFeatures: docRoomFeaturesData,
                    language: language,
                    location: '',
                    description: description,
                    TNC: TNC
                });
                //console.log("Document written with ID: ", docRef.id);
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
                
                <Text style={styles.text}>Upload Images:</Text>
                <Image
                    style={styles.imagePlaceholder}
                    source={require('../../../assets/imageUpload4.png')}
                />
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
                <Text style={styles.text}>Room Type:</Text>
                {docRoomTypesData.map((item, index) => (
                    <View style={styles.checklist} key={index}>
                        <Checkbox style={styles.checkbox} value={item.isChecked} onValueChange={() => setRoomTypes(item)} />
                        <Text>{item.name}</Text>
                    </View>
                ))}

                <Text style={styles.text}>Price Range:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Price Range'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(Text) => setPriceRange(Text)}
                    value={priceRange}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    keyboardType="numeric"
                />
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
                    items={[
                        { label: 'Any', value: 'Any'},
                        { label: 'English', value: 'English' },
                        { label: 'Chinese', value: 'Chinese' },
                    ]}
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
                <Text style={styles.text}>Terms & Conditions:</Text>
                <TextInput
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