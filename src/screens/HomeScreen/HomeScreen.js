import React from 'react'
import { Text, View } from 'react-native'

export default function HomeScreen( {navigation} ) {
    return (
        <View>
            <Button
            title ="Restaurants"
            onPress={() =>
                navigation.navigate('RestaurantList')
            }
            />
        <Button
            title ="Hotels"
            onPress={() =>
                navigation.navigate('HotelList')
            }
        />
        <Button
            title ="Attractions"
            onPress={() =>
                navigation.navigate('AttractionList')
            }
        />
        <Button
            title ="Paid Tours"
            onPress={() =>
                navigation.navigate('PaidTourList')
            }
        />
        </View>
    )
}