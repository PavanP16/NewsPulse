import React, { useState, useEffect } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { toast } from "sonner";

const Vote = ({ contractInstance, id, blogPost, currentAccount }) => {
  const [score, setScore] = useState(0); // Initial score
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  const getisVoted = () => {
    if (blogPost) {
      const a = blogPost.likedUsers.filter((users) => currentAccount === users);
      console.log(a);
      if (a[0] === currentAccount) {
        setUpvoted(true);
      } else {
        setUpvoted(false);
      }

      const b = blogPost.dislikedUsers.filter(
        (users) => currentAccount === users
      );
      console.log(b);
      if (b[0] === currentAccount) {
        setDownvoted(true);
      } else {
        setDownvoted(false);
      }
    }
  };

  const fetchLikes = async () => {
    try {
      const sc = blogPost.likesCnt.toNumber() - blogPost.dislikesCnt.toNumber();
      console.log(sc);
      setScore(sc);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (contractInstance && currentAccount) {
      fetchLikes();
      getisVoted();
    }
  }, [
    currentAccount,
    contractInstance,
    blogPost.likesCnt,
    blogPost.dislikesCnt,
  ]);

  const handleUpvote = async () => {

    if (upvoted) {
      toast.warning("Already liked the post", {
        position: "bottom-right",
      });
      return;
    }
    
    if (currentAccount) {
      const promise = new Promise(async (resolve, reject) => {
        try {
          const liked = await contractInstance.likePost(id);
          await liked.wait();
          resolve("Liked the post");
          if (downvoted) {
            setUpvoted(true);
            setScore(score + 2);
            setDownvoted(false);
          } else {
            setUpvoted(true);
            setScore(score + 1);
          }
        } catch (error) {
          console.error(error);
          if (error.message.includes("You cannot like your own post")) {
            reject("You cannot like your own post");
          } else if (
            error.message.includes(" Insufficient tokens to like the post")
          ) {
            reject("Insufficient tokens to like the post");
          } else {
            reject(
              "Something wrong has happened, please check your connection and try again."
            );
          }
        }
      });

      toast.promise(promise, {
        loading: "Liking the post..",
        success: (data) => {
          return `${data}`;
        },
        error: (data) => {
          return `${data}`;
        },
      });
    }
  };

  const handleDownvote = async () => {
    if (downvoted) {
      toast.warning("Already disliked the post", {
        position: "bottom-right",
      });
      return;
    }
    if (currentAccount) {
      const promise = new Promise(async (resolve, reject) => {
        try {
          const disliked = await contractInstance.dislikePost(id);
          await disliked.wait();
          resolve("Disiked the post");
          if (upvoted) {
            setUpvoted(false);
            setDownvoted(true);
            setScore(score - 2);
          } else {
            setDownvoted(true);
            setScore(score - 1);
          }
        } catch (error) {
          console.error(error);
          if (error.message.includes("You cannot dislike your own post")) {
            reject("You cannot dislike your own post");
          } else if (
            error.message.includes("Insufficient tokens to dislike the post")
          ) {
            reject("Insufficient tokens to dislike the post");
          } else {
            reject(
              "Something wrong has happened, please check your connection and try again."
            );
          }
        }
      });

      toast.promise(promise, {
        loading: "Disliking the post...",
        success: (data) => {
          return `${data}`;
        },
        error: (data) => {
          return `${data}`;
        },
      });
    }
  };

  const upvoteColor = upvoted
    ? "fill-emerald-500 text-emerald-500"
    : "text-zinc-700";
  const downvoteColor = downvoted
    ? "fill-red-500 text-red-500 "
    : "text-zinc-700";

  return (
    <div className="flex flex-col gap-4 pr-6 pb-4">
      {/* upvote */}
      <button onClick={handleUpvote}>
        <ArrowBigUp className={`h-5 w-5 ${upvoteColor}`} />
      </button>

      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {score}
      </p>

      {/* downvote */}
      <button onClick={handleDownvote} className={downvoteColor}>
        <ArrowBigDown className={`h-5 w-5 ${downvoteColor}`} />
      </button>
    </div>
  );
};

export default Vote;
