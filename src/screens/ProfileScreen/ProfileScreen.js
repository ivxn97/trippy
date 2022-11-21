import * as React from 'react';
import { View, Text, Button } from 'react-native';

export default function ProfileScreen ( {navigation} ) {

    return (
        <View>
        <Button
            title ="Login"
            onPress={() =>
                navigation.navigate('Login')
            }
        />

        <Button
            title ="Add Attraction"
            onPress={() =>
                navigation.navigate('Add Attraction')
            }
        />
        </View>
    )
}
