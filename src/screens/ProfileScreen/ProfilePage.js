import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableHighLight, TouchableOpacity, Image, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from '../../../config';
import { getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import profileImage from './profile.jpeg';

export default function ProfilePage({ navigation, route }) {
    const { firstName, lastName, username, bio, email, role} = route.params;

    const [name, setName] = useState(firstName + " " + lastName);
    const [newName, setNewName] = useState("");
    const [first, last] = newName.split(" ");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newBio, setNewBio] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const storage = getStorage();

    const onSubmitPress = async () => {
        try {
            await setDoc(doc(db, "users", email), {
                username: newUsername,
                email: newEmail,
                bio: newBio,

            }, { merge: true });
            //console.log("Document written with ID: ", docRef.id);
            navigation.navigate('Profile Page')
        }
        catch (e) {
            console.log("Error adding document: ", e);
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        console.log(result);
        const fileName = result.uri.split('/').pop();
        const fileType = fileName.split('.').pop();
        console.log(fileName, fileType);

        const response = await fetch(result.uri)
        const blobFile = await response.blob()

        if (!result.canceled) {
            const listRef = ref(storage, `/users/${email}/profile`)
            listAll(listRef)
                .then(dir => {
                dir.items.forEach(fileRef => deleteObject(ref(storage, fileRef)));
                console.log("Files deleted successfully from Firebase Storage");
                })
            .catch(error => console.log(error));
            
          const storageRef = ref(storage, `users/${email}/profile/${fileName}`)
          uploadBytes(storageRef, blobFile).then((snapshot) => {
            alert("Profile Photo Changed!");
            console.log("Image uploaded!");
        })}
        else {
            console.log('No Image uploaded!')
        };
    };

    useEffect(() => {
        const listRef = ref(storage, `users/${email}/profile`);
        Promise.all([
            listAll(listRef).then((res) => {
              const promises = res.items.map((folderRef) => {
                return getDownloadURL(folderRef).then((link) =>  {
                  return link;
                });
              });
              return Promise.all(promises);
            })
          ]).then((results) => {
            const fetchedImages = results[0];
            const fetchedString = fetchedImages[0]
            console.log(fetchedString);
            setImages(fetchedString);
            setLoading(false)
          });
        
    }, [])

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
            <ScrollView>
                <View style={styles.profileContainer}>
                    <TouchableOpacity onPress={() => pickImage()}>
                        <Image source={{uri: images}} style={styles.profileImage} />
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
                <TextInput
                    placeholder='email'
                    placeholderTextColor="#aaaaaa"
                    style={styles.roleContainer}
                    onChangeText={(Text) => setNewEmail(Text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                >
                </TextInput>
                <View>
                    <Text style={styles.normalText}>Roles</Text>
                </View>
                <View style={styles.roleContainer}>
                    <Text>{role}</Text>
                </View>

                <View>
                    <Text style={styles.normalText}>Bio</Text>
                </View>
                <TextInput
                    placeholder='bio'
                    placeholderTextColor="#aaaaaa"
                    style={styles.bioContainer}
                    onChangeText={(Text) => setNewBio(Text)}
                    value={bio}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"   
                    maxLength={100}
                ></TextInput>

                <View>
                    <TouchableOpacity style={styles.updateButton} onPress={() => onSubmitPress()}>
                        <Text style={styles.updateButtonText}>Update</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    bioContainer:{
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        width: '90%',
        padding: 20,
        borderRadius: 10,
        shadowOpacity: 80,
        elevation: 15,
        marginTop: -30,
        height: 110,
        alignItems: 'flex-start',
    },
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
    updateButton: {
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
    updateButtonText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10
    },
});



    