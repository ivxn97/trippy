import React, { useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../../config';

const amenitiesPlaceholder = {
    label: 'Room Type',
    value: null,
    color: 'black',
};

const roomFeaturesPlaceholder = {
    label: 'Room Type',
    value: null,
    color: 'black',
};


const typePlaceholder = {
    label: 'Room Type',
    value: null,
    color: 'black',
};

const classPlaceholder = {
    label: 'Hotel Class',
    value: null,
    color: 'black',
};

const hourPlaceholder = {
    label: 'HOUR',
    value: null,
    color: 'black',
};

const minutePlaceholder = {
    label: 'MINUTE',
    value: null,
    color: 'black',
};

//TODO: add image uploading
export default function AddHotel({ navigation }) {
    const [name, setName] = useState('');
    const [roomType, setType] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [hotelClass, setHotelClass] = useState('');
    const [checkInHour, setCheckInHour] = useState('');
    const [checkInMinute, setCheckInMinute] = useState('');
    const [checkOutHour, setCheckOutHour] = useState('');
    const [checkOutMinute, setCheckOutMinute] = useState('');
    const [amenities, setAmenities] = useState('');
    const [roomFeatures, setRoomFeatures] = useState('');
    const [language, setLanguage] = useState('');
    const [location, setLocation] = useState('');
    const [TNC, setTNC] = useState('');

    const onSubmitPress = async () => {
            try {
                await setDoc(doc(db, "hotels", name), {
                    name: name,
                    roomType: roomType,
                    priceRange: priceRange,
                    hotelClass: hotelClass,
                    checkInTime: checkInHour + ':' + checkInMinute,
                    checkOutTime: checkOutHour + ':' + checkOutMinute,
                    amenities: amenities,
                    roomFeatures: roomFeatures,
                    language: language,
                    location: '',
                    TNC: TNC
                });
                //console.log("Document written with ID: ", docRef.id);
                navigation.navigate('Profile')
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
                {/*<Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                />*/}
                <Text>Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(Text) => setName(Text)}
                    value={name}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <Text>Room Type:</Text>
                <RNPickerSelect
                    style={StyleSheet.create({
                        inputIOSContainer: {
                            paddingVertical: 20,
                            paddingHorizontal: 30,
                            backgroundColor: 'white',
                            fontSize: '20',
                            marginTop: 10,
                            marginBottom: 10,
                            marginLeft: 30,
                            marginRight: 30,
                            paddingLeft: 16
                        },
                        inputIOS: {
                            fontSize: 14
                        }
                    })}
                    useNativeAndroidPickerStyle={false}
                    placeholder={typePlaceholder}
                    onValueChange={(value) => setType(value)}
                    items={[
                        { label: 'Single Room', value: 'Single Room' },
                        { label: 'Double Room', value: 'Double Room' },
                        { label: 'Studio Room', value: 'Studio Room' },
                        { label: 'Deluxe Room', value: 'Deluxe Room' },
                    ]}
                />
                <Text>Price Range:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='PriceRange'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(Text) => setPriceRange(Text)}
                    value={priceRange}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    keyboardType="numeric"
                />
                <Text>Hotel Class:</Text>
                <RNPickerSelect
                    style={StyleSheet.create({
                        inputIOSContainer: {
                            paddingVertical: 20,
                            paddingHorizontal: 30,
                            backgroundColor: 'white',
                            fontSize: '20',
                            marginTop: 10,
                            marginBottom: 10,
                            marginLeft: 30,
                            marginRight: 30,
                            paddingLeft: 16
                        },
                        inputIOS: {
                            fontSize: 14
                        }
                    })}
                    useNativeAndroidPickerStyle={false}
                    placeholder={classPlaceholder}
                    onValueChange={(value) => setHotelClass(value)}
                    items={[
                        { label: '1 Star', value: '1 Star' },
                        { label: '2 Star', value: '2 Star' },
                        { label: '3 Star', value: '3 Star' },
                        { label: '4 Star', value: '4 Star' },
                        { label: '5 Star', value: '5 Star' },
                    ]}
                />
                <Text>CheckIn Hours:</Text>
                {/*CheckIn Hour */}
                <RNPickerSelect
                    style={StyleSheet.create({
                        inputIOSContainer: {
                            paddingVertical: 20,
                            paddingHorizontal: 30,
                            backgroundColor: 'white',
                            fontSize: '20',
                            marginTop: 10,
                            marginBottom: 10,
                            marginLeft: 30,
                            marginRight: 30,
                            paddingLeft: 16
                        },
                        inputIOS: {
                            fontSize: 14
                        }
                    })}
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
                    style={StyleSheet.create({
                        inputIOSContainer: {
                            paddingVertical: 20,
                            paddingHorizontal: 30,
                            backgroundColor: 'white',
                            fontSize: '20',
                            marginTop: 10,
                            marginBottom: 10,
                            marginLeft: 30,
                            marginRight: 30,
                            paddingLeft: 16
                        },
                        inputIOS: {
                            fontSize: 14
                        }
                    })}
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
                <Text>CheckOut Hours:</Text>
                {/*CheckOut Hour */}
                <RNPickerSelect
                    style={StyleSheet.create({
                        inputIOSContainer: {
                            paddingVertical: 20,
                            paddingHorizontal: 30,
                            backgroundColor: 'white',
                            fontSize: '20',
                            marginTop: 10,
                            marginBottom: 10,
                            marginLeft: 30,
                            marginRight: 30,
                            paddingLeft: 16
                        },
                        inputIOS: {
                            fontSize: 14
                        }
                    })}
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
                    style={StyleSheet.create({
                        inputIOSContainer: {
                            paddingVertical: 20,
                            paddingHorizontal: 30,
                            backgroundColor: 'white',
                            fontSize: '20',
                            marginTop: 10,
                            marginBottom: 10,
                            marginLeft: 30,
                            marginRight: 30,
                            paddingLeft: 16
                        },
                        inputIOS: {
                            fontSize: 14
                        }
                    })}
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
                <Text>Amenities:</Text>
                <RNPickerSelect
                    style={StyleSheet.create({
                        inputIOSContainer: {
                            paddingVertical: 20,
                            paddingHorizontal: 30,
                            backgroundColor: 'white',
                            fontSize: '20',
                            marginTop: 10,
                            marginBottom: 10,
                            marginLeft: 30,
                            marginRight: 30,
                            paddingLeft: 16
                        },
                        inputIOS: {
                            fontSize: 14
                        }
                    })}
                    useNativeAndroidPickerStyle={false}
                    placeholder='amenities'
                    placeholderTextColor="#aaaaaa"
                    onValueChange={(value) => setAmenities(value)}
                    items={[
                        { label: 'Swimming Pools', value: 'Swimming Pools' },
                        { label: 'Club Houses', value: 'Club Houses' },
                        { label: 'Tennis Courts', value: 'Tennis Courts' },
                        { label: 'Fitness Facilities', value: 'Fitness Facilities' },
                        { label: 'Parking', value: 'Parking' },
                        { label: 'Room Services', value: 'Room Services' },
                        { label: 'Free Wifi', value: 'Free Wifi' },
                    ]}
                />
                <Text>Room Features:</Text>
                <RNPickerSelect
                    style={StyleSheet.create({
                        inputIOSContainer: {
                            paddingVertical: 20,
                            paddingHorizontal: 30,
                            backgroundColor: 'white',
                            fontSize: '20',
                            marginTop: 10,
                            marginBottom: 10,
                            marginLeft: 30,
                            marginRight: 30,
                            paddingLeft: 16
                        },
                        inputIOS: {
                            fontSize: 14
                        }
                    })}
                    useNativeAndroidPickerStyle={false}
                    placeholder='roomFeatures'
                    placeholderTextColor="#aaaaaa"
                    onValueChange={(value) => setRoomFeatures(value)}
                    items={[
                        { label: 'testtttt', value: 'testtttt' },
                    ]}
                />
                <Text>Language Preferences:</Text>
                <RNPickerSelect
                    style={StyleSheet.create({
                        inputIOSContainer: {
                            paddingVertical: 20,
                            paddingHorizontal: 30,
                            backgroundColor: 'white',
                            fontSize: '20',
                            marginTop: 10,
                            marginBottom: 10,
                            marginLeft: 30,
                            marginRight: 30,
                            paddingLeft: 16
                        },
                        inputIOS: {
                            fontSize: 14
                        }
                    })}
                    useNativeAndroidPickerStyle={false}
                    placeholder='language'
                    placeholderTextColor="#aaaaaa"
                    onValueChange={(value) => setLanguage(value)}
                    items={[
                        { label: 'English', value: 'English' },
                        { label: 'Chinese', value: 'Chinese' },
                    ]}
                />
                {/*TODO */}
                <Text>Location:</Text>
                {/* insert google maps API and mapview here
            https://betterprogramming.pub/google-maps-and-places-in-a-real-world-react-native-app-100eff7474c6 */}
                <Text>Terms & Conditions:</Text>
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