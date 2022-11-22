import React, { useState } from 'react'
import { TextInput, View, StyleSheet, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import TimeInput from '@tighten/react-native-time-input';

const typePlaceholder = {
    label: 'Social Media Platform',
    value: null,
    color: 'black',
};

const agePlaceholder = {
    label: 'Social Media Platform',
    value: null,
    color: 'black',
};

//TODO: add image uploading
export default function AddAttraction ( { navigation }) {
    const [name, setName] = useState('');
    const [attractionType, setType] = useState('');
    const [price, setPrice] = useState('');
    const [ageGroup, setAge] = useState('');
    const [groupSize, setGroupSize] = useState('');
    const [openingTime, setOpeningTime] = useState('');

    const onSubmitPress = async () => {
            try {
                await setDoc(doc(db, "attractions", name), {
                    name: name,
                    attractionType: attractionType,
                    price: price,
                    ageGroup: ageGroup,
                    groupSize: groupSize,
                    openingTime: openingTime,
                });
                //console.log("Document written with ID: ", docRef.id);
                navigation.navigate('Profile', {user: auth})
            }
            catch (e) {
                console.log("Error adding document: ", e);
            }
        }

        const handleOpeningTimeChange = (openingTime, validTime) => {
            if (!validTime) return;
            setOpeningTime(openingTime);
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
            <Text>Attraction Type:</Text>
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
            <Text>Opening Hours:</Text>
            <View>
            <TimeInput 
                setCurrentTime 
                onTimeChange={handleOpeningTimeChange} 
            />
    </View>
            <Text>Closing Hours:</Text>
            <Text>Language Preferences:</Text>
            <Text>Description:</Text>
            <Text>Location:</Text>
            <Text>Terms & Conditions:</Text>
            </KeyboardAwareScrollView>
        </View>
    )
}