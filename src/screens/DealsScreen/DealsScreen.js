import React, { useEffect,useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet, Share, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {claimDeals} from '../commonFunctions';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'moment';

export default function DealsScreen ( {route, navigation} ) {

    const {name, dealType, discount, code, description, quantity, TNC, businessName, expiry} = route.params;
    const [email, setEmail] = useState('');
    const [disabled, setDisabled] = useState(true)
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
                setEmail(email);
                console.log(email)
                setDisabled(false)
            }
            else {
                console.log("No Email Selected at Login")
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
            (`${name}`,`Deal Redeemed.`)
        }
    }

    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.Heading}>{JSON.stringify(name).replace(/"/g,"")}</Text>
            <Text style={styles.Heading}>{JSON.stringify(discount).replace(/"/g,"")}% off</Text>
            <Text style={[styles.Heading, {fontSize:21}]}>Applicable for: {JSON.stringify(businessName).replace(/"/g,"")}</Text>
            <Text style={[styles.Heading, {fontSize:21}]}>Expires {Moment(expiry.toDate()).fromNow()}, {Moment(expiry.toDate()).format('DD MM YYYY')}</Text>
            <View style={{ flexDirection:"row" }}>
                <TouchableOpacity style={styles.buttonSmall} onPress={() => onShare()}>
                        <Text style={styles.buttonSmallText}>Share</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.textNB}>{JSON.stringify(quantity).replace(/"/g,"")} remaining</Text>
            <Text style={styles.textNB}>Type: {JSON.stringify(dealType).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Description: {JSON.stringify(description).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Terms & Conditions: {JSON.stringify(TNC).replace(/"/g,"")}</Text>
            <TouchableOpacity style={[styles.button, {opacity: disabled ? 0 : 1}]} onPress={() => onClaim()} disabled={disabled}>
                        <Text style={styles.buttonTitle}>Claim</Text>
            </TouchableOpacity>
        </View>
    )
}