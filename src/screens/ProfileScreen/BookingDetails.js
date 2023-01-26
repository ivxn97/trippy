import React, { useEffect, useState } from "react";
import {  View, ActivityIndicator, Text, TouchableOpacity, Alert, StyleSheet, FlatList, TouchableHighlight, Modal, Button } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from './styles';
import { db } from '../../../config';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import Carousel from 'react-native-reanimated-carousel';
import * as WebBrowser from 'expo-web-browser';
import {bookmark, itinerary} from '../commonFunctions';
import ReviewScreen from '../ReviewScreen/ReviewScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Moment from 'moment';
import { doc, setDoc, getDoc, getDocs, collection, DocumentSnapshot, deleteDoc } from "firebase/firestore";
import uuid from 'react-native-uuid';

export default function BookingDetails ({route, navigation}) {
  const { date, orgPrice, discount, finalPrice, groupSize, id, name, time, email } = route.params;
  const [showModal, setShowModal] = useState(false);

  const onCancelPress = () => {
    setShowModal(true)
  }

  //Move current booking to previous booking for user to view in the future
  const moveBooking = async () => {
    try {
      await setDoc(doc(db, "previous bookings", id), {
        id: id,
        bookedBy: email,
        name: name,
        orgPrice: orgPrice,
        discount: discount,
        finalPrice: finalPrice,
        groupSize: groupSize,
        time: time,
        date: date
      })
    }
    catch (e) {
      console.log("Error adding document: ", e);
    }
  }

  const onConfirmDelete = () => {
    moveBooking();
    deleteDoc(doc(db, "bookings", id));
    navigation.navigate('Profile Page')
    setShowModal(false);
}

  return (
    <View style={[styles.detailsContainer]}>
    <View style={{alignItems: 'flex-end'}}>
    <Text style={styles.Heading}>Booking For {JSON.stringify(name).replace(/"/g,"")}</Text>
    <Text style={styles.textBooking}>Booking ID: </Text>
    <Text style={styles.textBooking}>{JSON.stringify(id).replace(/"/g,"")}</Text>
    <Text style={styles.textBooking}>Chosen Date: {Moment(date.toDate()).format('DD MMM YYYY')}</Text>
    <Text style={styles.textBooking}>Chosen Time: {JSON.stringify(time).replace(/"/g,"")}</Text>
    <Text style={styles.textBooking}>Group Size: {JSON.stringify(groupSize).replace(/"/g,"")}</Text>
    </View>
    <Text>{'\n'}</Text>
    <Text style={[styles.price, {fontSize:21}]}>Your booking is {Moment(date.toDate()).fromNow()}</Text>
    <Text style={[styles.price, {fontSize:21}]}>Price x {groupSize}: ${orgPrice}</Text>
    <Text style={[styles.price, {fontSize:21}]}>Discount from Deal: ${discount}</Text>
    <Text style={styles.price}>Final Price: ${finalPrice}</Text>
    <TouchableOpacity
      style={styles.button}
      onPress={() => onCancelPress()}>
      <Text style={styles.buttonTitle}>Cancel Booking</Text>
    </TouchableOpacity>
    <Modal visible={showModal}>
        <View style={styles.container}>
            <Text style={styles.message}>Are you sure you want to cancel your booking?</Text>
            <View style={styles.buttonContainer}>
                <Button title="Confirm" onPress={onConfirmDelete} />
                <View style={styles.space} />
                <Button title="Cancel" onPress={() => setShowModal(false)} />

            </View>
        </View>
    </Modal>
    </View>
  )
};