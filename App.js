import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react'
import { NavigationContainer, TabRouter } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs' 
import Ionicons from '@expo/vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen, HomeScreen, RegistrationScreen, ForumScreen, 
        GuideScreen, ProfileScreen, TourScreen } from './src/screens'
import {decode, encode} from 'base-64'
import { Colors } from 'react-native/Libraries/NewAppScreen';
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function NavBar() {
  return (
    <Tab.Navigator
      initialRouteName='Home'
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => {
            let iconName;
            if (route.name === 'Deals') {
              iconName = focused ? 'md-flag' : 'md-flag-outline';
            } else if (route.name === 'Guide') {
              iconName = focused ? 'md-map' : 'md-map-outline';
            } else if (route.name === 'Home') {
              iconName = focused ? 'md-home' : 'md-home-outline';
            } else if (route.name === 'Forum') {
              iconName = focused ? 'md-chatbox-ellipses' : 'md-chatbox-ellipses-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'md-person' : 'md-person-outline';
            }
            return <Ionicons name={iconName} size={22} />
          },
        })}>
        <Tab.Screen
        name="Deals" 
        component={TourScreen}
        />
        <Tab.Screen 
        name="Guide" 
        component={GuideScreen}
        />
        <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        />
        <Tab.Screen 
        name="Forum" 
        component={ForumScreen}
        />
        <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        />
      </Tab.Navigator>
  )
}

export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  return (
    <NavigationContainer>
      <Stack.Navigator>
        { user ? (
          <Stack.Screen name="Home" component={NavBar}>
            {props => <HomeScreen {...props} extraData={user} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login" component={NavBar} />
            <Stack.Screen name="Registration" component={NavBar} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}