import {  View, Text } from "react-native";
import styles from './styles';
import Moment from 'moment';

export default function PreviousBookingDetails ({route, navigation}) {
  const { date, orgPrice, discount, finalPrice, groupSize, id, name, time, email } = route.params;

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
    <Text style={[styles.price, {fontSize:21}]}>Price x {groupSize}: ${orgPrice}</Text>
    <Text style={[styles.price, {fontSize:21}]}>Discount from Deal: ${discount}</Text>
    <Text style={styles.price}>Final Price: ${finalPrice}</Text>
    </View>
  )
};