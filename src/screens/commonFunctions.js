import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../../config';
import React, { useState } from 'react';
import { TextInput } from 'react-native';

var filter = require('leo-profanity');
//document = email of logged in user
//name = activity name
export async function bookmark(document, name ) {
    const ref = doc(db, "users", document);

    await updateDoc (ref, {
        bookmarks: arrayUnion(name)
    })
    alert(`${name} Added to bookmark`)
    console.log(`${name} Added to bookmark`)
}

export async function itinerary(document, name ) {
    const ref = doc(db, "users", document);

    await updateDoc (ref, {
        itinerary: arrayUnion(name)
    })
    alert(`${name} Added to itinerary`)
    console.log(`${name} Added to itinerary`)
}

export async function claimDeals(document, name ) {
    const ref = doc(db, "users", document);

    await updateDoc (ref, {
        claimedDeals: arrayUnion(name)
    })
    console.log(`${name} Deal Redeemed`)
}


export async function sortFiles(array, property, order) {
    return array.sort((a, b) => {
        if (order === 'asc') {
            return a[property].toLowerCase().localeCompare(b[property].toLowerCase(), undefined, { numeric: true, sensitivity: 'base' });
        } else {
            return b[property].toLowerCase().localeCompare(a[property].toLowerCase(), undefined, { numeric: true, sensitivity: 'base' });
        }
    });
}

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
  

export async function PageContent(document, name) {
    const ref = doc(db, "users", document);

    await updateDoc(ref, {
        itinerary: arrayUnion(name)
    })
    alert(`${name} Added to Page Content`)
    console.log(`${name} Added to Page Content`)
}