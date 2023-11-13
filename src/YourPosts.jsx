import React, { useEffect, useState } from "react";
import InfoStats from "./components/InfoStats";

const Post = ({ currentAccount, contractInstance }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchBlogs = async () => {
      try {
        const array = await contractInstance.getBlogs();
        if (array) {
          setBlogs(array);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [contractInstance, currentAccount]);

  const authorBlogs = blogs.filter((blog) => {
    return blog.author === currentAccount;
  });

  return (
    <div className="w-[60%] m-auto flex flex-col gap-8">
      <h1 className="font-bold text-3xl mt-6">Your Posts</h1>
      {!(authorBlogs.length === 0) ?( authorBlogs
        .map((post, index) => (
          <div className="rounded-md bg-white shadow-lg" key={post.id}>
            {console.log("Hello", post)}
            <div className="px-6 py-4 flex justify-between">
              <div className="w-0 flex-1">
                {loading ? (
                  <p>Loading......</p>
                ) : (
                  <>
                    <div className="flex justify-between max-h-40 mt-1 text-xs text-gray-500">
                      <span className="font-semibold text-lg text-gray-900">
                        {index + 1}.
                      </span>
                      <p>{post.creationTime.toNumber()}</p>
                    </div>
                    <p>
                      <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
                        {post.title}
                      </h1>
                    </p>
                    <div className="relative text-sm max-h-40 w-full overflow-clip">
                      {post.content}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6">
              <InfoStats
                contractInstance={contractInstance}
                id={post.id}
                blogPost={blogs[post.id]}
                currentAccount={currentAccount}
              />
            </div>
          </div>
        ))) : (<div className="mt-[25%] text-center text-2xl">No Posts yet</div>) }
    </div>
  );
};

export default Post;
