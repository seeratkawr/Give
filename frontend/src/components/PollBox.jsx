import { useState } from "react";

export default function PollBox({ postId, initialOptions, refreshPosts }) {
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);

  const totalVotes = initialOptions.reduce(
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

    try {
      const res = await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to vote");
      }

      setHasVoted(true);

      // Refresh posts to get updated vote counts
      if (refreshPosts) await refreshPosts();
    } catch (err) {
      console.error(err);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-1 cursor-pointer">
      {initialOptions.map((option, index) => {
        const percentage = getPercentage(option.votes || 0);

        return (
          <div
            key={index}
            className={`relative bg-pollBarGrey cursor-pointer rounded-[0.6rem] ${
              !hasVoted ? "hover:bg-pollBarHover" : ""
            }`}
            onClick={() => handleVote(index)}
          >
            <span
              className="absolute top-0 left-0 h-full transition-all duration-500 bg-defaultYellow z-1 rounded-[0.6rem]"
              style={{ width: hasVoted ? `${percentage}%` : "0%" }}
            />
            <div className="relative font-normal text-black text-[0.8rem] z-2 leading-[3.1] px-8 py-0 cursor-pointer rounded-[0.6rem] flex justify-between items-center p-2">
              <span>{option.label}</span>
              {percentage > 0 && <span>{percentage}%</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
