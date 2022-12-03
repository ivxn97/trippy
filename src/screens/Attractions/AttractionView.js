import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function AttractionView(route, navigation) {
    const {email, UEN, firstName, lastName, role, id, status, socialMediaHandle, socialMediaPlatform} = route.params;
    
    return (
        <View>
            <Text>Home Screen</Text>
        </View>
    )
}