import React from 'react'
import { TextInput, View, FlatList } from 'react-native'
import styles from './styles';

//TODO: add image uploading
export default function AddAttraction ( {navigation }) {
    //const [name, setName] = useState('');
    //const [price, setPrice] = useState('');
    //const [firstName, setFirstName] = useState('')
   // const [firstName, setFirstName] = useState('')
    //const [firstName, setFirstName] = useState('')
    //const [firstName, setFirstName] = useState('')
    return (
        <View style={styles.container}>
            <text>Name:</text>
            <TextInput
                style={styles.input}
                placeholder='Name'
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setName(text)}
                value={Name}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <text>Attraction Type:</text>
            <text>Price:</text>
            <TextInput
                style={styles.input}
                placeholder='Price'
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setPrice(text)}
                value={price}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                keyboardType="numeric"
            />
            <text>Age Group:</text>
            <text>Group Size:</text>
            <TextInput
                style={styles.input}
                placeholder='Group Size'
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setGroupSize(text)}
                value={groupSize}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                keyboardType="numeric"
            />
            <text>Opening Hours:</text>
            <text>Closing Hours:</text>
            <text>Language Preferences:</text>
            <text>Description:</text>
            <text>Location:</text>
            <text>Terms & Conditions:</text>
        </View>
    )
}