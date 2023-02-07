import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Text, View, LogBox } from 'react-native';
import React, { useEffect, useState } from 'react'
import { NavigationContainer, TabRouter } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack'
import {
  LoginScreen, HomeScreen, RegistrationRegisteredUser, ForumScreen,
  GuideList, ProfileScreen, DealsScreen, AttractionList, RestaurantList, HotelList, PaidTourList,
  RegistrationSelector, RegistrationLOL, RegistrationBO, ListOfUsers,
  AdminScreen, AdminViewUser, DealsList, AddHotel, AddDeal, AddRestaurant, AddAttraction, AddPaidTour, AddGuide,
  DeleteHotel, DeleteDeal, DeleteRestaurant, DeleteAttraction, DeletePaidTour, GuideScreen, CreatePost, BOScreen,
  BOAttractionsList, BODealsList, BOHotelsList, BOPaidToursList, BORestaurantsList, LOLGuideList, EditRestaurant,
  RestaurantEditList, PaidTourEditList, EditPaidTour, AttractionEditList, EditAttraction, HotelEditList,
  EditHotel, DealsEditList, EditDeal, Bookmarks, Itinerary, Details, ManageForumSections, AddForumSection,
  EditForumSection, ForumSectionsEditList, Section, ReviewScreen, AddReviewScreen, Thread, 
  CreateReply, EditReply, ReviewDetailScreen, ActiveThread, PageContent, Booking, PageContentChoice, 
  ActiveThreadEditList, ActiveThreadEdit, ActiveThreadDelete, DeleteBookmark, EditReview, ProfilePage, OTPScreen,
  ResetPassword, ReviewPendingAccounts, ReviewAccount, GuideSection, Payment, ConfirmBooking, UserBookings, 
  BookingDetails, UserPreviousBookings, PreviousBookingDetails, UserDealsList, LOLWalkingToursList, AddWalkingTour, 
  GuideWTLanding, WalkingToursList, WalkingTourSection, WalkingTourScreen, WTMapView, SearchBookmarks, EditGuide,
  EditGuidesList, GuideSectionExpired, EditWalkingTour, EditWalkingToursList, WalkingToursExpired, AdminEditGuidesList,
  AdminEditWalkingToursList, AdminEditAttractionsList, AdminEditDealsList, AdminEditHotelsList, AdminEditPaidToursList, 
  AdminEditRestaurantsList, ManageTypes, ManageTypesChoice, 
  ManageGuideSections, AddGuideSection, EditGuideSection, GuideSectionsEditList, DeleteGuideSection, GuideSectionsDeleteList,
  ManageWTSections, AddWTSection, EditWTSection, WTSectionsEditList, WTSectionsDeleteList, DeleteWTSection, DeleteItinerary, DeleteForumSection, 
  ForumSectionsDeleteList, ItineraryMapView, EditPost
} from './src/screens'
import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
LogBox.ignoreAllLogs(); //Disable Log messages
const ProfileStack = createStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ unmountOnBlur: true }}>
      <Stack.Screen name="Profile Page" component={ProfileScreen} />
      <Stack.Screen name="Add Hotel" component={AddHotel} />
      <Stack.Screen name="Add Attraction" component={AddAttraction} />
      <Stack.Screen name="Add Paid Tour" component={AddPaidTour} />
      <Stack.Screen name="Add Restaurant" component={AddRestaurant} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTP Screen" component={OTPScreen} />
      <Stack.Screen name="Reset Password" component={ResetPassword} />
      <Stack.Screen name="Registration Selector" component={RegistrationSelector} />
      <Stack.Screen name="Register User" component={RegistrationRegisteredUser} />
      <Stack.Screen name="Register LOL" component={RegistrationLOL} />
      <Stack.Screen name="Register BO" component={RegistrationBO} />
      <Stack.Screen name="List Of Users" component={ListOfUsers} />
      <Stack.Screen name="Admin View User" component={AdminViewUser} />
      <Stack.Screen name="Add Deal" component={AddDeal} />
      <Stack.Screen name="Add Guide" component={AddGuide} />
      <Stack.Screen name="Add Walking Tour" component={AddWalkingTour} />
      <Stack.Screen name="LOL Guides" component={LOLGuideList} />
      <Stack.Screen name="LOL Walking Tours" component={LOLWalkingToursList} />
      <Stack.Screen name="Guide Screen" component={GuideScreen} />
      <Stack.Screen name="Bookmarks" component={Bookmarks} />
      <Stack.Screen name="Delete Bookmark" component={DeleteBookmark} />
      <Stack.Screen name="Itinerary" component={Itinerary} />
      <Stack.Screen name ="Delete Itinerary" component={DeleteItinerary} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="Review Screen" component={ReviewScreen} />
      <Stack.Screen name="Active Thread" component={ActiveThread} />
      <Stack.Screen name="Edit Thread" component={ActiveThreadEdit} />
      <Stack.Screen name="Edit Thread List" component={ActiveThreadEditList} />
      <Stack.Screen name="Delete Thread" component={ActiveThreadDelete} />
      <Stack.Screen name="Profile" component={ProfilePage} />
      <Stack.Screen name="User Bookings" component={UserBookings} />
      <Stack.Screen name="Booking Details" component={BookingDetails} />
      <Stack.Screen name="User Previous Bookings" component={UserPreviousBookings} />
      <Stack.Screen name="Previous Booking Details" component={PreviousBookingDetails} />
      <Stack.Screen name="User Deals" component={UserDealsList} />
      <Stack.Screen name="Deal detail" component={DealsScreen} />
      <Stack.Screen name="Search Bookmarks" component={SearchBookmarks} />
      <Stack.Screen name="Edit Guides List" component={EditGuidesList} />
      <Stack.Screen name="Edit Guide" component={EditGuide} />
      <Stack.Screen name="Edit Walking Tours List" component={EditWalkingToursList} />
      <Stack.Screen name="Edit Walking Tours" component={EditWalkingTour} />
      <Stack.Screen name="Itinerary Map View" component={ItineraryMapView} />
    </ProfileStack.Navigator>
  )
}

