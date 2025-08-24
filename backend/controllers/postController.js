const { db, admin } = require("../firebase/firebase");

exports.createPost = async (req, res) => {
  try {
    const {
      content,
      mediaUrls = [],
      tags = [],
      authorId,
      authorDisplayName,
      authorPhotoURL,
      polls = [],
    } = req.body;

    if (!content || !content.trim())
      return res.status(400).json({ error: "Content is required" });

    const post = {
      authorId,
      authorDisplayName,
      authorPhotoURL,
      content: content.trim(),
      mediaUrls,
      tags,
      polls: Array.isArray(polls)
        ? polls
            .slice(0, 4)
            .map((p) => ({ label: String(p.label || "").trim(), votes: 0 }))
            .filter((p) => p.label)
        : [],
      voters: [], // Initialize empty voters array
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const ref = await db.collection("posts").add(post);
    const snap = await ref.get();
    res.status(201).json({ id: ref.id, ...snap.data() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create post" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const limitCount = Number(req.query.limitCount ?? 10);
    const snap = await db
      .collection("posts")
      .orderBy("createdAt", "desc")
      .limit(limitCount)
      .get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

exports.votePoll = async (req, res) => {
  try {
    const { postId } = req.params;
    const { optionIndex } = req.body;

    console.log("Vote request received:", { postId, optionIndex });

    if (typeof optionIndex !== "number")
      return res.status(400).json({ error: "optionIndex is required" });

    const postRef = db.collection("posts").doc(postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists)
      return res.status(404).json({ error: "Post not found" });

    const postData = postSnap.data();
    console.log(
      "Post data before vote:",
      JSON.stringify(postData.polls, null, 2)
    );

    if (!Array.isArray(postData.polls) || !postData.polls[optionIndex])
      return res.status(400).json({ error: "Invalid poll option" });

    // Instead of using FieldValue.increment, let's update the entire polls array
    const updatedPolls = [...postData.polls];
    updatedPolls[optionIndex] = {
      ...updatedPolls[optionIndex],
      votes: (updatedPolls[optionIndex].votes || 0) + 1,
    };

    console.log("Updated polls array:", JSON.stringify(updatedPolls, null, 2));

    await postRef.update({
      polls: updatedPolls,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Vote update successful");

    // Get the updated post to verify
    const updatedSnap = await postRef.get();
    console.log(
      "Post data after vote:",
      JSON.stringify(updatedSnap.data().polls, null, 2)
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Vote error:", err);
    res.status(500).json({ error: "Failed to vote" });
  }
};
