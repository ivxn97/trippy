import React, { useEffect, useState } from "react";
import {  View, ActivityIndicator, Text, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
//import styles from './styles';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import Carousel from 'react-native-reanimated-carousel';
import * as WebBrowser from 'expo-web-browser';
import {bookmark, itinerary} from '../commonFunctions';
import ReviewScreen from '../ReviewScreen/ReviewScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form'
import LottieView from 'lottie-react-native'
import CreditCardForm, { Button } from 'rn-credit-card'

//Check capacity for paid tour has reached
//Check to ensure date and time matches operating hours
//Check Process payment
// Have deals redemption ability


export default function Payment ({route, navigation}) {
  const {time, date, groupSize, name, email, price} = route.params;

  const formMethods = useForm({
    mode: 'onBlur',
    defaultValues: {
    holderName: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
  },})

  const { handleSubmit, formState } = formMethods

  function onSubmit(model) {
    const lastFourDigits = model.cardNumber.slice(-4)
    console.log(lastFourDigits)
    navigation.navigate('Confirm Booking', { time: time, date: date, groupSize: groupSize, 
      name: name, email: email, price: price, lastFourDigits: lastFourDigits})
  }

return (
  <FormProvider {...formMethods}>
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.avoider}
        behavior={'padding'}
      >
        <CreditCardForm
          LottieView={LottieView}
          horizontalStart
          overrides={{
            labelText: {
              marginTop: 16,
            },
          }}
        />
      </KeyboardAvoidingView>
      {formState.isValid && (
        <Button
          style={styles.button}
          title={'Confirm Payment'}
          onPress={handleSubmit(onSubmit)}
          //onPress={() => navigation.navigate('Confirm Booking', { time: time, date: date, groupSize: groupSize, 
           // name: name, email: email, price: price})}
        />
      )}
    </SafeAreaView>
  </FormProvider>
)
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avoider: {
    flex: 1,
    padding: 36,
  },
  button: {
    margin: 36,
    marginTop: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: '#8f8f8f',
  },
  })