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


export default function Booking ({route, navigation}) {
  const {activityType, name} = route.params;
  const [email, setEmail] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateTimePickerVisible, setDateTimePickerVisiblity] = useState(false);

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
    Alert.alert('Success: ' + JSON.stringify(model, null, 2))
  }

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

return (
  <FormProvider {...formMethods}>
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.avoider}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          title={'CONFIRM PAYMENT'}
          onPress={handleSubmit(onSubmit)}
        />
      )}
    </SafeAreaView>
  </FormProvider>
)

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
  },
  })