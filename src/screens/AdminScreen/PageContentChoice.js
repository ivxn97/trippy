import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, FlatList, CheckBox } from 'react-native';
import styles from './styles';

export default function PageContentChoice({ navigation, route }) {
    // State to store the list of items
    

    return (
        <View>
            <View >
                <TouchableOpacity style={styles.buttonLanding}
                    title="topPage"
                    onPress={() =>
                        {navigation.navigate('Page Content', { activityType: 'topPage'})}
                    }
                >
                    <Text style={styles.buttonSmallText}>top page</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonLanding}
                    title="Restaurants"
                    onPress={() =>
                        {navigation.navigate('Page Content', { activityType: 'restaurants'})}
                    }
                >
                    <Text style={styles.buttonSmallText}>Restaurants</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonLanding}
                    title="Hotels"
                    onPress={() =>
                        {navigation.navigate('Page Content', {activityType: 'hotels'})}
                    }
                >
                    <Text style={styles.buttonSmallText}>Hotels</Text>
                </TouchableOpacity>
            </View>
                <TouchableOpacity style={styles.buttonLanding}
                    title="Attractions"
                    onPress={() =>
                        {navigation.navigate('Page Content', { activityType: 'attractions' })}
                    }
                >
                    <Text style={styles.buttonSmallText}>Attractions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonLanding}
                    title="Paid Tours"
                    onPress={() =>
                        {navigation.navigate('Page Content', { activityType: 'paidtours' })}
                    }
                >
                    <Text style={styles.buttonSmallText}>Paid Tours</Text>
                </TouchableOpacity>
            
        </View>
    );
};
