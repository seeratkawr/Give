import { useState, useEffect } from "react";

export default function PollBox({ postId, initialOptions, refreshPosts }) {
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [currentOptions, setCurrentOptions] = useState(initialOptions);

  // Update current options when initialOptions change (from refreshPosts)
  useEffect(() => {
    setCurrentOptions(initialOptions);
  }, [initialOptions]);

  const totalVotes = currentOptions.reduce(
    (sum, opt) => sum + (opt.votes || 0),
    0
  );

  const getPercentage = (optionVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((optionVotes / totalVotes) * 100);
  };

  const handleVote = async (optionIndex) => {
    if (hasVoted || voting) return;

    setVoting(true);
    console.log(`Voting for option ${optionIndex} on post ${postId}`);

    try {
      const res = await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex }),
      });

      console.log("Vote response status:", res.status);

      if (!res.ok) {
        const data = await res.json();
        console.error("Vote error:", data);
        throw new Error(data.error || "Failed to vote");
      }

      console.log("Vote successful, refreshing posts...");

      // First refresh the posts to get updated data
      if (refreshPosts) {
        await refreshPosts();
      }

      // Then set hasVoted to true to show results
      setHasVoted(true);
    } catch (err) {
      console.error("Vote failed:", err);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {!hasVoted && !voting && (
        <div className="text-xs text-gray-600 mb-1">Click to vote</div>
      )}

      {currentOptions.map((option, index) => {
        const percentage = getPercentage(option.votes || 0);

        return (
          <div
            key={index}
            role="button"
            tabIndex={0}
            className={`relative bg-pollBarGrey rounded-[0.6rem] ${
              !hasVoted && !voting
                ? "hover:bg-pollBarHover cursor-pointer"
                : "cursor-default"
            }`}
            onClick={() => !hasVoted && !voting && handleVote(index)}
            onKeyDown={(e) => {
              if (
                (e.key === "Enter" || e.key === " ") &&
                !hasVoted &&
                !voting
              ) {
                e.preventDefault(); // Prevent scrolling for Space
                handleVote(index);
              }
            }}
          >
            {/* Progress bar - show after voting */}
            {hasVoted && (
              <span
                className="absolute top-0 left-0 h-full transition-all duration-500 bg-defaultYellow rounded-[0.6rem]"
                style={{ width: `${percentage}%` }}
              />
            )}

            <div className="relative font-normal text-black text-[0.8rem] leading-[3.1] px-4 py-2 rounded-[0.6rem] flex justify-between items-center">
              <span>{option.label}</span>

              {/* Show vote count and percentage after voting */}
              {hasVoted && (
                <div className="flex items-center gap-2 text-xs">
                  <span>{option.votes || 0} votes</span>
                  <span className="font-semibold">{percentage}%</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {hasVoted && (
        <div className="text-xs text-gray-500 mt-1">
          Total votes: {totalVotes}
        </div>
      )}

      {voting && (
        <div className="text-xs text-blue-500">Submitting vote...</div>
      )}
    </div>
  );
}
