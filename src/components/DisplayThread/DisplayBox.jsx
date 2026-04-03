import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllApproved, toggleLike, addReply } from "../../Services/postService.jsx";
import PostCard from "../../utils/postCard.jsx";
import PostModal from "../../utils/postModal.jsx";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const REALMS = ["all", "politics", "technology", "crypto", "sports"];
const TYPES = ["all", "debate", "query"];

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenFilter(false);
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
            const matchesType = filter === "all" || form.type.toLowerCase() === filter;
            const matchesRealm = selectedRealm === "all" || form.realm.toLowerCase() === selectedRealm;
            const matchesSearch =
              form.moreDetails?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              form.question?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchDate =
              dateFilter === "recent" ||
              (dateFilter === "past7" && dayjs(form.createdAt).isAfter(dayjs().subtract(7, "day"))) ||
              (dateFilter === "past15" && dayjs(form.createdAt).isAfter(dayjs().subtract(15, "day")));
            return matchesType && matchesRealm && matchesSearch && matchDate;
          });

          const sorted = [...filtered].sort((a, b) =>
            sortOption === "newest"
              ? new Date(b.createdAt) - new Date(a.createdAt)
              : b.likeCount - a.likeCount
          );

          setFormData(sorted);
          setCurrentPage(1);
          setLikedPosts(new Set(
            sorted.filter(f => f.likedBy?.some(l => l.email === user?.email)).map(f => f._id)
          ));
        } else {
          setError("Failed to load posts.");
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
    setFilter("all"); setSelectedRealm("all"); setDateFilter("recent"); setSearchTerm("");
  };

  const hasActiveFilters = filter !== "all" || selectedRealm !== "all" || dateFilter !== "recent" || searchTerm;

  const handleLike = async (formId) => {
    if (!user) return navigate("/login");
    try {
      const result = await toggleLike(formId, user.userName, user.email);
      if (result.success) {
        setFormData(prev => prev.map(f => f._id === formId ? { ...f, likeCount: result.data.likeCount } : f));
        setLikedPosts(prev => {
          const s = new Set(prev);
          s.has(formId) ? s.delete(formId) : s.add(formId);
          return s;
        });
        if (openModalPost?._id === formId) setOpenModalPost(p => ({ ...p, likeCount: result.data.likeCount }));
      }
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleReply = async (formId) => {
    const text = replyText[formId]?.trim();
    if (!text || !user) return navigate("/login");
    try {
      const result = await addReply(formId, user.userName, user.email, text);
      if (result.success) {
        setFormData(prev => prev.map(f => f._id === formId ? { ...f, replies: result.data.replies } : f));
        if (openModalPost?._id === formId) setOpenModalPost(p => ({ ...p, replies: result.data.replies }));
        setReplyText(prev => ({ ...prev, [formId]: "" }));
      }
    } catch (err) {
      console.error("Reply failed:", err);
    }
  };

  const currentPosts = formData.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);
  const totalPages = Math.ceil(formData.length / postsPerPage);

  return (
    <div className="w-full">
      {/* Controls bar */}
      <div className="flex flex-wrap gap-2 mb-5 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search posts..."
            className="assert-input pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button className={`filter-pill ${sortOption === "newest" ? "active" : ""}`} onClick={() => setSortOption("newest")}>Newest</button>
          <button className={`filter-pill ${sortOption === "liked" ? "active" : ""}`} onClick={() => setSortOption("liked")}>Most Liked</button>

          {/* Filter dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenFilter(p => !p)}
              className={`filter-pill flex items-center gap-1 ${openFilter ? "active" : ""}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
              </svg>
              Filters
            </button>

            {openFilter && (
              <div className="absolute right-0 top-full mt-2 z-50 assert-card p-4 w-52 shadow-xl">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Realm</p>
                {REALMS.map(realm => (
                  <button
                    key={realm}
                    onClick={() => { setSelectedRealm(realm); setOpenFilter(false); }}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-lg mb-0.5 capitalize ${selectedRealm === realm ? "bg-violet-100 text-violet-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {realm === "all" ? "All realms" : realm}
                  </button>
                ))}
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-3">Type</p>
                {TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => { setFilter(type); setOpenFilter(false); }}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-lg mb-0.5 capitalize ${filter === type ? "bg-violet-100 text-violet-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {type === "all" ? "All types" : type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button onClick={resetFilters} className="filter-pill text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100">
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-28 w-full rounded-2xl" />)}
        </div>
      ) : error ? (
        <p className="text-center text-red-500 py-8">{error}</p>
      ) : formData.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-slate-600 font-semibold">No posts found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          {currentPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.35, ease: "easeOut" }}
            >
              <PostCard
                post={post}
                onLike={handleLike}
                onOpenModal={() => setOpenModalPost(post)}
                liked={likedPosts.has(post._id)}
              />
            </motion.div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-6 gap-3">
              <button className="btn-assert-ghost" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</button>
              <span className="text-sm text-slate-500 font-medium">Page {currentPage} of {totalPages}</span>
              <button className="btn-assert-ghost" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
            </div>
          )}
        </>
      )}

      {openModalPost && (
        <PostModal
          post={openModalPost}
          onClose={() => setOpenModalPost(null)}
          onLike={handleLike}
          onReply={handleReply}
          replyText={replyText[openModalPost._id] || ""}
          setReplyText={(value) => setReplyText(prev => ({ ...prev, [openModalPost._id]: value }))}
          liked={likedPosts.has(openModalPost._id)}
        />
      )}
    </div>
  );
};

export default DisplayBox;
