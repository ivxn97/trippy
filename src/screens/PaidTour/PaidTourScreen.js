import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';

export default function PaidTourScreen({route, navigation}) {
    const {title, tourType, price, ageGroup, groupSize, startingTime, endingTime, language, duration, description, TNC} = route.params;
    
    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.Heading}>{JSON.stringify(title).replace(/"/g,"")}</Text>
            <Image
                style={styles.imageDetailsPlaceholder}
                source={require('../../../assets/image-placeholder-large.jpg')}
            />
            <View style={{ flexDirection:"row" }}>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Add To Itinerary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Share</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.textNB}>Address: </Text>
            <Text style={styles.textNB}>Type: {JSON.stringify(tourType).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Age Group: {JSON.stringify(ageGroup).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Group Size: {JSON.stringify(groupSize).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Starting Time: {JSON.stringify(startingTime).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Ending Time: {JSON.stringify(endingTime).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Duration: {JSON.stringify(duration).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Language: {JSON.stringify(language).replace(/"/g,"")}{"\n"}</Text>
            <Text style={styles.textNB}>Description: {JSON.stringify(description).replace(/"/g,"")}{"\n"}</Text>
            <Text style={styles.textNB}>Terms & Conditions: {JSON.stringify(TNC).replace(/"/g,"")}</Text>
            <Text style={styles.price}>${JSON.stringify(price).replace(/"/g,"")}</Text>
            <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Read Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Book</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}