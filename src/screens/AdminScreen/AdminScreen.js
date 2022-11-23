import React from 'react';
import { View, Text, Button } from 'react-native';

export default function AdminScreen ({navigation}) {
    return (
        <View>
        <Button
            title ="List Of Users"
            onPress={() =>
                navigation.navigate('List Of Users')
            }
        />
        </View>
    )
}

