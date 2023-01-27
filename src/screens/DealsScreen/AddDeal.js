import React, { useState, useEffect } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, FlatList, TouchableHighlight } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, getDoc, collection, query, where, getDocs, QuerySnapshot, setDoc } from "firebase/firestore";
import { db } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilteredTextInput } from '../commonFunctions';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from 'moment';


const businessTypePlaceholder = {
    label: 'Business Type',
    value: null,
    color: 'black',
};


export default function AddDeal ( {navigation} ) {
    const [shouldRun, setShouldRun] = useState(true);
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState('');
    const [dealname, setName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [TNC, setTNC] = useState('');
    const [expiryDT, setExpiryDT] = useState()
    const [restaurants, setRestaurants] = useState([]); // Initial empty array of restaurants
    const [hotels, setHotels] = useState([]);
    const [paidTours, setPaidTours] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [mergedArr, setMergedArr] = useState([]);
    const [shouldShow, setShouldShow] = useState(false)
    const [isDateTimePickerVisible, setDateTimePickerVisiblity] = useState(false);

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

    const getRestaurants = async () => {
        const collectionRef = collection(db, "restaurants")
        const q = query(collectionRef, where('addedBy', '==', email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            restaurants.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getHotels = async () => {
        const collectionRef = collection(db, "hotels")
        const q = query(collectionRef, where('addedBy', '==', email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            hotels.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getPaidTours = async () => {
        const collectionRef = collection(db, "paidtours")
        const q = query(collectionRef, where('addedBy', '==', email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            paidTours.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getAttractions = async () => {
        const collectionRef = collection(db, "attractions")
        const q = query(collectionRef, where('addedBy', '==', email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            attractions.push({
                ...doc.data(),
                key: doc.id
            })
        })
        getMergeArr();
    }

    const getMergeArr = () => {
        mergedArr.push(...restaurants);
        mergedArr.push(...hotels);
        mergedArr.push(...paidTours);
        mergedArr.push(...attractions);

        if (mergedArr) {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (shouldRun) {
            getEmail();
            if (email) {
                getRestaurants();
                getHotels();
                getPaidTours();
                getAttractions();
                setShouldRun(false);
            }
        }
    }, [shouldRun, email, mergedArr])

    const onSubmitPress = async () => {
        try {
            await setDoc(doc(db, "deals", dealname), {
                addedBy: email,
                dealname: dealname,
                type: businessType,
                businessName: businessName,
                expiry: expiryDT,
                code: code,
                discount: discount,
                quantity: quantity,
                description: description,
                TNC: TNC
            });
            
            navigation.navigate('BO Page')
        }
        catch (e) {
            console.log("Error adding deal: ", e);
        }
    }

    const selectBusiness = (name, type) => {
        setBusinessName(name);
        if (type == "attractions") {
            setBusinessType("Attraction")
        }
        else if (type == "restaurants") {
            setBusinessType("Restaurant")
        }
        else if (type == "hotels") {
            setBusinessType("Hotel")
        }
        else if (type == "paidtours") {
            setBusinessType("Paid Tour")
        }
        setShouldShow(!shouldShow);
    }

    const showDateTimePicker = () => {
        setDateTimePickerVisiblity(true);
      };
    
    const hideDateTimePicker = () => {
        setDateTimePickerVisiblity(false);
    };
    

    const handleConfirmDateTime = (date) => {
        setExpiryDT(date)
        hideDateTimePicker();
    };

    if (loading) {
        return <ActivityIndicator />
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">

            <Text style={styles.text}>Deal Name:</Text>
            <TextInput
                style={styles.input}
                placeholder='Deal Name'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setName(Text)}
                value={dealname}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => setShouldShow(!shouldShow)}>
                <Text style={styles.buttonTitle}>Select Activity</Text>
            </TouchableOpacity>
            {shouldShow ? (
                <FlatList
                data={mergedArr}
                extraData={mergedArr}
                renderItem={({ item }) => (
                    <TouchableHighlight
                    underlayColor="#C8c9c9"
                    onPress={() => selectBusiness(item.name, item.activityType)}>
                    <View style={styles.list}>
                    <Text>{item.name}</Text>
                    </View>
                    </TouchableHighlight>
                )}
                />
            ) : null}

            <Text style={styles.text}>Discount:</Text>
            <TextInput
                style={styles.input}
                placeholder='Enter Discount %'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setDiscount(Text)}
                value={discount}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                keyboardType="numeric"
            />
            <Text style={styles.text}>Code:</Text>
            <FilteredTextInput
                style={styles.input}
                placeholder='Enter Deal Code'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setCode(Text)}
                value={code}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <Text style={styles.text}>Quantity:</Text>
            <TextInput
                style={styles.input}
                placeholder='Quantity'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setQuantity(Text)}
                value={quantity}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={showDateTimePicker}>
                <Text style={styles.buttonTitle}>Select expiry Date and Time</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                isVisible={isDateTimePickerVisible}
                mode="datetime"
                minimumDate={new Date()}
                onConfirm={handleConfirmDateTime}
                onCancel={hideDateTimePicker}
            />
            <Text style={styles.text}>Selected Date: {Moment(expiryDT).format('DD MMM YYYY hh:mm A')}</Text>
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
                    <Text style={styles.buttonTitle}>Add Deal</Text>
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