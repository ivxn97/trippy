import React from 'react';
import { View, Text, Button } from 'react-native';

export default function AdminViewUser ({route, navigation}) {
    const {email, UEN, firstName} = route.params;
    return (
        <View>
            <Text>Email: {JSON.stringify(email)}</Text>
            <Text>UEN: {JSON.stringify(UEN)}</Text>
            <Text>First Name: {JSON.stringify(firstName)}</Text>
        </View>
    )
}
