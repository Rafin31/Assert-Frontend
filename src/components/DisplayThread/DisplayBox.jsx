// 🛠️ Updated DisplayBox.jsx with working dropdown toggle and close on selection
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getAllApproved,
  toggleLike,
  addReply,
} from "../../Services/postService.jsx";
import PostCard from "../../utils/postCard.jsx";
import PostModal from "../../utils/postModal.jsx";
import dayjs from "dayjs";

const DisplayBox = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [replyText, setReplyText] = useState({});
  const [openModalPost, setOpenModalPost] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedRealm, setSelectedRealm] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("recent");
  const [sortOption, setSortOption] = useState("newest");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);


  const dropdownRef = useRef(null);



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAllApproved();
        if (result.success) {
          const filtered = result.data.filter((form) => {
            const matchesType =
              filter === "all" || form.type.toLowerCase() === filter.toLowerCase();
            const matchesRealm =
              selectedRealm === "all" ||
              form.realm.toLowerCase() === selectedRealm.toLowerCase();
            const matchesSearch =
              form.moreDetails?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              form.question?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchDate =
              dateFilter === "recent" ||
              (dateFilter === "past7" &&
                dayjs(form.createdAt).isAfter(dayjs().subtract(7, "day"))) ||
              (dateFilter === "past15" &&
                dayjs(form.createdAt).isAfter(dayjs().subtract(15, "day")));

            return matchesType && matchesRealm && matchesSearch && matchDate;
          });

          const sorted = [...filtered].sort((a, b) => {
            if (sortOption === "newest") {
              return new Date(b.createdAt) - new Date(a.createdAt);
            } else {
              return b.likeCount - a.likeCount;
            }
          });

          setFormData(sorted);

          const likedSet = new Set(
            sorted
              .filter((form) => form.likedBy?.includes(user?.userName))
              .map((form) => form._id)
          );
          setLikedPosts(likedSet);
        } else {
          setError("Failed to load data.");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, filter, selectedRealm, searchTerm, dateFilter, sortOption]);

  const resetFilters = () => {
    setFilter("all");
    setSelectedRealm("all");
    setDateFilter("recent");
    setSearchTerm("");
  };

  const handleLike = async (formId) => {
    if (!user) return navigate("/login");
    const isLiked = likedPosts.has(formId);

    try {
      const result = await toggleLike(formId, user.userName);
      if (result.success) {
        setFormData((prev) =>
          prev.map((form) =>
            form._id === formId ? { ...form, likeCount: result.data.likeCount } : form
          )
        );
        const updatedSet = new Set(likedPosts);
        isLiked ? updatedSet.delete(formId) : updatedSet.add(formId);
        setLikedPosts(updatedSet);

        if (openModalPost?._id === formId) {
          setOpenModalPost((prev) => ({
            ...prev,
            likeCount: result.data.likeCount,
          }));
        }
      }
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleReply = async (formId) => {
    const text = replyText[formId]?.trim();
    if (!text || !user) return navigate("/login");

    try {
      const result = await addReply(formId, user.userName, text);
      if (result.success) {
        setFormData((prev) =>
          prev.map((form) =>
            form._id === formId ? { ...form, replies: result.data.replies } : form
          )
        );
        if (openModalPost?._id === formId) {
          setOpenModalPost((prev) => ({
            ...prev,
            replies: result.data.replies,
          }));
        }
        setReplyText((prev) => ({ ...prev, [formId]: "" }));
      }
    } catch (err) {
      console.error("Reply failed:", err);
    }
  };

  return (
    <div className="mx-auto rounded-lg overflow-hidden bg-base-50 min-h-[100vh]">
      <div className="sticky top-0 z-10 bg-base-50 p-2 flex flex-wrap justify-between items-center gap-2 ">
        <input
          type="text"
          placeholder="Search posts..."
          className="input input-bordered flex-grow max-w-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className={`btn btn-sm ${sortOption === "newest" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setSortOption("newest")}
          >
            Newest First
          </button>
          <button
            className={`btn btn-sm ${sortOption === "liked" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setSortOption("liked")}
          >
            Most Liked
          </button>


          <div className="dropdown dropdown-end" onClick={() => setOpenFilter(!openFilter)}>
            <label tabIndex={0} className="btn btn-sm">
              Filters
            </label>

            {openFilter && (
              <ul
                tabIndex={0}
                className="dropdown-content z-[999] menu p-4 shadow bg-base-100 rounded-box w-64"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click
                  setOpenFilter(false); // Close dropdown on selection
                }}
              >
                {/* Realm Filter */}
                <li className="mb-1 font-bold text-sm">Realm</li>
                {["all", "sports", "technology"].map((realm) => (
                  <li key={realm}>
                    <button
                      className={`w-full text-left ${selectedRealm === realm ? "btn-active" : ""}`}
                      onClick={() => setSelectedRealm(realm)}
                    >
                      {realm.charAt(0).toUpperCase() + realm.slice(1)}
                    </button>
                  </li>
                ))}

                <li className="mt-3 mb-1 font-bold text-sm">Type</li>
                {["all", "debate", "query"].map((type) => (
                  <li key={type}>
                    <button
                      className={`w-full text-left ${filter === type ? "btn-active" : ""}`}
                      onClick={() => setFilter(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  </li>
                ))}


              </ul>
            )}
          </div>
          {(filter !== "all" || selectedRealm !== "all" || dateFilter !== "recent" || searchTerm) && (
            <button className="btn btn-warning btn-sm ml-2" onClick={resetFilters}>Reset Filters</button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="skeleton h-32 w-full rounded-xl"></div>
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : formData.length === 0 ? (
        <div className="h-[80vh] flex justify-center items-center">
          <p className="text-center text-gray-500">No posts found in this category / Thread.</p>
        </div>
      ) : (
        formData.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onLike={handleLike}
            onOpenModal={() => setOpenModalPost(post)}
            liked={likedPosts.has(post._id)}
          />
        ))
      )}

      {openModalPost && (
        <PostModal
          post={openModalPost}
          onClose={() => setOpenModalPost(null)}
          onLike={handleLike}
          onReply={handleReply}
          replyText={replyText[openModalPost._id] || ""}
          setReplyText={(value) =>
            setReplyText((prev) => ({ ...prev, [openModalPost._id]: value }))
          }
          liked={likedPosts.has(openModalPost._id)}
        />
      )}
    </div>
  );
};

export default DisplayBox;
