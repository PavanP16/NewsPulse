import { Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import { toast } from "sonner";

const Form = ({ contractInstance }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !content) {
      toast.info("Please fill all the fields", {
        position: "bottom-right",
      });
      return;
    }

    if (title.length < 5) {
      toast.info("Title must be atleast 5 characters long", {
        position: "bottom-right",
      });
      return;
    }

    if (content.length < 10) {
      toast.info("Content must be atleast 10 characters long", {
        position: "bottom-right",
      });
      return;
    }

    if (contractInstance) {
      const promise = new Promise(async (resolve, reject) => {
        try {
          const res = await contractInstance.postSomething(title, content);
          await res.wait();
          resolve("Post created successfully");
        } catch (error) {
          if (error.message.includes("Insufficient tokens to post")) {
            reject("Insufficient tokens to post");
          }
          reject("Error in creating post");
        }
      });

      toast.promise(promise, {
        loading: "Creating post...",
        success: (data) => {
          return `${data}`;
        },
        error: (data) => {
          return `${data}`;
        },
      });

      promise.then((data) => {
        console.log(data);
        setTitle("");
        setContent("");
      });
    }
  };

  return (
    <div className="w-[50%] mx-auto mt-20 h-[60vh] p-4 bg-white rounded-lg shadow-2xl">
      <h2 className="text-2xl font-semibold mb-4">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="mb-4 w-full">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleChangeTitle}
            placeholder="Enter a title"
            className="w-full px-3 py-2 border-2 rounded-lg text-gray-700 focus:outline-none focus:border-gray-600"
          />
        </div>

        <div className="mb-4 w-full">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={content}
            onChange={handleChangeContent}
            placeholder="Enter a description"
            rows="10"
            className="w-full px-3 py-2 border-2 rounded-lg text-gray-700 focus:outline-none focus:border-gray-600 resize-none"
          />
        </div>

        <button
          type="submit"
          class={` items-center justify-center w-[10vw] ${
            false ? "bg-gray-400" : "bg-gray-800 hover:bg-gray-950"
          } text-white font-semibold py-2 rounded-lg focus:outline-none`}
          disabled={false}
        >
          {false && <Spinner className="w-4 h-4" />}
          <span> </span>
          Post
        </button>
      </form>
    </div>
  );
};

export default Form;
