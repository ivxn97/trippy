import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, FlatList, CheckBox } from 'react-native';
import styles from './styles';

export default function PageContentChoice({ navigation, route }) {
    // Displays the HomePage content choices
    

    return (
        <View>
            <View >
                <TouchableOpacity style={styles.buttonLanding}
                    title="topPage"
                    onPress={() =>
                        {navigation.navigate('Page Content', { activityType: 'topPage'})}
                    }
                >
                    <Text style={styles.textNB}>Top Page</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonLanding}
                    title="Restaurants"
                    onPress={() =>
                        {navigation.navigate('Page Content', { activityType: 'restaurants'})}
                    }
                >
                    <Text style={styles.textNB}>Restaurants</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonLanding}
                    title="Hotels"
                    onPress={() =>
                        {navigation.navigate('Page Content', {activityType: 'hotels'})}
                    }
                >
                    <Text style={styles.textNB}>Hotels</Text>
                </TouchableOpacity>
            </View>
                <TouchableOpacity style={styles.buttonLanding}
                    title="Attractions"
                    onPress={() =>
                        {navigation.navigate('Page Content', { activityType: 'attractions' })}
                    }
                >
                    <Text style={styles.textNB}>Attractions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonLanding}
                    title="Paid Tours"
                    onPress={() =>
                        {navigation.navigate('Page Content', { activityType: 'paidtours' })}
                    }
                >
                    <Text style={styles.textNB}>Paid Tours</Text>
                </TouchableOpacity>
            
        </View>
    );
};
