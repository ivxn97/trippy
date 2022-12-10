import React, { useState } from 'react'
import { Dimensions, Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import Carousel from 'react-native-reanimated-carousel';

export default function HomeScreen( {navigation} ) {
    const width = Dimensions.get('window').width;
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                mode="parallax"
                data={[...new Array(6).keys()]}
                scrollAnimationDuration={6000}
                pagingEnabled={true}
                snapEnabled={true}
                //onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>
                            {index}
                        </Text>
                    </View>
                )}
            />
            <View style={{ flexDirection: "row"}}>
            <TouchableOpacity style={styles.buttonSmallHome}
            title ="Restaurants"
            onPress={() =>
                navigation.navigate('List of restaurants')
            }
            >
            <Text style={styles.buttonSmallText}>Restaurants</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSmallHome}
            title ="Hotels"
            onPress={() =>
                navigation.navigate('List of hotels')
            }
            >
            <Text style={styles.buttonSmallText}>Hotels</Text>
            </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row"}}>
            <TouchableOpacity style={styles.buttonSmallHome}
            title ="Attractions"
            onPress={() =>
                navigation.navigate('List of attractions')
            }
            >
            <Text style={styles.buttonSmallText}>Attractions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSmallHome}
            title ="Paid Tours"
            onPress={() =>
                navigation.navigate('List of paid tours')
            }
            >
            <Text style={styles.buttonSmallText}>Paid Tours</Text>
            </TouchableOpacity>
        </View>
        <Text style={styles.HeadingList}>Tours:</Text>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Tour 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Tour 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Tour 3</Text>
        </TouchableOpacity>
        <Text style={styles.HeadingList}>Attractions:</Text>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Attraction 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Attraction 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Attraction 3</Text>
        </TouchableOpacity>
        <Text style={styles.HeadingList}>Hotels:</Text>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Hotel 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Hotel 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Hotel 3</Text>
        </TouchableOpacity>
        <Text style={styles.HeadingList}>Tours:</Text>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Tour 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Tour 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Tour 3</Text>
        </TouchableOpacity>
        </KeyboardAwareScrollView>
        </View>
    )
}