import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../../config';

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
            return a[property] > b[property] ? 1 : -1;
        } else {
            return a[property] < b[property] ? 1 : -1;
        }
    });
}