const DealsStack = createStackNavigator();

function DealsStackScreen() {
  return (
    <DealsStack.Navigator>
      <Stack.Screen name="Deals List" component={DealsList} />
      <Stack.Screen name="Deal detail" component={DealsScreen} />
    </DealsStack.Navigator>
  )
}

const GuideStack = createStackNavigator();

function GuideStackScreen() {
  return (
    <GuideStack.Navigator>
      <Stack.Screen name="Guide WT Landing" component={GuideWTLanding} />
      <Stack.Screen name="Guide List" component={GuideList} />
      <Stack.Screen name="Guide Screen" component={GuideScreen} />
      <Stack.Screen name="Guide Section" component={GuideSection} />
      <Stack.Screen name="Guide Section Expired" component={GuideSectionExpired} />
      <Stack.Screen name="Walking Tours List" component={WalkingToursList} />
      <Stack.Screen name="Walking Tour Section" component={WalkingTourSection} />
      <Stack.Screen name="Walking Tour Section Expired" component={WalkingToursExpired} />
      <Stack.Screen name="Walking Tour Screen" component={WalkingTourScreen} />
      <Stack.Screen name="Add Guide" component={AddGuide} />
      <Stack.Screen name="Add Walking Tour" component={AddWalkingTour} />
      <Stack.Screen name="WT Map View" component={WTMapView} />
      <Stack.Screen name="Review Screen" component={ReviewScreen} />
      <Stack.Screen name="Add Review Screen" component={AddReviewScreen} />
      <Stack.Screen name="Review Detail Screen" component={ReviewDetailScreen} />
      <Stack.Screen name="Edit Review" component={EditReview} />
    </GuideStack.Navigator>
  )
}

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <Stack.Screen name="Home Page" component={HomeScreen} />
      <Stack.Screen name="List of attractions" component={AttractionList} />
      <Stack.Screen name="List of hotels" component={HotelList} />
      <Stack.Screen name="List of restaurants" component={RestaurantList} />
      <Stack.Screen name="List of paid tours" component={PaidTourList} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="Review Screen" component={ReviewScreen} />
      <Stack.Screen name="Add Review Screen" component={AddReviewScreen} />
      <Stack.Screen name="Review Detail Screen" component={ReviewDetailScreen} />
      <Stack.Screen name="Edit Review" component={EditReview} />
      <Stack.Screen name="Booking" component={Booking}/>
      <Stack.Screen name="Payment" component={Payment}/>
      <Stack.Screen name="Confirm Booking" component={ConfirmBooking}/>
    </HomeStack.Navigator>
  )
}

