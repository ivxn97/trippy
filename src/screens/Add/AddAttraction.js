import React from 'react'
import { Text, View, FlatList } from 'react-native'
//TODO: add image uploading
export default function AddAttraction ( {navigation }) {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
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
                    value={name}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
            />
            <text>Attraction Type:</text>
            <text>Price:</text>
            <text>Age Group:</text>
            <text>Group Size:</text>
            <text>Opening Hours:</text>
            <text>Closing Hours:</text>
            <text>Language Preferences:</text>
            <text>Description:</text>
            <text>Location:</text>
            <text>Terms & Conditions:</text>
        </View>
    )
}