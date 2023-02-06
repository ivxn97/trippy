import React, { useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import { List } from 'react-native-paper';

export default function AdminScreen ({navigation}) {

    const [role, setRole] = useState('');
    const [refresh, setRefresh] = useState();
    const auth = getAuth();

        const onSignout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            removeRole();
            removeEmail();
            removeUsername();
            navigation.reset({index: 0, routes: [{name: 'Home'}]})
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

    const removeUsername = async () => {
        try {
            const username = await AsyncStorage.removeItem('username');
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
            <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>
            <Text style={styles.Heading}>Welcome, Admin!</Text>
        <List.Section >
        <List.Accordion 
            title="Manage Activities"
            left={props => <List.Icon{...props} icon="folder"/>}>
                <List.Item title="Walking Tours" onPress={() => navigation.navigate('Admin Edit Walking Tours List')}/>
                <List.Item title="Manage Walking Tour Sections" onPress={() => navigation.navigate('Manage Walking Tour Sections')}/>
                <List.Item title="Guides" onPress={() => navigation.navigate('Admin Edit Guides List')}/>
                <List.Item title="Manage Guide Sections" onPress={() => navigation.navigate('Manage Guide Sections')}/>
                <List.Item title="Attractions" onPress={() => navigation.navigate('Admin Edit Attractions List')} />
                <List.Item title="Hotels" onPress={() => navigation.navigate('Admin Edit Hotels List')} />
                <List.Item title="Restaurants" onPress={() => navigation.navigate('Admin Edit Restaurants List')} />
                <List.Item title="Paid Tours" onPress={() => navigation.navigate('Admin Edit PaidTours List')} />
                <List.Item title="Deals" onPress={() => navigation.navigate('Admin Edit Deals List')} />
        </List.Accordion>
        <List.Accordion 
            title="Users/Accounts"
            left={props => <List.Icon{...props} icon="folder"/>}>
                <List.Item title="View Accounts" onPress={() => navigation.navigate('List Of Accounts')} />
                <List.Item title="Review Pending Accounts" onPress={() => navigation.navigate('Review Pending Accounts')} />
        </List.Accordion>
        <List.Accordion 
            title="Forum"
            left={props => <List.Icon{...props} icon="folder"/>}>
                <List.Item title="Manage Forum Sections" onPress={() => navigation.navigate('Manage Forum Sections')}/>
                <List.Item title="Create thread" onPress={() => navigation.navigate('Create Post')}/>
                <List.Item title="Delete thread" />
                <List.Item title="View threads" />
                <List.Item title="View reports" />
        </List.Accordion>
        </List.Section>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Page Content Choice')}
            title ="Page Contents"
        >
            <Text style={styles.text}>Page Contents</Text>
        </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Manage Types Choice')}
            title ="Edit Select Options"
        >
            <Text style={styles.text}>Edit Select Options</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
            title ="Settings"
        >
            <Text style={styles.text}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
            title ="Sign Out"
            onPress={() => onSignout()}
        >
            <Text style={styles.text}>Sign Out</Text>
        </TouchableOpacity>
        </ScrollView>
        </View>
    )
    
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

