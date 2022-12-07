import React, { useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../../config';


const businessPlaceholder = {
    label: 'Business',
    value: null,
    color: 'black',
};


export default function AddAttractionDeal ( {navigation} ) {
    const [dealname, setName] = useState('');
    const [business, setBusiness] = useState('');
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [TNC, setTNC] = useState('');

    const onSubmitPress = async () => {
        try {
            await setDoc(doc(db, "deals", dealname), {
                dealname: dealname,
                type: "attraction",
                code: code,
                discount: discount,
                quantity: quantity,
                description: description,
                TNC: TNC
            });
            
            navigation.navigate('Attraction Deals')
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
            <Text>Deal Name:</Text>
            <TextInput
                style={styles.input}
                placeholder='Deal Name'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setName(Text)}
                value={dealname}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <Text>Business Type:</Text>
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
            <Text>Discount:</Text>
            <TextInput
                style={styles.input}
                placeholder='Enter Discount %'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setDiscount(Text)}
                value={code}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <Text>Code:</Text>
            <TextInput
                style={styles.input}
                placeholder='Enter Deal Code'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setCode(Text)}
                value={code}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <Text>Quantity:</Text>
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
                    <Text style={styles.buttonTitle}>Add Attraction Deal</Text>
            </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    )
}

