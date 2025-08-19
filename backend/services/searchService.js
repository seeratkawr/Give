import {
  collection,
  query,
  orderBy,
  startAt,
  endAt,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase.js";

export async function searchFirestore(searchQuery) {
  if (!searchQuery.trim()) return [];

  const collections = [
    { name: "groups", field: "name" },
    { name: "posts", field: "content" },
    //{ name: "users", field: "name" },
  ];

  let allResults = [];

  for (const col of collections) {
    const colRef = collection(db, col.name);
    const q = query(
      colRef,
      orderBy(col.field),
      startAt(searchQuery),
      endAt(searchQuery + "\uf8ff")
    );

    const snapshot = await getDocs(q);
    const results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      type: col.name,
    }));

    allResults = [...allResults, ...results];
  }

  return allResults;
}
