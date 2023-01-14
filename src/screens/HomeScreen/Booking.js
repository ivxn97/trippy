import React, { useEffect, useState } from "react";
import { Button, View, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from './styles';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import Carousel from 'react-native-reanimated-carousel';
import * as WebBrowser from 'expo-web-browser';
import {bookmark, itinerary} from '../commonFunctions';
import ReviewScreen from '../ReviewScreen/ReviewScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

//Check capacity for paid tour has reached
//Check to ensure date and time matches operating hours
//Check Process payment
// Have deals redemption ability


export default function Booking ({route, navigation}) {
  const {activityType, name} = route.params;
  const [email, setEmail] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateTimePickerVisible, setDateTimePickerVisiblity] = useState(false);

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

useFocusEffect(React.useCallback(async ()=> {
    getEmail();
}, []));


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showDateTimePicker = () => {
    setDateTimePickerVisiblity(true);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisiblity(false);
  };

  const handleConfirmDateTime = (date) => {
    console.warn("A date has been picked: ", date);
    hideDateTimePicker();
  };

  const handleConfirmDate = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  if (activityType == 'restaurants' || activityType == 'attractions') {
    return (
      <View>
        <TouchableOpacity style={styles.button} onPress={showDateTimePicker}>
          <Text style={styles.buttonTitle}>Select Date and Time</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDateTimePickerVisible}
          mode="datetime"
          onConfirm={handleConfirmDateTime}
          onCancel={hideDatePicker}
        />
      </View>
    )
  }
  else if (activityType == 'hotels') {
    return (
      <View>
        <TouchableOpacity style={styles.button} onPress={showDatePicker}>
          <Text style={styles.buttonTitle}>Select Date</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
        />
      </View>
    )
  }
  else if (activityType == 'paidtours') {
    return (
      <View>
        <TouchableOpacity style={styles.button} onPress={showDateTimePicker}>
          <Text style={styles.buttonTitle}>Select Date and Time</Text>
        </TouchableOpacity>
      </View>
    )
  }
};
