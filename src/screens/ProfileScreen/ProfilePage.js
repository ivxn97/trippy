import React, { useState, Component } from 'react';
import { View, ScrollView, TouchableHighLight, TouchableOpacity, Image, Text, TextInput, StyleSheet } from 'react-native';
import profileImage from './profile.jpeg';

export default function ProfilePage({ navigation, route }) {
    const { firstName, lastName, email, role, country } = route.params;

    const [username] = email.split("@");
    const [name, setName] = useState(firstName + " " + lastName);
    const [newName, setNewName] = useState("");
    const [first, last] = newName.split(" ");
    const [newFirstName, setNewFirstName] = useState(first);
    const [newLastName, setNewLastName] = useState(last);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const onSubmitPress = async () => {
        try {
            await setDoc(doc(db, "users", email), {
                firstName: newFirstName,
                lastName: newLastName,
            }, { merge: true });
            //console.log("Document written with ID: ", docRef.id);
            navigation.navigate('Profile Page')
        }
        catch (e) {
            console.log("Error adding document: ", e);
        }
    }

    return (
        <View>
            <ScrollView>
                <View style={styles.profileContainer}>
                    <TouchableOpacity>
                        <Image source={profileImage} style={styles.profileImage} />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.normalText}>Name</Text>
                </View>
                <TextInput 
                    placeholder='name'
                    placeholderTextColor="#aaaaaa"
                    style={styles.roleContainer}
                    onChangeText={(Text) => setNewName(Text)}
                    value={name}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                >
                </TextInput>

                <View>
                    <Text style={styles.normalText}>Username</Text>
                </View>
                <TextInput 
                    placeholder='username'
                    placeholderTextColor="#aaaaaa"
                    style={styles.roleContainer}
                    onChangeText={(Text) => setNewUsername(Text)}
                    value={username}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                >
                </TextInput>

                <View>
                    <Text style={styles.normalText}>Email Address</Text>
                </View>
                <View style={styles.roleContainer}>
                    <Text>{email}</Text>
                </View>

                <View>
                    <Text style={styles.normalText}>Roles</Text>
                </View>
                <View style={styles.roleContainer}>
                    <Text>{role}</Text>
                </View>

                <View>
                    <Text style={styles.normalText}>Password</Text>
                </View>
                <TextInput secureTextEntry={true} style={styles.roleContainer}>
                    <Text>{role}</Text>
                </TextInput>

                <View>
                    <TouchableOpacity style={styles.backButton} onPress={() => onSubmitPress()}>
                        <Text style={styles.backButtonText}>Update</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    normalText: {
        fontSize : 15,
        fontWeight: 'bold',
        color: 'grey',
        padding: 40,
        marginTop: -30
    },
    profileContainer: {
        padding: 10,
        width: '100%',
        height: 150
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 100,
        marginTop: 10,
        alignSelf: 'center',
        position: 'absolute'
    },
    nameText: {
        height: 140,
        fontSize: 25,
        fontWeight: 'bold',
        padding: 10,
    },
    roleContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        width: '90%',
        padding: 20,
        borderRadius: 10,
        shadowOpacity: 80,
        elevation: 15,
        marginTop: -30
    },
    backButton: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        width: '90%',
        padding: 20,
        paddingBottom: 22,
        borderRadius: 10,
        shadowOpacity: 80,
        elevation: 15,
        marginTop: 20,
        marginBottom: 40,
        backgroundColor: '#000'
    },
    backButtonText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10
    },
});



    