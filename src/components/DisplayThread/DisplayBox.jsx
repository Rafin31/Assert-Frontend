// DisplayBox.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllApproved, toggleLike, addReply } from "../../Services/postService.jsx"; // New service
import PostCard from "../../utils/postCard.jsx"; // Optional: split post UI into a separate component
import PostModal from "../../utils/postModal.jsx"; // Optional: modal component for readability

const DisplayBox = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [replyText, setReplyText] = useState({});
  const [openModalPost, setOpenModalPost] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedRealm, setSelectedRealm] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAllApproved();
        if (result.success) {
          const filtered = result.data.filter((form) => {
            const isTypeMatch =
              filter === "all" || form.type.toLowerCase() === filter.toLowerCase();
            const isRealmMatch =
              selectedRealm === "all" || form.realm.toLowerCase() === selectedRealm.toLowerCase();
            return isTypeMatch && isRealmMatch;
          });

          setFormData(filtered);

          const likedSet = new Set(
            filtered
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
  }, [user, filter, selectedRealm]);

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
      <div className="flex flex-row mb-4">
        {/* <div className="filter pr-2 border-2 border-[red]">
          {['all', 'debate', 'query'].map((type) => (
            <input
              key={type}
              className="btn btn-sm mr-1"
              type="radio"
              name="postType"
              aria-label={type}
              value={type}
              checked={filter === type}
              onChange={(e) => setFilter(e.target.value)}
            />
          ))}
        </div> */}

        <div className="filter">
          {['all', 'sports', 'technology'].map((realm) => (
            <button
              key={realm}
              className="btn btn-sm mr-1"
              onClick={() => setSelectedRealm(realm)}
            >
              {realm.charAt(0).toUpperCase() + realm.slice(1)}
            </button>
          ))}
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
