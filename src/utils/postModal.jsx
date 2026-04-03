import React from "react";

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const typeColors = {
    debate: "bg-orange-100 text-orange-700",
    query: "bg-blue-100 text-blue-700",
};

const PostModal = ({ post, onClose, onLike, onReply, replyText, setReplyText, liked }) => {
    return (
        <dialog open className="modal modal-open backdrop-blur-sm">
            <div className="modal-box w-full max-w-2xl rounded-2xl p-0 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[post.type] || "bg-slate-100 text-slate-600"}`}>
                            {cap(post.type)}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{cap(post.realm)}</span>
                    </div>
                    <button
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                        onClick={onClose}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <p className="text-xs text-slate-400 mb-2">
                        By <span className="font-semibold text-slate-600">{post.username}</span> · {new Date(post.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{post.question}</h3>
                    {post.moreDetails && (
                        <p className="text-sm text-slate-600 leading-relaxed">{post.moreDetails}</p>
                    )}

                    {/* Like / Reply counts */}
                    <div className="flex items-center gap-4 mt-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); onLike(post._id); }}
                            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"}`}
                        >
                            <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {post.likeCount} {liked ? "Liked" : "Like"}
                        </button>
                        <span className="flex items-center gap-1.5 text-sm text-slate-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {post?.replies?.length || 0} Replies
                        </span>
                    </div>
                </div>

                {/* Replies */}
                <div className="px-6 pb-4">
                    <h4 className="text-sm font-bold text-slate-700 mb-3">Replies</h4>
                    {post.replies?.length > 0 ? (
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                            {post.replies.map((reply, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                                        <span className="text-white text-xs font-bold">
                                            {reply.username.substring(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-slate-700 mb-0.5">{reply.username}</p>
                                        <p className="text-sm text-slate-600">{reply.reply}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {new Date(reply.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 italic">No replies yet. Be the first to reply!</p>
                    )}
                </div>

                {/* Reply input */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="assert-input flex-1"
                            onKeyDown={(e) => e.key === "Enter" && onReply(post._id)}
                        />
                        <button
                            onClick={() => onReply(post._id)}
                            className="btn-assert px-4 py-2 text-sm shrink-0"
                        >
                            Reply
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

export default PostModal;
