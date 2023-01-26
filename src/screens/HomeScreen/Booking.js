import React, { useEffect, useState } from "react";
import {  View, ActivityIndicator, Text, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from './styles';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import Carousel from 'react-native-reanimated-carousel';
import * as WebBrowser from 'expo-web-browser';
import {bookmark, itinerary} from '../commonFunctions';
import ReviewScreen from '../ReviewScreen/ReviewScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Moment from 'moment';
import { db } from '../../../config';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import uuid from 'react-native-uuid';

//Check capacity for paid tour has reached
//Check to ensure date and time matches operating hours
//Check Process payment
// Have deals redemption ability


export default function Booking ({route, navigation}) {
  const {activityType, name, timeSlots, capacity, startingTime, endingTime, duration, price, groupSize} = route.params;
  const [email, setEmail] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateTimePickerVisible, setDateTimePickerVisiblity] = useState(false);
  const [time, setTime] = useState('');
  const [size, setGroupSize] = useState('');
  const [date, setDate] = useState(new Date());
  const [confirmed, setConfirmed] = useState(true);

  
  const groupSizePicker = Array.from({length: groupSize}, (_, i) => i + 1).map(n => ({label: `${n}`, value: `${n}`}));
  console.log(groupSizePicker);
  console.log(timeSlots)

  const timeSlotsPicker = timeSlots.map(item => {
    return {label: item.time, value: item.time}})

  function onSubmit(model) {
    Alert.alert('Success: ' + JSON.stringify(model, null, 2))
  }

  const timeSlotPlaceholder = {
    label: 'Select time-slot',
    value: null,
    color: 'black',
  };

  const groupSizePlaceholder = {
    label: 'Select group size',
    value: null,
    color: 'black',
  };

  const getEmail = async () => {
    try {
        const email = await AsyncStorage.getItem('email');
        if (email !== null) {
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

  const onConfirmPress = async () => {
    const currentCapacity = capacity;
    const collectionRef = collection(db, "bookings")
        const q = query(collectionRef, where('name', '==', name));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (activityType == 'restaurants' || activityType == 'attractions' || activityType == 'paidtours') {
            if (Moment(date).format('DD-MM-YYYY') == Moment(doc.data().date.toDate()).format('DD-MM-YYYY')) {
              if (time == doc.data().time) {
                currentCapacity = currentCapacity - doc.data().groupSize
              }
            }
          }
          else if (activityType == 'hotels') {
            if (Moment(date).format('DD-MM-YYYY') == Moment(doc.data().date.toDate()).format('DD-MM-YYYY')) {
              currentCapacity = currentCapacity - doc.data().groupSize
            }
          }
        })
        if (currentCapacity > (0 + size)) {
          alert("Booking Details Is Valid");
          setConfirmed(false)
        }
        else {
          alert("The activity is unavailable on the chosen date and time")
        }
  }

  const onPaymentPress = async () => {
      navigation.navigate('Payment', {time: time, date: date, groupSize: size, 
        name: name, email: email, price: price})
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
    setDate(date);
    hideDatePicker();
  };

  if (activityType == 'attractions' || activityType == 'paidtours') {
    return (
      <View>
        <Text style={styles.Heading}>You are making a booking for {name}</Text>
        <Text style={[styles.Heading, {fontSize:23}]}>Selected Date: {Moment(date).format('DD MMM YYYY')}</Text>
        <TouchableOpacity style={styles.button} onPress={showDatePicker}>
          <Text style={styles.buttonTitle}>Select Date</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          minimumDate={new Date()}
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
        />
        <RNPickerSelect
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
          placeholder={timeSlotPlaceholder}
          onValueChange={(value) => setTime(value)}
          items = {timeSlotsPicker}
        />
        <RNPickerSelect
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
          placeholder={groupSizePlaceholder}
          onValueChange={(value) => setGroupSize(value)}
          items = {groupSizePicker}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onConfirmPress()}>
          <Text style={styles.buttonTitle}>Confirm Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {opacity: confirmed ? 0.2 : 1}]}
          onPress={() => onPaymentPress()}
          disabled={confirmed}>
          <Text style={styles.buttonTitle}>Proceed To Payment</Text>
        </TouchableOpacity>
      </View>
    )
  }
  else if (activityType == 'hotels') {
    return (
      <View>
        <Text style={styles.Heading}>You are making a booking for {name}</Text>
        <Text style={[styles.Heading, {fontSize:23}]}>Selected Date: {Moment(date).format('DD MMM YYYY')}</Text>
        <TouchableOpacity style={styles.button} onPress={showDatePicker}>
          <Text style={styles.buttonTitle}>Select Date</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          minimumDate={new Date()}
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
        />
        <RNPickerSelect
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
          placeholder={groupSizePlaceholder}
          onValueChange={(value) => setGroupSize(value)}
          items = {groupSizePicker}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onConfirmPress()}>
          <Text style={styles.buttonTitle}>Confirm Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {opacity: confirmed ? 0.2 : 1}]}
          onPress={() => onPaymentPress()}
          disabled={confirmed}>
          <Text style={styles.buttonTitle}>Proceed To Payment</Text>
        </TouchableOpacity>
      </View>
    )
  }
  else if (activityType == 'restaurants') {
    <View>
    <Text style={styles.Heading}>You are making a booking for {name}</Text>
    <Text style={[styles.Heading, {fontSize:23}]}>Selected Date: {Moment(date).format('DD MMM YYYY')}</Text>
    <TouchableOpacity style={styles.button} onPress={showDatePicker}>
      <Text style={styles.buttonTitle}>Select Date</Text>
    </TouchableOpacity>
    <DateTimePickerModal
      isVisible={isDatePickerVisible}
      mode="date"
      minimumDate={new Date()}
      onConfirm={handleConfirmDate}
      onCancel={hideDatePicker}
    />
    <RNPickerSelect
      style={pickerSelectStyles}
      useNativeAndroidPickerStyle={false}
      placeholder={timeSlotPlaceholder}
      onValueChange={(value) => setTime(value)}
      items = {timeSlotsPicker}
    />
    <RNPickerSelect
      style={pickerSelectStyles}
      useNativeAndroidPickerStyle={false}
      placeholder={groupSizePlaceholder}
      onValueChange={(value) => setGroupSize(value)}
      items = {groupSizePicker}
    />
    <TouchableOpacity
      style={styles.button}
      onPress={() => onConfirmPress()}>
      <Text style={styles.buttonTitle}>Confirm Details</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.button, {opacity: confirmed ? 0.2 : 1}]}
      onPress={() => navigation.navigate('Confirm Booking', { time: time, date: date, groupSize: groupSize, 
        name: name, email: email, price: price})}
      disabled={confirmed}>
      <Text style={styles.buttonTitle}>Go to Confirmation Screen</Text>
    </TouchableOpacity>
    </View>
  }
};

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 16
    },
    inputAndroid: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 16
      }
})