import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import styles from './styles';
import { db } from '../../../config';
import { render } from 'react-dom';
import RNPickerSelect from 'react-native-picker-select';


export default function RegistrationSelector({navigation}) {

    const [choice, setSelected] = useState('')

    const placeholder = {
        label: 'select a role',
        value: null,
        color: 'black',
    };

    const onSelectorPress = ()  => {
        if (choice == 'Registered User') {
            navigation.navigate('Register User')
        }
        else if (choice == 'LOL') {
            navigation.navigate('Register LOL')
        }
        else if (choice == 'Business Owner') {
            navigation.navigate('Register BO')
        }
    }

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    return (
        <View style={PStyles.container}>
        <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}
          style={PStyles.scrollContainer}
          contentContainerStyle={PStyles.scrollContentContainer}>
            <Image
                style={styles.imagePlaceholder}
                source={require('../../../assets/RegistrationBanner.png')}
            />
          <View paddingVertical={5} />
          <Text style={styles.text}>Select a Registration Account Role:</Text>
            <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={placeholder}
            useNativeAndroidPickerStyle={false}
            onValueChange={(value) => setSelected(value)}
            items = {[
                {label:'Registered User', value:'Registered User'},
                {label:'LOL', value:'LOL'},
                {label:'Business Owner', value:'Business Owner'},
            ]}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => onSelectorPress()}>
                <Text style={styles.buttonTitle}>Submit</Text>
            </TouchableOpacity>
            <View style={styles.footerView}>
                <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
            </View>
            </ScrollView>
        </View>
    )
}

const PStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 15,
    },
    scrollContentContainer: {
      paddingTop: 40,
      paddingBottom: 10,
    },
  });
  
  const pickerStyle = {
	inputIOS: {
		color: 'white',
		paddingTop: 13,
		paddingHorizontal: 10,
		paddingBottom: 12,
	},
	inputAndroid: {
		color: 'white',
	},
	placeholderColor: 'white',
	underline: { borderTopWidth: 0 },
	icon: {
		position: 'absolute',
		backgroundColor: 'transparent',
		borderTopWidth: 5,
		borderTopColor: '#00000099',
		borderRightWidth: 5,
		borderRightColor: 'transparent',
		borderLeftWidth: 5,
		borderLeftColor: 'transparent',
		width: 0,
		height: 0,
		top: 20,
		right: 15,
	},
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 16
    },
    inputAndroid: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 16
      }
})