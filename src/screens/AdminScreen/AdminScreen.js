import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

export default function AdminScreen ({navigation}) {
    return (
        <View>
        <TouchableOpacity style={styles.button}
            title ="List Of Users"
            onPress={() =>
                navigation.navigate('List Of Users')
            }
        >
            <Text style={styles.text}>List Of Users</Text>
        </TouchableOpacity>
        </View>
    )
}

