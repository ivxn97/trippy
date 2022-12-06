import React from 'react';
import { View, Text, Button } from 'react-native';

export default function DealsScreen ( {navigation} ) {
    return (
        <View>
            <Button
            title ="Attraction"
            onPress={() =>
                navigation.navigate('Attraction Deals')
            }
            />
        </View>
    )
}

