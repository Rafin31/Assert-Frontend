import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext"; // Adjust the import path as needed
import { useNavigate } from "react-router-dom";
import ServerApi from '../../api/ServerAPI';

const DisplayBox = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate(); // Redirect to login page
  const [formData, setFormData] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set()); // Track liked posts by the user
  const [openModalPost, setOpenModalPost] = useState(null); // State to store the post for the modal
  const [filter, setFilter] = useState("all"); // State for type filter (all, debate, query)
  const [selectedRealm, setSelectedRealm] = useState("all"); // State for realm filter (all, Sports, Technology)

  // Fetch form data from the backend
  useEffect(() => {
    ServerApi.get("/form")
      .then((response) => {
        const data = response.data;
        if (data.success) {
          // Filter only approved posts
          const approvedPosts = data.data.filter((form) => form.status === "approved");

          // Apply filters based on the selected filter state and realm
          const filteredPosts = approvedPosts.filter((form) => {
            const isTypeMatch =
              filter === "all" || form.type.toLowerCase() === filter.toLowerCase();
            const isRealmMatch =
              selectedRealm === "all" || form.realm.toLowerCase() === selectedRealm.toLowerCase();
            return isTypeMatch && isRealmMatch;
          });

          setFormData(filteredPosts);

          // Check if the user has already liked any posts
          const likedSet = new Set(
            filteredPosts
              .filter((form) => form.likedBy?.includes(user?.userName)) // Check if the username exists in likedBy array
              .map((form) => form._id)
          );
          setLikedPosts(likedSet);
        } else {
          console.error("Failed to fetch data:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching form data:", error));
  }, [user, filter, selectedRealm]);


  // Handle reply submission
  const addReply = async (formId) => {
    const text = replyText[formId]?.trim();
    if (!text) return;

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const response = await ServerApi.put(`/form/${formId}/reply`, {
        reply: text,
        username: user.userName,
      });

      const result = response.data;

      if (result.success) {
        console.log("✅ Reply added:", result.data);

        setFormData((prevData) =>
          prevData.map((form) =>
            form._id === formId ? { ...form, replies: result.data.replies } : form
          )
        );

        if (openModalPost && openModalPost._id === formId) {
          setOpenModalPost((prevPost) => ({
            ...prevPost,
            replies: result.data.replies,
          }));
        }

        setReplyText((prev) => ({ ...prev, [formId]: "" }));
      } else {
        console.error("❌ Error adding reply:", result.message);
        // Optionally show a toast here
      }
    } catch (error) {
      console.error("❌ Error adding reply:", error);
      // Optionally show a toast here too
    }
  };



  // Handle like button click
  // Handle like toggle
  const handleLike = async (formId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const isLiked = likedPosts.has(formId);

    try {
      const response = await ServerApi.put(`/form/${formId}/like`, {
        username: user.userName,
      });

      const result = response.data;

      if (result.success) {
        setFormData((prevData) =>
          prevData.map((form) =>
            form._id === formId
              ? { ...form, likeCount: result.data.likeCount }
              : form
          )
        );

        if (isLiked) {
          setLikedPosts((prev) => {
            const newLikedPosts = new Set(prev);
            newLikedPosts.delete(formId);
            return newLikedPosts;
          });
        } else {
          setLikedPosts((prev) => new Set([...prev, formId]));
        }

        if (openModalPost && openModalPost._id === formId) {
          setOpenModalPost((prevPost) => ({
            ...prevPost,
            likeCount: result.data.likeCount,
          }));
        }
      } else {
        console.error("Error updating like:", result.message);
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };


  // Open Modal with post data
  const openModal = (post) => {
    setOpenModalPost(post); // Set the post to be displayed in the modal
  };

  // Close Modal
  const closeModal = () => {
    setOpenModalPost(null); // Close the modal
  };


  return (



    <div className="mx-auto rounded-lg overflow-hidden bg-base-50">

      {/* Filter Section */}
      <div className="flex flex-row">
        <div className="filter mb-4 pr-2">
          <input
            className="btn btn-sm filter-reset"
            type="radio"
            name="metaframeworks"
            aria-label="All"
            value="all"
            checked={filter === "all"}
            onChange={(e) => setFilter(e.target.value)}
          />
          <input
            className="btn btn-warning btn-sm"
            type="radio"
            name="metaframeworks"
            aria-label="Debate"
            value="debate"
            checked={filter === "debate"}
            onChange={(e) => setFilter(e.target.value)}
          />
          <input
            className="btn btn-warning btn-sm"
            type="radio"
            name="metaframeworks"
            aria-label="Query"
            value="query"
            checked={filter === "query"}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {/* Realm Filter Sidebar */}
        <div className="filter mb-4 ">
          <div>
            <button
              className="btn btn-sm mr-1"
              onClick={() => setSelectedRealm("all")}
            >
              All Realms
            </button>

            <button
              className="btn btn-sm mr-1"
              onClick={() => setSelectedRealm("sports")}
            >
              Sports
            </button>
            <button
              className="btn btn-sm mr-1"
              onClick={() => setSelectedRealm("technology")}
            >
              Technology
            </button>
          </div>
        </div>
      </div>

      <div>
        {formData.length === 0 ? (
          <p className="text-gray-500">No approved posts available</p>
        ) : (
          formData.map((form) => (
            <div key={form._id} className="p-4 mb-4 shadow-md rounded-lg bg-white hover:shadow-lg cursor-pointer" >
              <p className="text-gray-600 mb-2" onClick={() => openModal(form)}>{form.realm.charAt(0).toUpperCase() + form.realm.slice(1)} - {form.type.charAt(0).toUpperCase() + form.type.slice(1)}</p>
              {/* Post By */}
              <div className="text-sm text-gray-400 mt-2 mr-2" onClick={() => openModal(form)}>
                Posted by: <strong>{form.username}</strong> <span> - </span>
                {new Date(form.timestamp).toLocaleTimeString([], {
                  weekday: "long",    // e.g., "Monday"
                  year: "numeric",    // e.g., "2025"
                  month: "long",      // e.g., "April"
                  day: "numeric",     // e.g., "1"
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <h3
                className="text-xl font-semibold mb-2 cursor-pointer mt-2"
                onClick={() => openModal(form)} // Open the modal when title is clicked
              >
                {form.question}
              </h3>

              <p className="text-base text-gray-500 mb-3" onClick={() => openModal(form)}>{form.moreDetails}</p>

              <div className="flex items-center">
                <button
                  onClick={() => handleLike(form._id)}
                  className={`btn btn-sm mr-2 ${likedPosts.has(form._id) ? "btn-info" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  <div className="badge badge-sm">{form.likeCount}</div>
                </button>

                <button className="btn btn-sm mr-2" onClick={() => openModal(form)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                    />
                  </svg>
                  <div className="badge badge-sm">{form?.replies?.length || 0}</div>
                </button>

                <button className="btn btn-sm mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for post details */}
      {openModalPost && (
        <dialog id="my_modal_3" className="modal modal-open">
          <div className="modal-box w-3/4 max-w-4xl bg-white">
            <form method="dialog">
              {/* Close Button */}
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={closeModal}
              >
                ✕
              </button>
            </form>
            <p className="text-gray-600 mb-2">{openModalPost.realm.charAt(0).toUpperCase() + openModalPost.realm.slice(1)} - {openModalPost.type.charAt(0).toUpperCase() + openModalPost.type.slice(1)}</p>
            {/* Post By */}
            <div className="text-sm text-gray-400 mt-2 mr-2">
              Posted by: <strong>{openModalPost.username}</strong> <span> - </span>
              {new Date(openModalPost.timestamp).toLocaleTimeString([], {
                weekday: "long",    // e.g., "Monday"
                year: "numeric",    // e.g., "2025"
                month: "long",      // e.g., "April"
                day: "numeric",     // e.g., "1"
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <h3 className="text-xl font-semibold mb-2 mt-3">{openModalPost.question}</h3>
            <p className="text-lg font-semibold mb-2 mt-3">{openModalPost.moreDetails}</p>

            {/* Like Button */}
            <button
              onClick={() => handleLike(openModalPost._id)}
              className={`btn btn-sm mr-2 ${likedPosts.has(openModalPost._id) ? "btn-info" : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              <div className="badge badge-sm">{openModalPost.likeCount}</div>
            </button>

            <button className="btn btn-sm mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                />
              </svg>
              <div className="badge badge-sm">{openModalPost?.replies?.length || 0}</div>
            </button>

            <button className="btn btn-sm mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                />
              </svg>
            </button>

            {/* Replies Section */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Replies</h4>
              {openModalPost.replies?.length > 0 ? (
                <div>
                  {openModalPost.replies.map((reply, index) => (
                    <div key={index} className="p-2 rounded-lg mb-2">
                      <div className="avatar avatar-placeholder">
                        <div className="bg-neutral text-neutral-content w-9 rounded-full">
                          <span className="text-md">
                            <strong>{reply.username.substring(0, 2).toUpperCase()}</strong>
                          </span>
                        </div>
                      </div>
                      <span className="text-gray-700 p-2">
                        {`${reply.username}`}
                        <span className=" p-2">-</span>
                        <span className="text-gray-700 text-sm">
                          {new Date(reply.timestamp).toLocaleTimeString([], {
                            year: "numeric",    // e.g., "2025"
                            month: "long",      // e.g., "April"
                            day: "numeric",     // e.g., "1"
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </span>
                      <p className="text-gray-700 pl-10">{reply.reply}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No replies yet</p>
              )}
            </div>

            {/* Reply Box */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText[openModalPost._id] || ""}
                onChange={(e) =>
                  setReplyText((prev) => ({ ...prev, [openModalPost._id]: e.target.value }))
                }
                className="border rounded p-2 w-full h-16"
              />
              <button
                onClick={() => addReply(openModalPost._id)}
                className="mt-2 btn btn-success"
              >
                Reply
              </button>
            </div>

            <div className="modal-action">
              <button onClick={closeModal} className="btn btn-sm btn-error">
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default DisplayBox;