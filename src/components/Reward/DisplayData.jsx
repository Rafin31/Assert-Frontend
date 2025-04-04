import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext"; // Adjust the import path as needed
import { useNavigate } from "react-router-dom";

const DisplayData = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate(); // Redirect to login page
  const [formData, setFormData] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set()); // Track liked posts by the user

  // Fetch form data from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/v1/form")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Filter only approved posts
          const approvedPosts = data.data.filter((form) => form.status === "approved");
          setFormData(approvedPosts);

          // Check if the user has already liked any posts
          const likedSet = new Set(
            approvedPosts
              .filter((form) => form.likedBy?.includes(user?.userName)) // Check if the username exists in likedBy array
              .map((form) => form._id)
          );
          setLikedPosts(likedSet);
        } else {
          console.error("Failed to fetch data:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching form data:", error));
  }, [user]);

  // Handle reply submission
  const addReply = async (formId) => {
    if (!replyText[formId]) return; // Prevent empty replies

    // Make sure the user is logged in before proceeding
    if (!user) {
      navigate("/login"); // Redirect to login page
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/v1/form/${formId}/reply`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reply: replyText[formId],
          username: user.userName, // Send the logged-in username
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("✅ Reply added:", result.data);
        setFormData((prevData) =>
          prevData.map((form) =>
            form._id === formId ? { ...form, replies: result.data.replies } : form
          )
        );
        setReplyText((prev) => ({ ...prev, [formId]: "" }));
      } else {
        console.error("❌ Error adding reply:", result.message);
      }
    } catch (error) {
      console.error("❌ Error adding reply:", error);
    }
  };

  // Handle like button click
  const handleLike = async (formId) => {
    if (!user) {
      navigate("/login"); // Redirect to login page
      return;
    }

    if (likedPosts.has(formId)) {
      console.warn("❌ You have already liked this post!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/v1/form/${formId}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user.userName }), // Send username
      });

      const result = await response.json();

      if (result.success) {
        console.log("👍 Like added:", result.data);
        setFormData((prevData) =>
          prevData.map((form) =>
            form._id === formId ? { ...form, likeCount: result.data.likeCount } : form
          )
        );
        setLikedPosts((prev) => new Set([...prev, formId])); // Add to liked posts
      } else {
        console.error("❌ Error adding like:", result.message);
      }
    } catch (error) {
      console.error("❌ Error adding like:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Approved Queries</h2>

      {/* Display logged-in user's username */}
      {user ? (
        <p className="text-xl mb-4">Logged in as: {user.userName}</p>
      ) : (
        <p className="text-xl mb-4">You are not logged in.</p>
      )}

      {formData.length === 0 ? (
        <p className="text-gray-500">No approved posts available</p>
      ) : (
        formData.map((form) => (
          <div key={form._id} className="border p-4 mb-4 rounded shadow">
            <p className="text-gray-600">Realm: {form.realm}</p>
            <p className="text-gray-600">Type: {form.type}</p>
            <p className="text-gray-600">Posted by: {form.username}</p>
            <p className="text-gray-600">
              {new Date(form.timestamp).toLocaleString()}
            </p>
            <h3 className="text-xl font-semibold">{form.question}</h3>
            <h4 className="text-gray-500">{form.moreDetails}</h4>
            <p className="text-gray-600">Likes: {form.likeCount}</p>
            <p className="text-gray-600">Status: {form.realm}</p>
            {/* Like Button */}
            <button
              onClick={() => handleLike(form._id)}
              className={`mt-2 px-4 py-2 rounded ${
                likedPosts.has(form._id) ? "bg-gray-500" : "bg-blue-500"
              } text-white hover:bg-blue-700`}
              disabled={likedPosts.has(form._id)}
            >
              {likedPosts.has(form._id) ? "Liked" : "Like"}
            </button>

            {/* Replies Section */}
            <div className="mt-4">
              <h4 className="font-semibold">Replies:</h4>
              {form.replies.length > 0 ? (
                <ul className="list-disc list-inside">
                  {form.replies.map((reply, index) => (
                    <li key={index} className="text-gray-700">
                      <strong>{reply.username}:</strong> {reply.reply} <br />
                      <span className="text-xs text-gray-500">
                        {new Date(reply.timestamp).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No replies yet</p>
              )}
            </div>

            {/* Reply Form */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText[form._id] || ""}
                onChange={(e) =>
                  setReplyText((prev) => ({ ...prev, [form._id]: e.target.value }))
                }
                className="border rounded p-2 w-full"
              />
              <button
                onClick={() => addReply(form._id)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Reply
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DisplayData;
