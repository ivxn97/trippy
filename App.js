import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Text, View, LogBox } from 'react-native';
import React, { useEffect, useState } from 'react'
import { NavigationContainer, TabRouter } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs' 
import Ionicons from '@expo/vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen, HomeScreen, RegistrationRegisteredUser, ForumScreen, 
        GuideWTList, ProfileScreen, DealsScreen, AttractionList, AttractionView,
        RestaurantList, RestaurantScreen, AddHotel, HotelList, HotelScreen, DeleteHotel, PaidTourList, PaidTourScreen,
        AddAttraction, AddPaidTour, RegistrationSelector, RegistrationLOL, RegistrationBO, ListOfUsers, 
        AdminScreen, AdminViewUser, DealsList, AddDeal, AddRestaurant, AddGuide, GuideScreen, CreatePost, BOScreen,
      BOAttractionsList, BODealsList, BOHotelsList, BOPaidToursList, BORestaurantsList, LOLGuideList } from './src/screens'
import {decode, encode} from 'base-64'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
LogBox.ignoreAllLogs(); //Disable Log messages
const ProfileStack = createStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ unmountOnBlur: true}}>
        <Stack.Screen name="Profile Page" component={ProfileScreen}/>
        <Stack.Screen name="Add Hotel" component={AddHotel} />
        <Stack.Screen name="Add Attraction" component={AddAttraction}/>
        <Stack.Screen name="Add Paid Tour" component={AddPaidTour}/>
        <Stack.Screen name="Add Restaurant" component={AddRestaurant}/>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Registration Selector" component={RegistrationSelector}/>
        <Stack.Screen name="Register User" component={RegistrationRegisteredUser}/>
        <Stack.Screen name="Register LOL" component={RegistrationLOL}/>
        <Stack.Screen name="Register BO" component={RegistrationBO}/>
        <Stack.Screen name="List Of Users" component={ListOfUsers}/>
        <Stack.Screen name="Admin View User" component={AdminViewUser}/>
        <Stack.Screen name="Add Deal" component={AddDeal}/>
        <Stack.Screen name="Add Guide" component={AddGuide}/>
        <Stack.Screen name = "LOL Guides" component={LOLGuideList}/>
    </ProfileStack.Navigator>
  )
}

const DealsStack = createStackNavigator();

function DealsStackScreen() {
  return (
    <DealsStack.Navigator>
        <Stack.Screen name="Deals List" component={DealsList}/>
        <Stack.Screen name="Deal detail" component={DealsScreen}/>
    </DealsStack.Navigator>
  )
}

const GuideStack = createStackNavigator();

function GuideStackScreen() {
  return (
    <GuideStack.Navigator>
        <Stack.Screen name="Guide List" component={GuideWTList}/>
        <Stack.Screen name="Guide Screen" component={GuideScreen}/>
    </GuideStack.Navigator>
  )
}

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
        <Stack.Screen name="Home Page" component={HomeScreen}/>
        <Stack.Screen name="List of attractions" component={AttractionList}/>
        <Stack.Screen name="Attraction Details" component={AttractionView}/>
        <Stack.Screen name="List of hotels" component={HotelList}/>
        <Stack.Screen name="Hotel details" component={HotelScreen}/>
        <Stack.Screen name="List of restaurants" component={RestaurantList}/>
        <Stack.Screen name="Restaurant Details" component={RestaurantScreen}/>
        <Stack.Screen name="List of paid tours" component={PaidTourList}/>
        <Stack.Screen name="Paid tour details" component={PaidTourScreen}/>
    </HomeStack.Navigator>
  )
}

const ForumStack = createStackNavigator();

function ForumStackScreen() {
  return (
    <ForumStack.Navigator>
        <Stack.Screen name="Forum Page" component={ForumScreen}/>
        <Stack.Screen name="Create Post" component={CreatePost}/>
    </ForumStack.Navigator>
    
  )
}

const AdminStack = createStackNavigator();

function AdminStackScreen() {
  return (
    <AdminStack.Navigator>
        <Stack.Screen name="Admin Page" component={AdminScreen}/>
        <Stack.Screen name="List Of Accounts" component={ListOfUsers}/>
        <Stack.Screen name="Admin View Account" component={AdminViewUser}/>
    </AdminStack.Navigator>
  )
}

const BOStack = createStackNavigator();

function BOStackScreen() {
  return (
    <BOStack.Navigator>
      <Stack.Screen name="BO Page" component={BOScreen}/>
      <Stack.Screen name="BO Deals List" component={BODealsList}/>
      <Stack.Screen name="BO Hotels List" component={BOHotelsList}/>
      <Stack.Screen name="BO Attractions List" component={BOAttractionsList}/>
      <Stack.Screen name="BO Paid Tours List" component={BOPaidToursList}/>
      <Stack.Screen name="BO Restaurants List" component={BORestaurantsList}/>
      <Stack.Screen name="Add Hotel" component={AddHotel} />
      <Stack.Screen name="Delete Hotel" component={DeleteHotel} />
      <Stack.Screen name="Add Attraction" component={AddAttraction}/>
      <Stack.Screen name="Add Paid Tour" component={AddPaidTour}/>
      <Stack.Screen name="Add Restaurant" component={AddRestaurant}/>
      <Stack.Screen name="Add Deal" component={AddDeal}/>
      <Stack.Screen name="Attraction Details" component={AttractionView}/>
      <Stack.Screen name="Hotel details" component={HotelScreen}/>
      <Stack.Screen name="Restaurant Details" component={RestaurantScreen}/>
      <Stack.Screen name="Paid tour details" component={PaidTourScreen}/>
      <Stack.Screen name="Deal detail" component={DealsScreen}/>


    </BOStack.Navigator>
  )
}
function Tabs() {
  return (
      <Tab.Navigator
      initialRouteName='Home'
        screenOptions={({route}) => ({
          headerShown: false,
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
        component={DealsStackScreen}
        />
        <Tab.Screen 
        name="Guide" 
        component={GuideStackScreen}
        />
        <Tab.Screen 
        name="Home" 
        component={HomeStackScreen}
        />
        <Tab.Screen 
        name="Forum" 
        component={ForumStackScreen}
        />
        <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        />
      </Tab.Navigator>
  );
}

export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{
    headerShown: false
    }}>
      <Stack.Screen name = "Home" component={Tabs} />
      <Stack.Screen name = "Admin Stack" component={AdminStackScreen} />
      <Stack.Screen name = "BO Stack" component={BOStackScreen} />
    </Stack.Navigator>
    </NavigationContainer>
  )
}
