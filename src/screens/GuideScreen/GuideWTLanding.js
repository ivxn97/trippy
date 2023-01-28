import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { sortFiles } from '../commonFunctions';

export default function GuideWTLanding ({ navigation }) {

    return (
        <View>
        <Text style={styles.HeadingList}>Guides</Text>
        <Text style={styles.HeadingList}>And</Text>
        <Text style={styles.HeadingList}>Walking Tours</Text>
        
        <TouchableOpacity
            underlayColor="#C8c9c9"
            onPress={() => navigation.navigate('Guide List')}
            style={styles.buttonLanding}>
            <Text style={styles.textNB}>Guides</Text>
        </TouchableOpacity>
        <TouchableOpacity
            underlayColor="#C8c9c9"
            onPress={() => navigation.navigate('Walking Tours List')}
            style={styles.buttonLanding}>
            <Text style={styles.textNB}>Walking Tours</Text>
        </TouchableOpacity>
        </View>
    )
}
