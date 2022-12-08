import React, { useState } from 'react'
import { View, Text, Button } from 'react-native';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

export default function ProfileScreen ( {navigation} ) {
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

    /*
    onAuthStateChanged(auth, (user) => {
    if (user) {
            
    } else {
        navigation.navigate('Login')
    }
    
    }); */

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
    
    if (role == 'Admin') {
        return(
            <View>
                <Button
                    title ="Login"
                    key={refresh}
                    onPress={() =>
                        navigation.navigate('Login')
                    }
                />
                <Button
                    title="Add Hotel"
                    onPress={() =>
                        navigation.navigate('Add Hotel')
                    }
                />
                <Button
                title ="Add Attraction"
                onPress={() =>
                    navigation.navigate('Add Attraction')
                }
                />
        
                <Button
                    title ="Add Paid Tour"
                    onPress={() =>
                        navigation.navigate('Add Paid Tour')
                    }
                />
    
                <Button
                    title ="Add Restaurant"
                    onPress={() =>
                        navigation.navigate('Add Restaurant')
                    }
                />
                <Button
                    title ="Add Deal"
                    onPress={() =>
                        navigation.navigate('Add Deal')
                    }
                />
        
                <Button
                    title ="Registration Selector (TEST)"
                    onPress={() =>
                        navigation.navigate('Registration Selector')
                    }
                />
        
                <Button
                    title ="Admin Page (TEST)"
                    onPress={() =>
                        navigation.navigate('Admin Page')
                    }
                />
                <Button
                    title ="Sign Out"
                    onPress={() => onSignout()}
                />
            </View>
        )
    }
    else if (role == 'Business Owner') {
        return (
            <View>
                <Button
                    title="View Profile"
                />
                <Button
                    title="Tour"
                />
                <Button
                    title="Hotel"
                />
                <Button
                    title="Attraction"
                />
                <Button
                    title="Restaurant"
                />
                <Button
                    title="Setting"
                />
                <Button
                    title="Add Hotel"
                    onPress={() =>
                        navigation.navigate('Add Hotel')
                    }
                />
                <Button
                title ="Add Attraction"
                onPress={() =>
                    navigation.navigate('Add Attraction')
                }
                />
        
                <Button
                    title ="Add Paid Tour"
                    onPress={() =>
                        navigation.navigate('Add Paid Tour')
                    }
                />
    
                <Button
                    title ="Add Restaurant"
                    onPress={() =>
                        navigation.navigate('Add Restaurant')
                    }
                />
                <Button
                    title ="Add Deal"
                    onPress={() =>
                        navigation.navigate('Add Deal')
                    }
                />
                <Button
                    title ="Sign Out"
                    onPress={() => onSignout()}
                />
            </View>
        )
    }
    else if (role == 'LOL') {
        return (
            <View>
                <Button
                    title="View Profile"
                />
                <Button
                    title="Guide"
                />
                <Button
                    title="Walking Tour"
                />
                <Button
                    title="Active Threads"
                />
                <Button
                    title="Setting"
                />
                <Button
                    title ="Sign Out"
                    onPress={() => onSignout()}
                />
            </View>
        )
    }
    else if (role == 'Registered User') {
        return (
            <View>
                <Button
                    title="View Profile"
                />
                <Button
                    title="Saved"
                />
                <Button
                    title="Itinerary"
                />
                <Button
                    title="Active Threads"
                />
                <Button
                    title="Setting"
                />
                <Button
                    title ="Sign Out"
                    onPress={() => onSignout()}
                />
            </View>
        )
    }
    else {
        return (
            <View>
                <Button
                title ="Login"
                onPress={() =>
                    navigation.navigate('Login')
                }
                />
                <Text style={{opacity:0}}>{role}</Text>
            </View>
        )
    }
}
