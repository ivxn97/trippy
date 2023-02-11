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
import moment from "moment";

export default function ConfirmBooking ({route, navigation}) {
  const {time, date, groupSize, name, email, price, lastFourDigits, roomType, activityType, 
    checkInTime, checkOutTime, startDate, endDate} = route.params;
  const id = uuid.v4();
  const [loading, setLoading] = useState(true)
  const [claimedDeals, setClaimedDeals] = useState();
  const [dealInfo, setDealInfo] = useState([]);
  const [redeemableDeals, setRedeemableDeals] = useState([]);
  const [shouldRun, setShouldRun] = useState(true);
  const [shouldShow, setShouldShow] = useState(false)
  const [currentPrice, setCurrentPrice] = useState((price * groupSize))
  const [HcurrentPrice, setHCurrentPrice] = useState()
  const [selectedDiscount, setSelectedDiscount] = useState(0)
  const [dealName, setDealName] = useState()
  const [dealQuantity, setDealQuantity] = useState()
  const [difference, setDifference] = useState()

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

  const DealCount = async () => {
    try {
      await setDoc(doc(db, "deals", dealName), {
        quantity: dealQuantity
      }, {merge:true})
    }
    catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (shouldRun) {
      getClaimedDeals();
      if (activityType == "hotels") {
        const diff = moment(endDate).startOf('day').diff(moment(startDate).startOf('day'), 'days')
        console.log(diff)
        setDifference(diff)
        setHCurrentPrice(price * diff)
      }
      if (claimedDeals) {
        getDealInfo();
      }
    }
  },[claimedDeals])

  const onPTPaymentPress = async () => {
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
        date: date,
        expired: false,
        activityType: activityType
      })
      alert("Booking Successful!")
      DealCount();
      navigation.navigate('Home Page')
    }
    catch (e) {
      console.log("Error adding document: ", e);
    }
  }

  const onATPaymentPress = async () => {
    try {
      await setDoc(doc(db, "bookings", id), {
        id: id,
        bookedBy: email,
        name: name,
        orgPrice: (price * groupSize),
        discount: selectedDiscount,
        finalPrice: currentPrice,
        groupSize: groupSize,
        date: date,
        expired: false,
        activityType: activityType
      })
      alert("Booking Successful!")
      DealCount();
      navigation.navigate('Home Page')
    }
    catch (e) {
      console.log("Error adding document: ", e);
    }
  }

  const onRPaymentPress = async () => {
    try {
      await setDoc(doc(db, "bookings", id), {
        id: id,
        bookedBy: email,
        name: name,
        groupSize: groupSize,
        date: date,
        expired: false,
        activityType: activityType,
        time: time
      })
      alert("Booking Successful!")
      DealCount();
      navigation.navigate('Home Page')
    }
    catch (e) {
      console.log("Error adding document: ", e);
    }
  }

  const onHotelPaymentPress = async () => {
    try {
      await setDoc(doc(db, "bookings", id), {
        id: id,
        bookedBy: email,
        name: name,
        orgPrice: (price * difference),
        discount: selectedDiscount,
        finalPrice: HcurrentPrice,
        time: time,
        roomType: roomType,
        startDate: startDate,
        endDate: endDate,
        expired: false,
        activityType: activityType
      })
      alert("Booking Successful!")
      DealCount();
      navigation.navigate('Home Page')
    }
    catch (e) {
      console.log("Error adding document: ", e);
    }
  }

  const paymentCalculation = (price, discount, dealName, quantity) => {
    setDealName(dealName)
    console.log("Deal Q: ", quantity-1)
    setDealQuantity(quantity-1)
    setSelectedDiscount(((price * groupSize) * (discount/100)))
    const finalPrice = (price * groupSize) - ((price * groupSize) * (discount/100))
    setCurrentPrice(finalPrice)
    setShouldShow(!shouldShow);
  }

  const HpaymentCalculation = (price, discount, dealName, quantity) => {
    setDealName(dealName)
    console.log("Deal Q: ", quantity-1)
    setDealQuantity(quantity-1)
    setSelectedDiscount(((price * difference) * (discount/100)))
    const finalPrice = (price * difference) - ((price * difference) * (discount/100))
    setHCurrentPrice(finalPrice)
    setShouldShow(!shouldShow);
  }

  if (loading) {
    return <ActivityIndicator />;
  }

  if (activityType == "paidtours") {
    return (
      <View style={[styles.detailsContainer]}>
      <View style={{alignItems: 'flex-end'}}>
      <Text style={styles.Heading}>Booking For {JSON.stringify(name).replace(/"/g,"")}</Text>
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
                onPress={() => paymentCalculation(price, item.discount, item.dealname, item.quantity)}>
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
        onPress={() => onPTPaymentPress()}>
        <Text style={styles.buttonTitle}>Complete Booking</Text>
      </TouchableOpacity>
      </View>
    )
  }
  else if (activityType == "hotels") {
    return (
      <View style={[styles.detailsContainer]}>
      <View style={{alignItems: 'flex-end'}}>
      <Text style={styles.Heading}>Booking For {JSON.stringify(name).replace(/"/g,"")}</Text>
      <Text style={styles.textBooking}>Room Type: {JSON.stringify(roomType).replace(/"/g,"")}</Text>
      <Text style={styles.textBooking}>Payment using Card ending in {JSON.stringify(lastFourDigits).replace(/"/g,"")}</Text>
      <Text style={styles.textBooking}>Check In Date: {Moment(startDate).format('DD MMM YYYY')}</Text>
      <Text style={styles.textBooking}>Check Out Date: {Moment(endDate).format('DD MMM YYYY')}</Text>
      <Text style={styles.textBooking}>Check In Time: {JSON.stringify(checkInTime).replace(/"/g,"")}</Text>
      <Text style={styles.textBooking}>Check Out Time: {JSON.stringify(checkOutTime).replace(/"/g,"")}</Text>
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
                onPress={() => HpaymentCalculation(price, item.discount, item.dealname, item.quantity)}>
                <View style={styles.list}>
                <Text>{item.discount}% OFF</Text>
                <Text>Expires {Moment(item.expiry.toDate()).fromNow()}</Text>
                </View>
                </TouchableHighlight>
          )}
        />
        ) : null}
      <Text style={[styles.price, {fontSize:21}]}>Price: ${price}</Text>
      <Text style={[styles.price, {fontSize:21}]}>Price X {difference} Days: ${price * difference}</Text>
      <Text style={[styles.price, {fontSize:21}]}>Discount from Deal: ${selectedDiscount}</Text>
      <Text style={styles.price}>Final Price: ${HcurrentPrice}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onHotelPaymentPress()}>
        <Text style={styles.buttonTitle}>Complete Booking</Text>
      </TouchableOpacity>
      </View>
    )
  }
  else if (activityType == "attractions") {
    return (
      <View style={[styles.detailsContainer]}>
      <View style={{alignItems: 'flex-end'}}>
      <Text style={styles.Heading}>Booking For {JSON.stringify(name).replace(/"/g,"")}</Text>
      <Text style={styles.textBooking}>Payment using Card ending in {JSON.stringify(lastFourDigits).replace(/"/g,"")}</Text>
      <Text style={styles.textBooking}>Chosen Date: {Moment(date).format('DD MMM YYYY')}</Text>
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
                onPress={() => paymentCalculation(price, item.discount, item.dealname, item.quantity)}>
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
        onPress={() => onATPaymentPress()}>
        <Text style={styles.buttonTitle}>Complete Booking</Text>
      </TouchableOpacity>
      </View>
    )
  }
  else if (activityType == "restaurants") {
    return (
      <View style={[styles.detailsContainer]}>
      <View style={{alignItems: 'flex-end'}}>
      <Text style={styles.Heading}>Booking For {JSON.stringify(name).replace(/"/g,"")}</Text>
      <Text style={styles.textBooking}>Chosen Date: {Moment(date).format('DD MMM YYYY')}</Text>
      <Text style={styles.textBooking}>Chosen Time: {JSON.stringify(time).replace(/"/g,"")}</Text>
      <Text style={styles.textBooking}>Group Size: {JSON.stringify(groupSize).replace(/"/g,"")}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onRPaymentPress()}>
        <Text style={styles.buttonTitle}>Complete Booking</Text>
      </TouchableOpacity>
      </View>
    )
  }
};