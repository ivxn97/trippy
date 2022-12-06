import React from 'react';
import { View, Text, Button } from 'react-native';

export default function AttractionDeals ( {navigation} ) {
    return (
        <View>
            <Button
            title ="Add"
            onPress={() =>
                navigation.navigate('Add Attraction Deal')
            }
            />
            <Button
            title ="Edit"
            onPress={() =>
                navigation.navigate('Add Attraction Deal')
            }
            />
            <Button
            title ="Delete"
            onPress={() =>
                navigation.navigate('Add Attraction Deal')
            }
            />
        </View>
    )
}

