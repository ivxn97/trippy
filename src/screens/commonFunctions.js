import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";
import { db } from '../../config';
import React, { useState } from 'react';
import { TextInput } from 'react-native';

var filter = require('leo-profanity');  // Profanity Filter
//document = email of logged in user
//name = activity name

// Handles Adding a Bookmark
export async function bookmark(document, name ) {
    const ref = doc(db, "users", document);

    await updateDoc (ref, {
        bookmarks: arrayUnion(name)
    })
    alert(`${name} Added to bookmark`)
    console.log(`${name} Added to bookmark`)
}

// Handles Adding to Itinerary
export async function itinerary(document, name ) {
    const ref = doc(db, "users", document);
    let itineraryArr = []
    const docSnap = await  getDoc(ref)
    if (docSnap.exists()) {
        itineraryArr = docSnap.data().itinerary
    }

    if (itineraryArr !== null && itineraryArr.length < 11) {
        await updateDoc (ref, {
            itinerary: arrayUnion(name)
        })
        alert(`${name} Added to itinerary`)
        console.log(`${name} Added to itinerary`)
    }
    else {
        alert("You can only have a maximum of 10 activities in the itinerary")
    }
}

// Handles claiming a deal
export async function claimDeals(document, name ) {
    const ref = doc(db, "users", document);

    await updateDoc (ref, {
        claimedDeals: arrayUnion(name)
    })
    console.log(`${name} Deal Redeemed`)
}

// Handles sort function by ascending or descending
export async function sortFiles(array, property, order) {
    return array.sort((a, b) => {
        if (order === 'desc') {
            return b[property].toLowerCase().localeCompare(a[property].toLowerCase(), undefined, { numeric: true, sensitivity: 'base' });
        } else {
            return a[property].toLowerCase().localeCompare(b[property].toLowerCase(), undefined, { numeric: true, sensitivity: 'base' }); 
        }
    });
}

// Custom <Text> Input that includes a profanity filter. Profanity is automatically removed. 
export const FilteredTextInput = ({ value, onChangeText, ...props }) => {
    const handleChange = (text) => {
      // Replace filtered words with an empty string
      text = filter.list().reduce((acc, word) => acc.replace(word, ''), text);
      if (onChangeText) {
        onChangeText(text);
      }
    };
    return (
      <TextInput
        {...props}
        value={value}
        onChangeText={handleChange}
      />
    );
  };
  
// Handles updating of FrontPage Content
export async function PageContent(document, name) {
    const ref = doc(db, "users", document);

    await updateDoc(ref, {
        itinerary: arrayUnion(name)
    })
    alert(`${name} Added to Page Content`)
    console.log(`${name} Added to Page Content`)
}

// Handles Reporting of an activity/ Forum Post/ Forum Reply
export async function report(activityType, addedBy, content, reportedBy, name) {
    const ref = doc(db, "reports", name);
        try {
        await setDoc (ref, {
            activityType: activityType,
            addedBy: addedBy,
            name: name,
            content: content,
            reportedBy: reportedBy
        })
        alert (`Report on ${content} sent.`)
    }
    catch (e) {
        console.log(e)
    }
}