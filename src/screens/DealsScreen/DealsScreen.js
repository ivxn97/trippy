import React, { useEffect,useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet, Share, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {claimDeals} from '../commonFunctions';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';

export default function DealsScreen ( {route, navigation} ) {

    const {name, dealType, discount, code, description, quantity, TNC} = route.params;
    const [email, setEmail] = useState('');
    const onShare = async () => {
        try {
            await Share.share({message:`Get ${discount}% off on ${name} with TripAid!  
Download the App here: URL`})
        }
        catch (error) {
            console.log(error);
        }
    }

    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setRegisteredButton(false);
                setEmail(email);
                console.log(email)
            }
            else {
                console.log("No Email Selected at Login")
                setRegisteredButton(true);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useFocusEffect(React.useCallback(async ()=> {
        getEmail();
    }, []));

    const onClaim = async () => {
        {
            claimDeals(email, code)
            Alert.alert
            (`${name}`,`Here is your code : ${code}`)
        }
    }

    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.Heading}>{JSON.stringify(name).replace(/"/g,"")}</Text>
            <View style={{ flexDirection:"row" }}>
                <TouchableOpacity style={styles.buttonSmall} onPress={() => onShare()}>
                        <Text style={styles.buttonSmallText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall} onPress={() => onClaim()}>
                        <Text style={styles.buttonSmallText}>Claim</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.textNB}>Discount: {JSON.stringify(discount).replace(/"/g,"")}% off</Text>
            <Text style={styles.textNB}>{JSON.stringify(quantity).replace(/"/g,"")} remaining</Text>
            <Text style={styles.textNB}>Type: {JSON.stringify(dealType).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Description: {JSON.stringify(description).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Terms & Conditions: {JSON.stringify(TNC).replace(/"/g,"")}</Text>
            <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
            </View>
        </View>
    )
}