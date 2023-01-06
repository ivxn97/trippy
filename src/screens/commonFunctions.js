import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../../config';
import React, { useState } from 'react';
import { TextInput } from 'react-native';

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
        redeemedDeals: arrayUnion(name)
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

export const FilteredTextInput = ({ onChangeText, ...props }) => {
    const [value, setValue] = useState('');
    const filteredWords = ['bad', 'evil', 'naughty'];
  
    const handleChange = (text) => {
      // Replace filtered words with an empty string
      text = filteredWords.reduce((acc, word) => acc.replace(word, ''), text);
      setValue(text);
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
  