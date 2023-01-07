import React, { useState } from 'react'
import { TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../../config';
import { FilteredTextInput } from '../commonFunctions';

export default function EditDeal ( {route, navigation} ) {
    const {name, dealType, discount, code, description, quantity, TNC} = route.params;
    const [business, setBusiness] = useState(dealType);
    const [newCode, setCode] = useState(code);
    const [newDiscount, setDiscount] = useState(discount);
    const [newQuantity, setQuantity] = useState(quantity);
    const [newDescription, setDescription] = useState(description);
    const [newTNC, setTNC] = useState(TNC);

    const onSubmitPress = async () => {
        try {
            await setDoc(doc(db, "deals", name), {
                type: business,
                code: newCode,
                discount: newDiscount,
                quantity: newQuantity,
                description: newDescription,
                TNC: newTNC
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
            <Text style={[styles.text, {fontSize:20}]}>Name: {JSON.stringify(name).replace(/"/g,"")}</Text>
            <Text style={styles.text}>Business Type:</Text>
                <RNPickerSelect
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    value={business}
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
                value={newDiscount}
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
                value={newCode}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <Text style={styles.text}>Quantity:</Text>
            <TextInput
                style={styles.input}
                placeholder='Quantity'
                placeholderTextColor="#aaaaaa"
                onChangeText={(Text) => setQuantity(Text)}
                value={newQuantity}
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
                value={newDescription}
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
                value={newTNC}
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                multiline
            />
            <TouchableOpacity
                    style={styles.button}
                    onPress={() => onSubmitPress()}>
                    <Text style={styles.buttonTitle}>Edit Deal</Text>
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
        color: 'black'
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
        color: 'black'
      }
})