import React, { useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../../config';

const typePlaceholder = {
    label: 'Paid Tour Type',
    value: null,
    color: 'black',
};

const agePlaceholder = {
    label: 'Social Media Platform',
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
export default function AddPaidTour ( { navigation }) {
    const [name, setName] = useState('');
    const [tourType, setType] = useState('');
    const [price, setPrice] = useState('');
    const [ageGroup, setAge] = useState('');
    const [groupSize, setGroupSize] = useState('');
    const [startingHour, setStartingHour] = useState('');
    const [startingMinute, setStartingMinute] = useState('');
    const [description, setDescription] = useState('');
    const [TNC, setTNC] = useState('');
    const [language, setLanguage] = useState('');
    const [durationHour, setDurationHour] = useState('');
    const [durationMinute, setDurationMinute] = useState('');

    const onSubmitPress = async () => {
            try {
                await setDoc(doc(db, "paidtours", name), {
                    name: name,
                    tourType: tourType,
                    language: language,
                    price: price,
                    ageGroup: ageGroup,
                    groupSize: groupSize,
                    startingTime: startingHour + ':' + startingMinute,
                    duration: durationHour + ':' + durationMinute,
                    location: '',
                    description: description,
                    TNC: TNC,
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
            <Text>Paid Tour Type:</Text>
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
                items = {[
                    {label:'Museums', value:'Museums'},
                    {label:'Theme Park', value:'Theme Park'},
                    {label:'Natural Landscape', value:'Natural Landscape'},
                    {label:'Observation Site', value:'Observation Site'},
                    {label:'Historical Site', value:'Historical Site'},
                    {label:'Regular Show', value:'Regular Show'},
                    {label:'Aquariums & Zoos', value:'Aquariums & Zoos'},
                    {label:'Outdoors', value:'Outdoors'},
                ]}
            />

            <Text>Language Preferences:</Text>
            {/*TODO */}

            <Text>Price:</Text>
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
            <Text>Age Group:</Text>
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
                placeholder={agePlaceholder}
                onValueChange={(value) => setAge(value)}
                items = {[
                    {label:'All Ages', value:'All Ages'},
                    {label:'13+', value:'13+'},
                    {label:'18+', value:'18+'},
                    {label:'Adults Only', value:'Adults Only'},
                ]}
            />
            <Text>Group Size:</Text>
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
            <Text>Starting Time:</Text>
            {/*Opening Hour */}
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
                onValueChange={(value) => setStartingMinute(value)}
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
            
            <Text>Duration:</Text>
            {/*Opening Hour */}
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
                onValueChange={(value) => setDurationHour(value)}
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
                onValueChange={(value) => setDurationMinute(value)}
                items = {[
                    {label:'00', value:'00'},
                    {label:'15', value:'15'}, 
                    {label:'30', value:'30'}, 
                    {label:'45', value:'45'}
                ]}
            />

            <Text>Description:</Text>
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
                    <Text style={styles.buttonTitle}>Add Paid Tour</Text>
            </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    )
}