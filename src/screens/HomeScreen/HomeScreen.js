import React from 'react'
import { Text, View, Button } from 'react-native'

export default function HomeScreen( {navigation} ) {
    return (
        <View>
            <Button
            title ="Restaurants"
            onPress={() =>
                navigation.navigate('List of restaurants')
            }
            />
        <Button
            title ="Hotels"
            onPress={() =>
                navigation.navigate('List of hotels')
            }
        />
        <Button
            title ="Attractions"
            onPress={() =>
                navigation.navigate('List of attractions')
            }
        />
        <Button
            title ="Paid Tours"
            onPress={() =>
                navigation.navigate('List of paid tours')
            }
        />
        </View>
    )
}