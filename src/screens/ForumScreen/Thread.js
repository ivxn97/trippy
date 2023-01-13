import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, Text, TextInput, TouchableOpacity, View, 
    StyleSheet, Share, FlatList, SafeAreaView } from 'react-native';    
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function Thread({route, navigation}) {
    const {title, description, section} = route.params;
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [registeredButton, setRegisteredButton] = useState(true);
    const [reply, setReply] = useState([]); // Initial empty array of replies


    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setRegisteredButton(false);
                setEmail(email);
                console.log(email)
            }
            else {
                console.log("No Email Selected at Login")
                setRegisteredButton(true);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(async () => {
        const q = query(collection(db, "forum reply"), where('title', '==', title))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(documentSnapshot => {
            reply.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });

        setReply(reply);
        setLoading(false);
    }, []);

    useFocusEffect(React.useCallback(async ()=> {
        getEmail();
    }, []));    

    const onShare = async () => {
        try {
            await Share.share({message:`Check out this amazing post - ${title} I found on TripAid!  
                ${title} title: ${title} 
                Download the App here: URL`})
        }
        catch (error) {
            console.log(error);
        }
    }

    const ItemView = ({item}) => {
        return (
            <TouchableHighlight
                underlayColor="#C8c9c9">
                <View style={styles.list}>
                    <Text>{item.addedBy}</Text>
                    <Text>{item.description}</Text>
                </View>
            </TouchableHighlight>
        )
       }
      
    //    temporary
    const DATA = [
        {
          comment_id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
          description: 'First Item',
        },
        {
            comment_id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            description: 'Second Item',
        },
        {
            comment_id: '58694a0f-3da1-471f-bd96-145571e29d72',
            description: 'Third Item',
        },
      ];

    return(
        <View style={styles.threadContainer}>
            <ScrollView>
            <Text style={styles.Heading}>{JSON.stringify(title).replace(/"/g,"")}</Text>

            {/* details */}
            <Text style={styles.textNB}>Title: {JSON.stringify(title).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Section: {JSON.stringify(section).replace(/"/g,"")}</Text>
            <Text style={styles.textNB}>Description: {JSON.stringify(description).replace(/"/g,"")}</Text>
            
            {/* buttons */}
            <View style={{ flexDirection:"row" }}>
                    <TouchableOpacity style={[styles.buttonSmall, {opacity: registeredButton ? 0.3 : 1}]}
                    disabled ={registeredButton} onPress={() => onLike()}>
                            <Text style={styles.buttonSmallText}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonSmall, {opacity: registeredButton ? 0.3 : 1}]} 
                    disabled ={registeredButton} onPress={() => {navigation.navigate('Create Reply', {title : title})}}>
                            <Text style={styles.buttonSmallText}>Comment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonSmall} onPress={() => onShare()}>
                            <Text style={styles.buttonSmallText}>Share</Text>
                    </TouchableOpacity>
                </View>

            {/* FlatList */}
            
                <FlatList
                    data={reply}
                    renderItem={ItemView}
                    keyExtractor={(item, index) => index.toString()}
                />
                </ScrollView>
        </View>
    )
    

}