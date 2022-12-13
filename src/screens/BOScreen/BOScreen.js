import React, { useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';

export default function BOScreen ({navigation}) {

    const [role, setRole] = useState('');
    const [refresh, setRefresh] = useState();
    const auth = getAuth();

        const onSignout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            removeRole();
            removeEmail();
            navigation.navigate('Profile Page');
            alert("Successfully Logged out")
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode + ': ' + errorMessage)
         });
    }

    const removeRole = async () => {
        try {
            const role = await AsyncStorage.removeItem('role');
            setRole('');
            return true;
        } catch (error) {
            return false
        }
    }

    const removeEmail = async () => {
        try {
            const email = await AsyncStorage.removeItem('email');
            return true;
        } catch (error) {
            return false
        }
    }
    
    const getRole = async () => {
        try {
            const role = await AsyncStorage.getItem('role');
            if (role !== null) {
                setRole(role);
                console.log(role)
            }
            else {
                console.log("No Role Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useFocusEffect(React.useCallback(() => 
    {
        getRole();
        console.log("Current Role:", role)
    },[role]));

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
        <TouchableOpacity style={styles.button}
            title ="Sign Out"
            onPress={() => onSignout()}
        >
            <Text style={styles.text}>Sign Out</Text>
        </TouchableOpacity>
        </View>
    )
}