const ForumStack = createStackNavigator();

function ForumStackScreen() {
  return (
    <ForumStack.Navigator>
      <Stack.Screen name="Forum Page" component={ForumScreen} />
      <Stack.Screen name="Create Post" component={CreatePost} />
      <Stack.Screen name="Section" component={Section} />
      <Stack.Screen name="Create Reply" component={CreateReply} />
      <Stack.Screen name="Thread" component={Thread} />
      <Stack.Screen name="Edit Reply" component={EditReply} />
      <Stack.Screen name="Edit Post" component={EditPost} />
    </ForumStack.Navigator>

  )
}

const AdminStack = createStackNavigator();

function AdminStackScreen() {
  return (
    <AdminStack.Navigator>
      <Stack.Screen name="Admin Page" component={AdminScreen} />
      <Stack.Screen name="List Of Accounts" component={ListOfUsers} />
      <Stack.Screen name="Admin View Account" component={AdminViewUser} />
      <Stack.Screen name="Manage Forum Sections" component={ManageForumSections} />
      <Stack.Screen name="Forum Sections Edit List" component={ForumSectionsEditList} />
      <Stack.Screen name="Review Pending Accounts" component={ReviewPendingAccounts} />
      <Stack.Screen name="Add Forum Section" component={AddForumSection} />
      <Stack.Screen name="Edit Forum Section" component={EditForumSection} />      
      <Stack.Screen name="Delete Forum Section" component={DeleteForumSection} />
      <Stack.Screen name="Forum Sections Delete List" component={ForumSectionsDeleteList} />
      <Stack.Screen name="Create Post" component={CreatePost} />
      <Stack.Screen name="Page Content" component={PageContent} />
      <Stack.Screen name="Page Content Choice" component={PageContentChoice} />
      <Stack.Screen name="Review Account" component={ReviewAccount} />
      <Stack.Screen name="Admin Edit Walking Tours List" component={AdminEditWalkingToursList} />
      <Stack.Screen name="Admin Edit Guides List" component={AdminEditGuidesList} />
      <Stack.Screen name="Admin Edit Attractions List" component={AdminEditAttractionsList} />
      <Stack.Screen name="Admin Edit Deals List" component={AdminEditDealsList} />
      <Stack.Screen name="Admin Edit Hotels List" component={AdminEditHotelsList} />
      <Stack.Screen name="Admin Edit PaidTours List" component={AdminEditPaidToursList} />
      <Stack.Screen name="Admin Edit Restaurants List" component={AdminEditRestaurantsList} />
      <Stack.Screen name="Edit Walking Tours" component={EditWalkingTour} />
      <Stack.Screen name="Edit Guide" component={EditGuide} />
      <Stack.Screen name="Edit Restaurant" component={EditRestaurant} />
      <Stack.Screen name="Edit Paid Tour" component={EditPaidTour} />
      <Stack.Screen name="Edit Attraction" component={EditAttraction} />
      <Stack.Screen name="Edit Hotel" component={EditHotel} />
      <Stack.Screen name="Edit Deal" component={EditDeal} />
      <Stack.Screen name="Manage Types" component={ManageTypes} />
      <Stack.Screen name="Manage Types Choice" component={ManageTypesChoice} />
      <Stack.Screen name="Manage Guide Sections" component={ManageGuideSections} />
      <Stack.Screen name="Add Guide Section" component={AddGuideSection} />
      <Stack.Screen name="Edit Guide Section" component={EditGuideSection} />
      <Stack.Screen name="Delete Guide Section" component={DeleteGuideSection} />
      <Stack.Screen name="Guide Sections Edit List" component={GuideSectionsEditList} />
      <Stack.Screen name="Guide Sections Delete List" component={GuideSectionsDeleteList} />
      <Stack.Screen name="Manage Walking Tour Sections" component={ManageWTSections} />
      <Stack.Screen name="Add Walking Tour Section" component={AddWTSection} />
      <Stack.Screen name="Edit Walking Tour Section" component={EditWTSection} />
      <Stack.Screen name="Delete Walking Tour Section" component={DeleteWTSection} />
      <Stack.Screen name="Walking Tour Sections Edit List" component={WTSectionsEditList} />
      <Stack.Screen name="Walking Tour Sections Delete List" component={WTSectionsDeleteList} />
    </AdminStack.Navigator>
  )
}

