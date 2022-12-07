import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function PaidTourScreen({route, navigation}) {
    const {title, tourType, price, ageGroup, groupSize, startingTime, endingTime, language, duration, description, TNC} = route.params;
    
    return (
        <View>
            <Text>{JSON.stringify(title).replace(/"/g,"")}</Text>
            <Text>Type: {JSON.stringify(tourType).replace(/"/g,"")}</Text>
            <Text>Price: ${JSON.stringify(price).replace(/"/g,"")}</Text>
            <Text>Age Group: {JSON.stringify(ageGroup).replace(/"/g,"")}</Text>
            <Text>Group Size: {JSON.stringify(groupSize).replace(/"/g,"")}</Text>
            <Text>Starting Time: {JSON.stringify(startingTime).replace(/"/g,"")}</Text>
            <Text>Ending Time: {JSON.stringify(endingTime).replace(/"/g,"")}</Text>
            <Text>Duration: {JSON.stringify(duration).replace(/"/g,"")}</Text>
            <Text>Language: {JSON.stringify(language).replace(/"/g,"")}</Text>
            <Text>Description: {JSON.stringify(description).replace(/"/g,"")}</Text>
            <Text>Terms & Conditions: {JSON.stringify(TNC).replace(/"/g,"")}</Text>
        </View>
    )
}