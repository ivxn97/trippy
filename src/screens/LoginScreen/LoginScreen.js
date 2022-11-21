import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { db } from '../../../config';
import { FireSQL } from 'firesql';

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const fireSQL = new FireSQL(db);

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }
    const auth = getAuth();

    const onLoginPress = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            try {
                const user = userCredential.user;
                /*const docRef = doc(db, "users", email);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log("Login Success");
                }
                else {
                    console.log("Login failed");
                }
                //console.log("Document written with ID: ", docRef.id);
                navigation.navigate('Profile', {user: auth}) 
                const q = query(collection(db, "users"), where("email", "==", email));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {

                })*/

                /*const queryPromise = fireSQL.query(`SELECT role FROM users WHERE email = `email);
                queryPromise.then(users => {
                    for (const user of users) {
                        if (`${user.role}` == 'Registered User') {
                            const userRole = 'Registered User';
                            navigation.navigate('Home', {user: userRole})
                        }
                        else if (`${user.role}` == 'LOL') {
                            const userRole = 'LOL';
                            navigation.navigate('Home', {user: userRole})
                        }
                        else if (`${user.role}` == 'Business Owner') {
                            const userRole = 'Business Owner';
                            navigation.navigate('Profile', {user: userRole})
                        }
                        else if (`${user.role}` == 'Admin') {
                            const userRole = 'Admin';
                            navigation.navigate('AdminScreen', {user: userRole})
                        }
                        else {
                            console.log ("error");
                        }
                    }
                })*/

                const usr = db.collection('users');
                usr.where('email', '==', email).where('role', '==', 'Registered User').get();
            }
            catch (e) {
                console.log("Error adding document: ", e);
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}