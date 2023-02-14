import React, { useEffect, useState, useRef } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';


export default function ResetPassword({navigation}) {
    const [email, setEmail] = useState();
    // Sends an email to reset password. Function is handled by Firebase directly. 
    const sendResetEmail = () => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email, null)
        .then(() => {
            alert("Password Reset email sent to " + email )
        })
        .catch((e) => {
            console.log(e)
        })
        navigation.navigate('Login')
    }
     return (
        <View style={styles.container}>
            <KeyboardAwareScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/splash.png')}
                />
                <Text style={styles.text}>Enter your E-mail address</Text>
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={[styles.button, {opacity: email ? 1 : 0.3}]}
                    onPress={() => sendResetEmail()}
                    disabled={email ? false : true}>
                    <Text style={styles.buttonTitle}>Send password reset E-mail</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    )
}