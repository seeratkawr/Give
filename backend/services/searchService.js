import { db } from "../firebase/firebase.js"; // this is admin.firestore()

export async function searchFirestore(searchQuery) {
  if (!searchQuery.trim()) return [];

  const allResults = [];
  const normalizedQuery = searchQuery.toLowerCase();

  // 1. Groups
  const groupSnap = await db
    .collection("groups")
    .where("name_lowercase", ">=", normalizedQuery)
    .where("name_lowercase", "<=", normalizedQuery + "\uf8ff")
    .get();

  groupSnap.forEach((doc) =>
    allResults.push({ id: doc.id, ...doc.data(), type: "groups" })
  );

  // 2. Posts (by content)
  const postsSnap = await db
    .collection("posts")
    .where("content_lowercase", ">=", normalizedQuery)
    .where("content_lowercase", "<=", normalizedQuery + "\uf8ff")
    .get();

  postsSnap.forEach((doc) =>
    allResults.push({ id: doc.id, ...doc.data(), type: "posts" })
  );

  // 3. Posts (by tags)
  const postsTagSnap = await db
    .collection("posts")
    .where("tags_lowercase", ">=", normalizedQuery)
    .where("tags_lowercase", "<=", normalizedQuery + "\uf8ff")
    .get();

  postsTagSnap.forEach((doc) =>
    allResults.push({ id: doc.id, ...doc.data(), type: "posts" })
  );

  // 4. Users
  const usersSnap = await db
    .collection("users")
    .where("fullName_lowercase", ">=", normalizedQuery)
    .where("fullName_lowercase", "<=", normalizedQuery + "\uf8ff")
    .get();

  usersSnap.forEach((doc) =>
    allResults.push({ id: doc.id, ...doc.data(), type: "users" })
  );

  return allResults;
}
