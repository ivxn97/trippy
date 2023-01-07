import React, { useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilteredTextInput } from '../commonFunctions';

const businessPlaceholder = {
    label: 'Business',
    value: null,
    color: 'black',
};


export default function AddDeal ( {navigation} ) {
    const [email, setEmail] = useState('');
    const [dealname, setName] = useState('');
    const [business, setBusiness] = useState('');
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [TNC, setTNC] = useState('');

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

    const onSubmitPress = async () => {
        try {
            await setDoc(doc(db, "deals", dealname), {
                addedBy: email,
                dealname: dealname,
                type: business,
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

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                {/*<Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                />*/}
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
            <Text style={styles.text}>Business Type:</Text>
                <RNPickerSelect
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    placeholder={businessPlaceholder}
                    placeholderTextColor="#aaaaaa"
                    onValueChange={(value) => setBusiness(value)}
                    items={[
                        { label: 'Attraction', value: 'Attraction'},
                        { label: 'Hotel', value: 'Hotel' },
                        { label: 'Restaurant', value: 'Restaurant' },
                        { label: 'Paid Tour', value: 'Paid Tour' },
                    ]}
            />
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