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
            title="Add Hotel"
            onPress={() =>
                navigation.navigate('Add Hotel')
            }
        />
        <Button
            title ="Add Attraction"
            onPress={() =>
                navigation.navigate('Add Attraction')
            }
        />

        <Button
            title ="Add Paid Tour"
            onPress={() =>
                navigation.navigate('Add Paid Tour')
            }
        />

        <Button
            title ="Registration Selector (TEST)"
            onPress={() =>
                navigation.navigate('Registration Selector')
            }
        />

        <Button
            title ="Admin Page (TEST)"
            onPress={() =>
                navigation.navigate('Admin Page')
            }
        />
        </View>
    )
}
