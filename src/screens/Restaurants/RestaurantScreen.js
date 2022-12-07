import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function RestaurantScreen({route, navigation}) {
    const {name, typeOfCuisine, price, ageGroup, groupSize, openingTime, closingTime, menu, language, TNC} = route.params;
    
    return (
        <View>
            <Text>{JSON.stringify(name).replace(/"/g,"")}</Text>
            <Text>Type of Cuisine: {JSON.stringify(typeOfCuisine).replace(/"/g,"")}</Text>
            <Text>Price: {JSON.stringify(price).replace(/"/g,"")}</Text>
            <Text>Age Group: {JSON.stringify(ageGroup).replace(/"/g,"")}</Text>
            <Text>Group Size: {JSON.stringify(groupSize).replace(/"/g,"")}</Text>
            <Text>Opening Time: {JSON.stringify(openingTime).replace(/"/g,"")}</Text>
            <Text>Closing Time: {JSON.stringify(closingTime).replace(/"/g,"")}</Text>
            <Text>Language: {JSON.stringify(language).replace(/"/g,"")}</Text>
            <Text>Menu: {JSON.stringify(menu).replace(/"/g,"")}</Text>
            <Text>Terms & Conditions: {JSON.stringify(TNC).replace(/"/g,"")}</Text>
        </View>
    )
}