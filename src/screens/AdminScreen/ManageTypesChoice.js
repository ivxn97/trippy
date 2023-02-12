import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, FlatList, CheckBox } from 'react-native';
import styles from './styles';
import { ScrollView} from 'react-native-gesture-handler';
export default function ManageTypesChoice({ navigation }) {
    // State to store the list of items
    

    return (
        <View>
            <View >
                <ScrollView>
                    <Text style={[styles.HeadingTypes, {textAlign: "left"}]}>Attractions</Text>
                <TouchableOpacity style={styles.buttonLanding}
                    title="attractionType"
                    onPress={() =>
                        {navigation.navigate('Manage Types', { type: 'attractionType'})}
                    }
                >
                        <Text style={styles.buttonTypesText}>attractionType</Text>
                </TouchableOpacity>


                    <Text style={[styles.HeadingTypes, {textAlign: "left"}]}>Hotels</Text>
                <TouchableOpacity style={styles.buttonLanding}
                    title="amenitiesData"
                    onPress={() =>
                    { navigation.navigate('Manage Types', { type: 'amenitiesData'})}
                    }
                >
                        <Text style={styles.buttonTypesText}>amenitiesData</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonLanding}
                    title="roomFeaturesData"
                    onPress={() => { navigation.navigate('Manage Types', { type: 'roomFeaturesData' }) }
                    }
                >
                        <Text style={styles.buttonTypesText}>roomFeaturesData</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonLanding}
                    title="roomTypesData"
                    onPress={() => { navigation.navigate('Manage Types', { type: 'roomTypesData' }) }
                    }
                >
                        <Text style={styles.buttonTypesText}>roomTypesData</Text>
                </TouchableOpacity>


            
                    <Text style={[styles.HeadingTypes, {textAlign: "left"}]}>PaidTours</Text>
                <TouchableOpacity style={styles.buttonLanding}
                    title="paidTourType"
                    onPress={() =>
                    { navigation.navigate('Manage Types', { type: 'paidTourType'})}
                    }
                >
                        <Text style={styles.buttonTypesText}>paidTourType</Text>
                </TouchableOpacity>


         
                    <Text style={[styles.HeadingTypes, {textAlign: "left"}]}>Restaurants</Text>
                <TouchableOpacity style={styles.buttonLanding}
                    title="typesOfCuisine"
                    onPress={() =>
                    { navigation.navigate('Manage Types', { type: 'typesOfCuisine' })}
                    }
                >
                        <Text style={styles.buttonTypesText}>typesOfCuisine</Text>
                </TouchableOpacity>


            
                    <Text style={[styles.HeadingTypes, {textAlign: "left"}]}>Registered User Page</Text>
                <TouchableOpacity style={styles.buttonLanding}
                    title="interestTypes"
                    onPress={() =>
                    { navigation.navigate('Manage Types', { type: 'interestTypes' })}
                    }
                >
                        <Text style={styles.buttonTypesText}>interestTypes</Text>
                </TouchableOpacity>


     
                    <Text style={[styles.HeadingTypes, {textAlign: "left"}]}>Registration LOL</Text>
                <TouchableOpacity style={styles.buttonLanding}
                    title="socialMediaPlatform"
                    onPress={() => { navigation.navigate('Manage Types', { type: 'socialMediaPlatform' }) }
                    }
                >
                        <Text style={styles.buttonTypesText}>socialMediaPlatform</Text>
                </TouchableOpacity>


          
                    <Text style={[styles.HeadingTypes, {textAlign: "left"}]}>Common Fields</Text>
                <TouchableOpacity style={styles.buttonLanding}
                    title="ageGroup"
                    onPress={() => { navigation.navigate('Manage Types', { type: 'ageGroup' }) }
                    }
                >
                        <Text style={styles.buttonTypesText}>ageGroup</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonLanding}
                    title="countries"
                    onPress={() => { navigation.navigate('Manage Types', { type: 'countries' }) }
                    }
                >
                        <Text style={styles.buttonTypesText}>countries</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonLanding}
                    title="languages"
                    onPress={() => { navigation.navigate('Manage Types', { type: 'languages' }) }
                    }
                >
                        <Text style={styles.buttonTypesText}>languages</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonLanding}
                    title="preferredLanguage"
                    onPress={() => { navigation.navigate('Manage Types', { type: 'preferredLanguage' }) }
                    }
                >
                        <Text style={styles.buttonTypesText}>preferredLanguage</Text>
                </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
};
