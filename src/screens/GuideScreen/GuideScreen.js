import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';

export default function GuideScreen({ route, navigation }) {
    const { title, location, mrt, tips, description } = route.params;

    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.Heading}>{JSON.stringify(title).replace(/"/g,"")}</Text>
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
            <Text style={styles.textNB}>Nearest MRT: {JSON.stringify(mrt).replace(/"/g, "")}</Text>
            <Text style={styles.textNB}>Locations: {JSON.stringify(location).replace(/"/g, "")}</Text>
            <Text style={styles.textNB}>tips: {JSON.stringify(tips).replace(/"/g, "")}</Text>
            <Image
                style={styles.imageDetailsPlaceholder}
                source={require('../../../assets/image-placeholder-large.jpg')}
            />
            <Text style={styles.textNB}>Description: {JSON.stringify(description).replace(/"/g,"")}{"\n"}</Text>
            <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Read Reviews</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}