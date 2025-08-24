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
    const { optionIndex, userId } = req.body;

    console.log("Vote request received:", { postId, optionIndex, userId });

    if (typeof optionIndex !== "number")
      return res.status(400).json({ error: "optionIndex is required" });

    if (!userId) return res.status(400).json({ error: "userId is required" });

    const postRef = db.collection("posts").doc(postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists)
      return res.status(404).json({ error: "Post not found" });

    const postData = postSnap.data();
    console.log("Current post data:", JSON.stringify(postData, null, 2));

    if (!Array.isArray(postData.polls) || !postData.polls[optionIndex])
      return res.status(400).json({ error: "Invalid poll option" });

    // Handle posts without voters array (legacy posts)
    const voters = postData.voters || [];
    console.log("Current voters:", voters);
    console.log("User trying to vote:", userId);

    if (voters.includes(userId)) {
      console.log("User has already voted!");
      return res
        .status(400)
        .json({ error: "You have already voted on this poll" });
    }

    // Update polls and add voter
    const updatedPolls = [...postData.polls];
    updatedPolls[optionIndex] = {
      ...updatedPolls[optionIndex],
      votes: (updatedPolls[optionIndex].votes || 0) + 1,
    };

    const updatedVoters = [...voters, userId];

    console.log("Updated polls:", JSON.stringify(updatedPolls, null, 2));
    console.log("Updated voters:", updatedVoters);

    // Update the post with both polls and voters
    const updateData = {
      polls: updatedPolls,
      voters: updatedVoters,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // If voters field didn't exist before, this will create it
    await postRef.update(updateData);

    console.log("Vote update successful");
    res.json({ success: true });
  } catch (err) {
    console.error("Vote error:", err);
    res.status(500).json({ error: "Failed to vote" });
  }
};