const BOStack = createStackNavigator();

function BOStackScreen() {
  return (
    <BOStack.Navigator>
      <Stack.Screen name="BO Page" component={BOScreen} />
      <Stack.Screen name="BO Deals List" component={BODealsList} />
      <Stack.Screen name="BO Hotels List" component={BOHotelsList} />
      <Stack.Screen name="BO Attractions List" component={BOAttractionsList} />
      <Stack.Screen name="BO Paid Tours List" component={BOPaidToursList} />
      <Stack.Screen name="BO Restaurants List" component={BORestaurantsList} />
      <Stack.Screen name="Add Hotel" component={AddHotel} />
      <Stack.Screen name="Add Attraction" component={AddAttraction} />
      <Stack.Screen name="Add Paid Tour" component={AddPaidTour} />
      <Stack.Screen name="Add Restaurant" component={AddRestaurant} />
      <Stack.Screen name="Add Deal" component={AddDeal} />
      <Stack.Screen name="Delete Hotel" component={DeleteHotel} />
      <Stack.Screen name="Delete Attraction" component={DeleteAttraction} />
      <Stack.Screen name="Delete Paid Tour" component={DeletePaidTour} />
      <Stack.Screen name="Delete Restaurant" component={DeleteRestaurant} />
      <Stack.Screen name="Delete Deal" component={DeleteDeal} />
      <Stack.Screen name="Deal detail" component={DealsScreen} />
      <Stack.Screen name="Restaurant Edit List" component={RestaurantEditList} />
      <Stack.Screen name="Edit Restaurant" component={EditRestaurant} />
      <Stack.Screen name="Paid Tours Edit List" component={PaidTourEditList} />
      <Stack.Screen name="Edit Paid Tour" component={EditPaidTour} />
      <Stack.Screen name="Attraction Edit List" component={AttractionEditList} />
      <Stack.Screen name="Edit Attraction" component={EditAttraction} />
      <Stack.Screen name="Hotel Edit List" component={HotelEditList} />
      <Stack.Screen name="Edit Hotel" component={EditHotel} />
      <Stack.Screen name="Deals Edit List" component={DealsEditList} />
      <Stack.Screen name="Edit Deal" component={EditDeal} />
      <Stack.Screen name="Details" component={Details} />
    </BOStack.Navigator>
  )
}
function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
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
        <Stack.Screen name="Home" component={Tabs} />
        <Stack.Screen name="Admin Stack" component={AdminStackScreen} />
        <Stack.Screen name="BO Stack" component={BOStackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
