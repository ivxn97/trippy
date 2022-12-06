import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

export default function ProfileScreen ( {navigation} ) {
    const auth = getAuth();

    const onSignout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigation.replace('Profile');
            alert("Successfully Logged out")
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode + ': ' + errorMessage)
         });
    }

    onAuthStateChanged(auth, (user) => {
    if (user) {
            
    } else {
        navigation.navigate('Login')
    }
    
    }); 
    
    return(
        <View>
        

        <Button
            title ="Login"
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
        </View>
        )
}
