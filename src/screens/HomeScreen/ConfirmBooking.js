import React, { useEffect, useState } from "react";
import {  View, ActivityIndicator, Text, TouchableOpacity, Alert, StyleSheet, FlatList, TouchableHighlight } from "react-native";
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
import { doc, setDoc, getDoc, getDocs, collection, DocumentSnapshot } from "firebase/firestore";
import uuid from 'react-native-uuid';

export default function Booking ({route, navigation}) {
  const {time, date, groupSize, name, email, price, lastFourDigits} = route.params;
  const id = uuid.v4();
  const [loading, setLoading] = useState(true)
  const [claimedDeals, setClaimedDeals] = useState();
  const [dealInfo, setDealInfo] = useState([]);
  const [redeemableDeals, setRedeemableDeals] = useState([]);
  const [shouldRun, setShouldRun] = useState(true);
  const [shouldShow, setShouldShow] = useState(false)
  const [currentPrice, setCurrentPrice] = useState((price * groupSize))
  const [selectedDiscount, setSelectedDiscount] = useState(0)

  const getClaimedDeals = async () => {
    const docRef = doc(db, "users", email)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setClaimedDeals(docSnap.data().claimedDeals)
    }
    setShouldRun(false)
  }

  const getDealInfo = async () => {
    const querySnapshot = await getDocs(collection(db, "deals"))
    querySnapshot.forEach(documentSnapshot => {
      dealInfo.push({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
      });
    })

    //Filter the deals to only the ones that the user has redeemed
    const firstFilter = dealInfo.filter(item => claimedDeals.includes(item.code))
    //Filter the deals to only the ones that are applicable to this business 
    const finalFilter = firstFilter.filter(item => item.businessName === name || item.businessName === "ALL")
    console.log(finalFilter)
    setRedeemableDeals(finalFilter);
    setLoading(false)
  }

  useEffect(() => {
    if (shouldRun) {
      getClaimedDeals();
      if (claimedDeals) {
        getDealInfo();
      }
    }
  },[claimedDeals])

  const onPaymentPress = async () => {
    try {
      await setDoc(doc(db, "bookings", id), {
        id: id,
        bookedBy: email,
        name: name,
        orgPrice: (price * groupSize),
        discount: selectedDiscount,
        finalPrice: currentPrice,
        groupSize: groupSize,
        time: time,
        date: date
      })
      alert("Booking Successful!")
      navigation.navigate('Home Page')
    }
    catch (e) {
      console.log("Error adding document: ", e);
    }
  }

  const paymentCalculation = (price, discount) => {
    setSelectedDiscount(((price * groupSize) * (discount/100)))
    const finalPrice = (price * groupSize) - ((price * groupSize) * (discount/100))
    setCurrentPrice(finalPrice)
    setShouldShow(!shouldShow);
  }

  if (loading) {
    return <ActivityIndicator />;
  }

  //Implement removal of deal once timer is up, removal of deal if redemption amt hits 0
  return (
    <View style={[styles.detailsContainer]}>
    <View style={{alignItems: 'flex-end'}}>
    <Text style={styles.Heading}>{JSON.stringify(name).replace(/"/g,"")}</Text>
    <Text style={styles.textBooking}>Payment using Card ending in {JSON.stringify(lastFourDigits).replace(/"/g,"")}</Text>
    <Text style={styles.textBooking}>Chosen Date: {Moment(date).format('DD MMM YYYY')}</Text>
    <Text style={styles.textBooking}>Chosen Time: {JSON.stringify(time).replace(/"/g,"")}</Text>
    <Text style={styles.textBooking}>Group Size: {JSON.stringify(groupSize).replace(/"/g,"")}</Text>
    </View>
    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
    <TouchableOpacity
      style={styles.buttonDeal}
      onPress={() => setShouldShow(!shouldShow)}>
      <Text style={styles.buttonTitle}>Redeem a Deal</Text>
    </TouchableOpacity>
    </View>
      {shouldShow ? (
          <FlatList
          data={redeemableDeals}
          extraData={redeemableDeals}
          renderItem={({ item }) => (
              <TouchableHighlight
              underlayColor="#C8c9c9"
              onPress={() => paymentCalculation(price, item.discount)}>
              <View style={styles.list}>
              <Text>{item.discount}% OFF</Text>
              <Text>Expires {Moment(item.expiry.toDate()).fromNow()}</Text>
              </View>
              </TouchableHighlight>
        )}
      />
      ) : null}
    <Text style={[styles.price, {fontSize:21}]}>Price: ${price}</Text>
    <Text style={[styles.price, {fontSize:21}]}>Price x {groupSize}: ${(price * groupSize)}</Text>
    <Text style={[styles.price, {fontSize:21}]}>Discount from Deal: ${selectedDiscount}</Text>
    <Text style={styles.price}>Final Price: ${currentPrice}</Text>
    <TouchableOpacity
      style={styles.button}
      onPress={() => onPaymentPress()}>
      <Text style={styles.buttonTitle}>Complete Booking</Text>
    </TouchableOpacity>
    </View>
  )
};