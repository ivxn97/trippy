import * as React from 'react';
import { View, Text, Button } from 'react-native';

export default function ProfileScreen ( {navigation} ) {

    return (
        <View>
        <Text>Hello Profile Screen</Text>
        <Button
            title ="Login"
            onPress={() =>
                navigation.navigate('Login')
            }
        />
        </View>
    )
}
