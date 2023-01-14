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
            <ScrollView>
            <Text style={styles.Heading}>Welcome, Admin!</Text>
        <List.Section >
        <List.Accordion 
            title="Manage Activities"
            left={props => <List.Icon{...props} icon="folder"/>}>
                <List.Item title="Walking Tours" />
                <List.Item title="Guides" />
                <List.Item title="Services" />
                <List.Item title="Deals" />
        </List.Accordion>

        <List.Accordion 
            title="Review Pending"
            left={props => <List.Icon{...props} icon="folder"/>}>
                <List.Item title="Walking Tours" />
                <List.Item title="Guides" />
                <List.Item title="Services" />
                <List.Item title="Deals" />
        </List.Accordion>

        <List.Accordion 
            title="Users/Accounts"
            left={props => <List.Icon{...props} icon="folder"/>}>
                <List.Item title="View Accounts" onPress={() => navigation.navigate('List Of Accounts')} />
                <List.Item title="Review Pending Accounts" />
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

        <TouchableOpacity style={styles.button}
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

