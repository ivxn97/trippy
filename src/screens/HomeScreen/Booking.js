import React, { useEffect, useState } from "react";
import {  View, ActivityIndicator, Text, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
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
  const {activityType, name, timeSlots, capacity, startingTime, endingTime, duration, price, groupSize, roomTypes, checkInTime, checkOutTime} = route.params;
  const [email, setEmail] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isDateTimePickerVisible, setDateTimePickerVisiblity] = useState(false);
  const [time, setTime] = useState('');
  const [size, setGroupSize] = useState(1);
  const [date, setDate] = useState(new Date());
  const [confirmed, setConfirmed] = useState(true);
  const [newCapacity, setCapacity] = useState(capacity);
  const [hotelType, setSelectedType] = useState()
  const [hotelPrice, setHotelPrice] = useState()
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  
  const groupSizePicker = Array.from({length: groupSize}, (_, i) => i + 1).map(n => ({label: `${n}`, value: `${n}`}));
  console.log(groupSizePicker);
  console.log(timeSlots)
  
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
    const currentCapacity = newCapacity;
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
            if (Moment(startDate).format('DD-MM-YYYY') == Moment(doc.data().startDate.toDate()).format('DD-MM-YYYY')) {
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


  const setRoomType = (type, price, capacity) => {
    setHotelPrice(price)
    setSelectedType(type)
    setCapacity(capacity)
    setConfirmed(true)
  }

  useFocusEffect(React.useCallback(async ()=> {
      getEmail();
  }, []));


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setStartDatePickerVisibility(false);
    setEndDatePickerVisibility(false);
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

  const handleConfirmStartDate = (date) => {
    console.warn("A date has been picked: ", date);
    setStartDate(date);
    hideDatePicker();
  };

  const handleConfirmEndDate = (date) => {
    console.warn("A date has been picked: ", date);
    setEndDate(date);
    hideDatePicker();
  };

  if (activityType == 'paidtours') {
    const timeSlotsPicker = timeSlots.map(item => {
      return {label: item.time, value: item.time}})
    
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
          onPress={() => navigation.navigate('Payment', {time: time, date: date, groupSize: size, 
            name: name, email: email, price: price, activityType: activityType})}
          disabled={confirmed}>
          <Text style={styles.buttonTitle}>Proceed To Payment</Text>
        </TouchableOpacity>
      </View>
    )
  }
  else if (activityType == 'hotels') {
    return (
      <View>
        <ScrollView>
        <Text style={styles.Heading}>You are making a booking for {name}</Text>
        <Text style={[styles.Heading, {fontSize:20}]}>Selected Check-In Date: {Moment(startDate).format('DD MMM YYYY')}</Text>
        <TouchableOpacity style={styles.button} onPress={showStartDatePicker}>
          <Text style={styles.buttonTitle}>Select Check-In Date</Text>
        </TouchableOpacity>
        <Text style={[styles.Heading, {fontSize:20}]}>Selected Check-Out Date: {Moment(endDate).format('DD MMM YYYY')}</Text>
        <TouchableOpacity style={styles.button} onPress={showEndDatePicker}>
          <Text style={styles.buttonTitle}>Select Check-Out Date</Text>
        </TouchableOpacity>
        <Text style={styles.HeadingList}>Room Types:</Text>
        {
        roomTypes.map(item => {
            return(
            <View key={item.type}>
                <Text style={styles.text}>Room Type: {JSON.stringify(item.type).replace(/"/g, "")}</Text>
                <Text style={[styles.textNB, {marginLeft:8}]}>Room Price: ${JSON.stringify(item.price).replace(/"/g, "")}</Text>
                <TouchableOpacity
                    style={[styles.buttonALT, {marginTop:5, marginBottom: 5, height: 30}]}
                    onPress={() => setRoomType(item.type, item.price, item.capacity)}>
                    <Text style={styles.textNB}>Select Room Type</Text>
                </TouchableOpacity>
            </View>
            )
        })
        }
        <Text style={[styles.text, {fontSize:18}]}>Selected Room Type: {hotelType}</Text>
        <Text style={[styles.text, {marginLeft:8}]}>Check In Time: {JSON.stringify(checkInTime).replace(/"/g, "")}</Text>
                <Text style={[styles.text, {marginLeft:8}]}>Check Out Time: {JSON.stringify(checkOutTime).replace(/"/g, "")}</Text>
        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="date"
          minimumDate={new Date()}
          onConfirm={handleConfirmStartDate}
          onCancel={hideDatePicker}
        />
        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          minimumDate={startDate}
          onConfirm={handleConfirmEndDate}
          onCancel={hideDatePicker}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onConfirmPress()}>
          <Text style={styles.buttonTitle}>Confirm Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {opacity: confirmed ? 0.2 : 1}]}
          onPress={() => navigation.navigate('Payment', {time: time, startDate: startDate, endDate: endDate, 
            name: name, email: email, price: hotelPrice, roomType: hotelType, activityType: activityType, 
            groupSize: size, checkInTime: checkInTime, checkOutTime: checkOutTime})}
          disabled={confirmed}>
          <Text style={styles.buttonTitle}>Proceed To Payment</Text>
        </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
  else if (activityType == 'attractions') {
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
          onPress={() => navigation.navigate('Payment', {time: time, date: date, name: name, email: email,
            price: price, activityType: activityType, groupSize: size})}
          disabled={confirmed}>
          <Text style={styles.buttonTitle}>Proceed To Payment</Text>
        </TouchableOpacity>
      </View>
    )
  }
  else if (activityType == 'restaurants') {
    const timeSlotsPicker = timeSlots.map(item => {
      return {label: item.time, value: item.time}})
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
      onPress={() => navigation.navigate('Confirm Booking', { time: time, date: date, groupSize: groupSize, 
        name: name, email: email, price: price, activityType: activityType})}
      disabled={confirmed}>
      <Text style={styles.buttonTitle}>Go to Confirmation Screen</Text>
    </TouchableOpacity>
    </View>
    )
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