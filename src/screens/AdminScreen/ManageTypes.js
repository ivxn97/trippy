import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, Button, TouchableOpacity, Modal} from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, QuerySnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../../../config';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import styles from '../ProfileScreen/styles';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NestableDraggableFlatList, NestableScrollContainer, ScaleDecorator } from 'react-native-draggable-flatlist';
import Checkbox from 'expo-checkbox';

export default function ManageTypes({ navigation, route }) {
    const { type } = route.params;
    const [isModalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedName, setSelectedName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true); // Set loading to true on component mount


    //Attractions
    const [attractionType, setAttractionType] = useState([]);

    //Hotels
    const [amenitiesData, setAmenitiesData] = useState([]);
    const [roomFeaturesData, setRoomFeaturesData] = useState([]);
    const [roomTypesData, setRoomTypesData] = useState([]);

    //PaidTours
    const [paidTourType, setPaidTourType] = useState([]);

    //Restaurants
    const [typesOfCuisine, setTypesOfCuisine] = useState([]);

    //Registered User Page
    const [interestTypes, setInterestTypes] = useState([]);

    //Registration LOL
    const [socialMediaPlatform, setSocialMediaPlatform] = useState([]);

    //Common Fields
    const [ageGroup, setAgeGroup] = useState([]);
    const [countries, setCountries] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [preferredLanguage, setPreferredLanguage] = useState([]);

    const onDelete = (name) => {
        setSelectedName(name);
        setShowModal(true);
    }
    const onConfirmDelete = async () => {
        
        if (type == 'attractionType') {
            const data = attractionType.filter(item => item.label !== selectedName)
            setAttractionType(data);
            try {
                await updateDoc(doc(db, "types", "AddAttraction"), {
                    attractionType: data
                });
            }
            catch (e) {
                console.log(e)
            }

        }

        else if (type == 'amenitiesData') {
            const data = amenitiesData.filter(item => item.name !== selectedName)
            setAmenitiesData(data);
            try {
                await updateDoc(doc(db, "types", "AddHotel"), {
                    amenitiesData: data
                });
            }
            catch (e) {
                console.log(e)
            }
        }
        else if (type == 'roomFeaturesData') {
            const data = roomFeaturesData.filter(item => item.name !== selectedName)
            setRoomFeaturesData(data);
            try {
                await updateDoc(doc(db, "types", "AddHotel"), {
                    roomFeaturesData: data
                });
            }
            catch (e) {
                console.log(e)
            }
        }
        else if (type == 'roomTypesData') {
            const data = roomTypesData.filter(item => item.name !== selectedName)
            setRoomTypesData(data);
            try {
                await updateDoc(doc(db, "types", "AddHotel"), {
                    roomTypesData: data
                });
            }
            catch (e) {
                console.log(e)
            }
        }

        else if (type == 'paidTourType') {
            const data = paidTourType.filter(item => item.label !== selectedName)
            setPaidTourType(data);
            try {
                await updateDoc(doc(db, "types", "AddPaidTour"), {
                    paidTourType: data
                });
            }
            catch (e) {
                console.log(e)
            }
        }

        else if (type == 'typesOfCuisine') {
            const data = typesOfCuisine.filter(item => item.label !== selectedName)
            setTypesOfCuisine(data);
            try {
                await updateDoc(doc(db, "types", "AddRestaurant"), {
                    typesOfCuisine: data
                });
            }
            catch (e) {
                console.log(e)
            }
        }

        else if (type == 'interestTypes') {
            const data = interestTypes.filter(item => item.name !== selectedName)
            setInterestTypes(data);
            try {
                await updateDoc(doc(db, "types", "RegisteredUserPage"), {
                    interestTypes: data
                });
            }
            catch (e) {
                console.log(e)
            }
        }

        else if (type == 'socialMediaPlatform') {
            const data = socialMediaPlatform.filter(item => item.label !== selectedName)
            setSocialMediaPlatform(data);
            try {
                await updateDoc(doc(db, "types", "RegistrationLOL"), {
                    socialMediaPlatform: data
                });
            }
            catch (e) {
                console.log(e)
            }
        }

        else if (type == 'ageGroup') {
            const data = ageGroup.filter(item => item.label !== selectedName)
            setAgeGroup(data);
            try {
                await updateDoc(doc(db, "types", "commonFields"), {
                    ageGroup: data
                });
            }
            catch (e) {
                console.log(e)
            }
        }
        else if (type == 'countries') {
            const data = countries.filter(item => item.label !== selectedName)
            setCountries(data);
            try {
                await updateDoc(doc(db, "types", "commonFields"), {
                    countries: data
                });
            }
            catch (e) {
                console.log(e)
            }
        }
        else if (type == 'languages') {
            const data = languages.filter(item => item.language !== selectedName)
            setLanguages(data);
            try {
                await updateDoc(doc(db, "types", "commonFields"), {
                    languages: data
                });
            }
            catch (e) {
                console.log(e)
            }
        }
        else if (type == 'preferredLanguage') {
            const data = preferredLanguage.filter(item => item.label !== selectedName)
            setPreferredLanguage(data);
            try {
                await updateDoc(doc(db, "types", "commonFields"), {
                    preferredLanguage: data
                });
            }
            catch (e) {
                console.log(e)
            }
        }
        
        setShowModal(false);
    }
    
    const handleSubmit = async () => {
        if (type == 'attractionType') {
            const object = {
                label: inputValue,
                value: inputValue
            };
            attractionType.push(object)
            try {
                await updateDoc(doc(db, "types", "AddAttraction"), {
                    attractionType: attractionType
                });
            }
            catch (e) {
                console.log(e)
            }
        }

        else if (type == 'amenitiesData') {
            const object = {
                isChecked: false,
                name: inputValue,
                value: inputValue
            };
            amenitiesData.push(object)
            try {
                await updateDoc(doc(db, "types", "AddHotel"), {
                    amenitiesData: amenitiesData
                });
            }
            catch (e) {
                console.log(e)
            }
        }
        else if (type == 'roomFeaturesData') {
            const object = {
                isChecked: false,
                name: inputValue,
                value: inputValue
            };
            roomFeaturesData.push(object)
            try {
                await updateDoc(doc(db, "types", "AddHotel"), {
                    roomFeaturesData: roomFeaturesData
                });
            }
            catch (e) {
                console.log(e)
            }
        }
        else if (type == 'roomTypesData') {
            const object = {
                isChecked: false,
                name: inputValue,
                value: inputValue
            };
            roomTypesData.push(object)
            try {
                await updateDoc(doc(db, "types", "AddHotel"), {
                    roomTypesData: roomTypesData
                });
            }
            catch (e) {
                console.log(e)
            }
        }

        else if (type == 'paidTourType') {
            const object = {
                label: inputValue,
                value: inputValue
            };
            paidTourType.push(object)
            try {
                await updateDoc(doc(db, "types", "AddPaidTour"), {
                    paidTourType: paidTourType
                });
            }
            catch (e) {
                console.log(e)
            }
        }

        else if (type == 'typesOfCuisine') {
            const object = {
                label: inputValue,
                value: inputValue
            };
            typesOfCuisine.push(object)
            try {
                await updateDoc(doc(db, "types", "AddRestaurant"), {
                    typesOfCuisine: typesOfCuisine
                });
            }
            catch (e) {
                console.log(e)
            }
        }

        else if (type == 'interestTypes') {
            const object = {
                isChecked: false,
                name: inputValue
            };
            interestTypes.push(object)
            try {
                await updateDoc(doc(db, "types", "RegisteredUserPage"), {
                    interestTypes: interestTypes
                });
            }
            catch (e) {
                console.log(e)
            }
        }

        else if (type == 'socialMediaPlatform') {
            const object = {
                label: inputValue,
                value: inputValue
            };
            socialMediaPlatform.push(object)
            try {
                await updateDoc(doc(db, "types", "RegistrationLOL"), {
                    socialMediaPlatform: socialMediaPlatform
                });
            }
            catch (e) {
                console.log(e)
            }
        }

        else if (type == 'ageGroup') {
            const object = {
                label: inputValue,
                value: inputValue
            };
            ageGroup.push(object)
            try {
                await updateDoc(doc(db, "types", "commonFields"), {
                    ageGroup: ageGroup
                });
            }
            catch (e) {
                console.log(e)
            }
        }
        else if (type == 'countries') {
            const object = {
                label: inputValue,
                value: inputValue
            };
            countries.push(object)
            try {
                await updateDoc(doc(db, "types", "commonFields"), {
                    countries: countries
                });
            }
            catch (e) {
                console.log(e)
            }
        }
        else if (type == 'languages') {
            const object = {
                isChecked: false,
                language: inputValue
            };
            languages.push(object)
            try {
                await updateDoc(doc(db, "types", "commonFields"), {
                    languages: languages
                });
            }
            catch (e) {
                console.log(e)
            }
        }
        else if (type == 'preferredLanguage') {
            const object = {
                label: inputValue,
                value: inputValue
            };
            preferredLanguage.push(object)
            try {
                await updateDoc(doc(db, "types", "commonFields"), {
                    preferredLanguage: preferredLanguage
                });
            }
            catch (e) {
                console.log(e)
            }
        }
        setInputValue("");
        setModalVisible(false);
    };

    const getCurrentContent = async () => {
        if (type == 'attractionType') {
            const docRef = doc(db, "types", "AddAttraction");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const attractionType = docSnap.data().attractionType
                setAttractionType(attractionType);
            }
            else {
                console.log("No data found")
            }
            console.log(attractionType);
        }

        else if (type == 'amenitiesData') {
            const docSnap = await getDoc(doc(db, "types", "AddHotel"))

            if (docSnap.exists()) {
                setAmenitiesData(docSnap.data().amenitiesData)
            }
        }
        else if (type == 'roomFeaturesData') {
            const docSnap = await getDoc(doc(db, "types", "AddHotel"))

            if (docSnap.exists()) {
                setRoomFeaturesData(docSnap.data().roomFeaturesData)
            }
        }
        else if (type == 'roomTypesData') {
            const docSnap = await getDoc(doc(db, "types", "AddHotel"))

            if (docSnap.exists()) {
                setRoomTypesData(docSnap.data().roomTypesData)
            }
        }

        else if (type == 'paidTourType') {
            const docSnap = await getDoc(doc(db, "types", "AddPaidTour"))

            if (docSnap.exists()) {
                setPaidTourType(docSnap.data().paidTourType)
            }
        }

        else if (type == 'typesOfCuisine') {
            const docSnap = await getDoc(doc(db, "types", "AddRestaurant"))

            if (docSnap.exists()) {
                setTypesOfCuisine(docSnap.data().typesOfCuisine)
            }

        }

        else if (type == 'interestTypes') {
            const docSnap = await getDoc(doc(db, "types", "RegisteredUserPage"))

            if (docSnap.exists()) {
                setInterestTypes(docSnap.data().interestTypes)
            }
        }

        else if (type == 'socialMediaPlatform') {
            const docSnap = await getDoc(doc(db, "types", "RegistrationLOL"))

            if (docSnap.exists()) {
                setSocialMediaPlatform(docSnap.data().socialMediaPlatform)
            }
        }

        else if (type == 'ageGroup') {
            const docSnap = await getDoc(doc(db, "types", "commonFields"))

            if (docSnap.exists()) {
                setAgeGroup(docSnap.data().ageGroup)
            }
        }
        else if (type == 'countries') {
            const docSnap = await getDoc(doc(db, "types", "commonFields"))

            if (docSnap.exists()) {
                setCountries(docSnap.data().countries)
            }
        }
        else if (type == 'languages') {
            const docSnap = await getDoc(doc(db, "types", "commonFields"))

            if (docSnap.exists()) {
                setLanguages(docSnap.data().languages)
            }
        }
        else if (type == 'preferredLanguage') {
            const docSnap = await getDoc(doc(db, "types", "commonFields"))

            if (docSnap.exists()) {
                setPreferredLanguage(docSnap.data().preferredLanguage)
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        if (loading) {
            getCurrentContent();
        }
    }, []);


    if (loading) {
        return <ActivityIndicator />;
    }

    if (type == 'attractionType') {
        return (
            <View>
                <ScrollView>
                    <Text style={styles.HeadingList}>attractionType</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.buttonSmall} onPress={() => setModalVisible(!isModalVisible)}>
                            <Text style={styles.buttonSmallListText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={attractionType}
                        renderItem={({ item }) => (
                            <TouchableHighlight
                                underlayColor="#C8c9c9"
                                onPress={() => onDelete(item.label)}>
                                <View style={styles.list}>
                                    <Text>{item.label}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(false);
                        }}
                    >
                        <View>
                            <Text></Text>
                            <Text style={styles.text}>Enter the value:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='value'
                                placeholderTextColor="#aaaaaa"
                                onChangeText={(Text) => setInputValue(Text)}
                                value={inputValue}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() =>  handleSubmit() }>
                                <Text style={styles.buttonTitle}>Add Type</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showModal}>
                        <View style={styles.container}>
                            <Text style={styles.message}>Are you sure you want to delete this data?</Text>
                            <View style={styles.buttonContainer}>
                                <Button title="Confirm" onPress={onConfirmDelete} />
                                <View style={styles.space} />
                                <Button title="Cancel" onPress={() => setShowModal(false)} />

                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        );
    }
    else if (type == 'amenitiesData') {
        return (
            <View>
                <ScrollView>
                    <Text style={styles.HeadingList}>amenitiesData</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.buttonSmall} onPress={() => setModalVisible(!isModalVisible)}>
                            <Text style={styles.buttonSmallListText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={amenitiesData}
                        renderItem={({ item }) => (
                            <TouchableHighlight
                                underlayColor="#C8c9c9"
                                onPress={() => onDelete(item.name)}>
                                <View style={styles.list}>
                                    <Text>{item.name}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(false);
                        }}
                    >
                        <View>
                            <Text></Text>
                            <Text style={styles.text}>Enter the value:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='value'
                                placeholderTextColor="#aaaaaa"
                                onChangeText={(Text) => setInputValue(Text)}
                                value={inputValue}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleSubmit()}>
                                <Text style={styles.buttonTitle}>Add Type</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showModal}>
                        <View style={styles.container}>
                            <Text style={styles.message}>Are you sure you want to delete this data?</Text>
                            <View style={styles.buttonContainer}>
                                <Button title="Confirm" onPress={onConfirmDelete} />
                                <View style={styles.space} />
                                <Button title="Cancel" onPress={() => setShowModal(false)} />

                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        );
    }
    else if (type == 'roomFeaturesData') {
        return (
            <View>
                <ScrollView>
                    <Text style={styles.HeadingList}>roomFeaturesData</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.buttonSmall} onPress={() => setModalVisible(!isModalVisible)}>
                            <Text style={styles.buttonSmallListText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={roomFeaturesData}
                        renderItem={({ item }) => (
                            <TouchableHighlight
                                underlayColor="#C8c9c9"
                                onPress={() => onDelete(item.name)}>
                                <View style={styles.list}>
                                    <Text>{item.name}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(false);
                        }}
                    >
                        <View>
                            <Text></Text>
                            <Text style={styles.text}>Enter the value:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='value'
                                placeholderTextColor="#aaaaaa"
                                onChangeText={(Text) => setInputValue(Text)}
                                value={inputValue}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleSubmit()}>
                                <Text style={styles.buttonTitle}>Add Type</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showModal}>
                        <View style={styles.container}>
                            <Text style={styles.message}>Are you sure you want to delete this data?</Text>
                            <View style={styles.buttonContainer}>
                                <Button title="Confirm" onPress={onConfirmDelete} />
                                <View style={styles.space} />
                                <Button title="Cancel" onPress={() => setShowModal(false)} />

                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        );
    }
    else if (type == 'roomTypesData') {
        return (
            <View>
                <ScrollView>
                    <Text style={styles.HeadingList}>roomTypesData</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.buttonSmall} onPress={() => setModalVisible(!isModalVisible)}>
                            <Text style={styles.buttonSmallListText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={roomTypesData}
                        renderItem={({ item }) => (

                            <TouchableHighlight
                                underlayColor="#C8c9c9"
                                onPress={() => onDelete(item.name)}>
                                <View style={styles.list}>
                                    <Text>{item.name}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(false);
                        }}
                    >
                        <View>
                            <Text></Text>
                            <Text style={styles.text}>Enter the value:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='value'
                                placeholderTextColor="#aaaaaa"
                                onChangeText={(Text) => setInputValue(Text)}
                                value={inputValue}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleSubmit()}>
                                <Text style={styles.buttonTitle}>Add Type</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showModal}>
                        <View style={styles.container}>
                            <Text style={styles.message}>Are you sure you want to delete this data?</Text>
                            <View style={styles.buttonContainer}>
                                <Button title="Confirm" onPress={onConfirmDelete} />
                                <View style={styles.space} />
                                <Button title="Cancel" onPress={() => setShowModal(false)} />

                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        );
    }
    else if (type == 'paidTourType') {
        return (
            <View>
                <ScrollView>
                    <Text style={styles.HeadingList}>paidTourType</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.buttonSmall} onPress={() => setModalVisible(!isModalVisible)}>
                            <Text style={styles.buttonSmallListText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={paidTourType}
                        renderItem={({ item }) => (

                            <TouchableHighlight
                                underlayColor="#C8c9c9"
                                onPress={() => onDelete(item.label)}>
                                <View style={styles.list}>
                                    <Text>{item.label}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(false);
                        }}
                    >
                        <View>
                            <Text></Text>
                            <Text style={styles.text}>Enter the value:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='value'
                                placeholderTextColor="#aaaaaa"
                                onChangeText={(Text) => setInputValue(Text)}
                                value={inputValue}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleSubmit()}>
                                <Text style={styles.buttonTitle}>Add Type</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showModal}>
                        <View style={styles.container}>
                            <Text style={styles.message}>Are you sure you want to delete this data?</Text>
                            <View style={styles.buttonContainer}>
                                <Button title="Confirm" onPress={onConfirmDelete} />
                                <View style={styles.space} />
                                <Button title="Cancel" onPress={() => setShowModal(false)} />

                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        );
    }
    else if (type == 'typesOfCuisine') {
        return (
            <View>
                <ScrollView>
                    <Text style={styles.HeadingList}>typesOfCuisine</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.buttonSmall} onPress={() => setModalVisible(!isModalVisible)}>
                            <Text style={styles.buttonSmallListText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={typesOfCuisine}
                        renderItem={({ item }) => (

                            <TouchableHighlight
                                underlayColor="#C8c9c9"
                                onPress={() => onDelete(item.label)}>
                                <View style={styles.list}>
                                    <Text>{item.label}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(false);
                        }}
                    >
                        <View>
                            <Text></Text>
                            <Text style={styles.text}>Enter the value:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='value'
                                placeholderTextColor="#aaaaaa"
                                onChangeText={(Text) => setInputValue(Text)}
                                value={inputValue}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleSubmit()}>
                                <Text style={styles.buttonTitle}>Add Type</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showModal}>
                        <View style={styles.container}>
                            <Text style={styles.message}>Are you sure you want to delete this data?</Text>
                            <View style={styles.buttonContainer}>
                                <Button title="Confirm" onPress={onConfirmDelete} />
                                <View style={styles.space} />
                                <Button title="Cancel" onPress={() => setShowModal(false)} />

                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        );
    }
    else if (type == 'interestTypes') {
        return (
            <View>
                <ScrollView>
                    <Text style={styles.HeadingList}>interestTypes</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.buttonSmall} onPress={() => setModalVisible(!isModalVisible)}>
                            <Text style={styles.buttonSmallListText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={interestTypes}
                        renderItem={({ item }) => (
                            <TouchableHighlight
                                underlayColor="#C8c9c9"
                                onPress={() => onDelete(item.name)}>
                                <View style={styles.list}>
                                    <Text>{item.name}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(false);
                        }}
                    >
                        <View>
                            <Text></Text>
                            <Text style={styles.text}>Enter the value:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='value'
                                placeholderTextColor="#aaaaaa"
                                onChangeText={(Text) => setInputValue(Text)}
                                value={inputValue}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleSubmit()}>
                                <Text style={styles.buttonTitle}>Add Type</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showModal}>
                        <View style={styles.container}>
                            <Text style={styles.message}>Are you sure you want to delete this data?</Text>
                            <View style={styles.buttonContainer}>
                                <Button title="Confirm" onPress={onConfirmDelete} />
                                <View style={styles.space} />
                                <Button title="Cancel" onPress={() => setShowModal(false)} />

                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        );
    }
    else if (type == 'socialMediaPlatform') {
        return (
            <View>
                <ScrollView>
                    <Text style={styles.HeadingList}>socialMediaPlatform</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.buttonSmall} onPress={() => setModalVisible(!isModalVisible)}>
                            <Text style={styles.buttonSmallListText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={socialMediaPlatform}
                        renderItem={({ item }) => (
                            <TouchableHighlight
                                underlayColor="#C8c9c9"
                                onPress={() => onDelete(item.label)}>
                                <View style={styles.list}>
                                    <Text>{item.label}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(false);
                        }}
                    >
                        <View>
                            <Text></Text>
                            <Text style={styles.text}>Enter the value:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='value'
                                placeholderTextColor="#aaaaaa"
                                onChangeText={(Text) => setInputValue(Text)}
                                value={inputValue}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleSubmit()}>
                                <Text style={styles.buttonTitle}>Add Type</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showModal}>
                        <View style={styles.container}>
                            <Text style={styles.message}>Are you sure you want to delete this data?</Text>
                            <View style={styles.buttonContainer}>
                                <Button title="Confirm" onPress={onConfirmDelete} />
                                <View style={styles.space} />
                                <Button title="Cancel" onPress={() => setShowModal(false)} />

                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        );
    }
    else if (type == 'ageGroup') {
        return (
            <View>
                <ScrollView>
                    <Text style={styles.HeadingList}>ageGroup</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.buttonSmall} onPress={() => setModalVisible(!isModalVisible)}>
                            <Text style={styles.buttonSmallListText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={ageGroup}
                        renderItem={({ item }) => (
                            <TouchableHighlight
                                underlayColor="#C8c9c9"
                                onPress={() => onDelete(item.label)}>
                                <View style={styles.list}>
                                    <Text>{item.label}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(false);
                        }}
                    >
                        <View>
                            <Text></Text>
                            <Text style={styles.text}>Enter the value:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='value'
                                placeholderTextColor="#aaaaaa"
                                onChangeText={(Text) => setInputValue(Text)}
                                value={inputValue}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleSubmit()}>
                                <Text style={styles.buttonTitle}>Add Type</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showModal}>
                        <View style={styles.container}>
                            <Text style={styles.message}>Are you sure you want to delete this data?</Text>
                            <View style={styles.buttonContainer}>
                                <Button title="Confirm" onPress={onConfirmDelete} />
                                <View style={styles.space} />
                                <Button title="Cancel" onPress={() => setShowModal(false)} />

                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        );
    }
    else if (type == 'countries') {
        return (
            <View>
                <ScrollView>
                    <Text style={styles.HeadingList}>countries</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.buttonSmall} onPress={() => setModalVisible(!isModalVisible)}>
                            <Text style={styles.buttonSmallListText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={countries}
                        renderItem={({ item }) => (
                            <TouchableHighlight
                                underlayColor="#C8c9c9"
                                onPress={() => onDelete(item.label)}>
                                <View style={styles.list}>
                                    <Text>{item.label}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(false);
                        }}
                    >
                        <View>
                            <Text></Text>
                            <Text style={styles.text}>Enter the value:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='value'
                                placeholderTextColor="#aaaaaa"
                                onChangeText={(Text) => setInputValue(Text)}
                                value={inputValue}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleSubmit()}>
                                <Text style={styles.buttonTitle}>Add Type</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showModal}>
                        <View style={styles.container}>
                            <Text style={styles.message}>Are you sure you want to delete this data?</Text>
                            <View style={styles.buttonContainer}>
                                <Button title="Confirm" onPress={onConfirmDelete} />
                                <View style={styles.space} />
                                <Button title="Cancel" onPress={() => setShowModal(false)} />

                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        );
    }
    else if (type == 'languages') {
        return (
            <View>
                <ScrollView>
                    <Text style={styles.HeadingList}>languages</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.buttonSmall} onPress={() => setModalVisible(!isModalVisible)}>
                            <Text style={styles.buttonSmallListText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={countries}
                        renderItem={({ item }) => (
                            <TouchableHighlight
                                underlayColor="#C8c9c9"
                                onPress={() => onDelete(item.language)}>
                                <View style={styles.list}>
                                    <Text>{item.language}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(false);
                        }}
                    >
                        <View>
                            <Text></Text>
                            <Text style={styles.text}>Enter the value:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='value'
                                placeholderTextColor="#aaaaaa"
                                onChangeText={(Text) => setInputValue(Text)}
                                value={inputValue}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleSubmit()}>
                                <Text style={styles.buttonTitle}>Add Type</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showModal}>
                        <View style={styles.container}>
                            <Text style={styles.message}>Are you sure you want to delete this data?</Text>
                            <View style={styles.buttonContainer}>
                                <Button title="Confirm" onPress={onConfirmDelete} />
                                <View style={styles.space} />
                                <Button title="Cancel" onPress={() => setShowModal(false)} />

                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        );
    }
    else if (type == 'preferredLanguage') {
        return (
            <View>
                <ScrollView>
                    <Text style={styles.HeadingList}>preferredLanguage</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.buttonSmall} onPress={() => setModalVisible(!isModalVisible)}>
                            <Text style={styles.buttonSmallListText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={preferredLanguage}
                        renderItem={({ item }) => (
                            <TouchableHighlight
                                underlayColor="#C8c9c9"
                                onPress={() => onDelete(item.label)}>
                                <View style={styles.list}>
                                    <Text>{item.label}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(false);
                        }}
                    >
                        <View>
                            <Text></Text>
                            <Text style={styles.text}>Enter the value:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='value'
                                placeholderTextColor="#aaaaaa"
                                onChangeText={(Text) => setInputValue(Text)}
                                value={inputValue}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleSubmit()}>
                                <Text style={styles.buttonTitle}>Add Type</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showModal}>
                        <View style={styles.container}>
                            <Text style={styles.message}>Are you sure you want to delete this data?</Text>
                            <View style={styles.buttonContainer}>
                                <Button title="Confirm" onPress={onConfirmDelete} />
                                <View style={styles.space} />
                                <Button title="Cancel" onPress={() => setShowModal(false)} />

                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        );
    }
}