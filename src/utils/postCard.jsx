import React from "react";

const PostCard = ({ post, onLike, onOpenModal, liked }) => {
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    const typeColors = {
        debate: "bg-orange-100 text-orange-700",
        query: "bg-blue-100 text-blue-700",
    };

    return (
        <div
            className="assert-card p-5 mb-3 cursor-pointer group"
            onClick={onOpenModal}
        >
            <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[post.type] || "bg-slate-100 text-slate-600"}`}>
                    {cap(post.type)}
                </span>
                <span className="text-xs text-slate-400 font-medium">{cap(post.realm)}</span>
            </div>

            <h3 className="text-base font-bold text-slate-800 mb-1 group-hover:text-violet-700 transition-colors leading-snug">
                {post.question}
            </h3>

            {post.moreDetails && (
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{post.moreDetails}</p>
            )}

            <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-slate-400">
                    By <span className="font-semibold text-slate-600">{post.username}</span> · {new Date(post.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => { e.stopPropagation(); onLike(post._id); }}
                        className={`flex items-center gap-1 text-sm font-medium transition-colors ${liked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"}`}
                    >
                        <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {post.likeCount}
                    </button>
                    <span className="flex items-center gap-1 text-sm text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post?.replies?.length || 0}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
