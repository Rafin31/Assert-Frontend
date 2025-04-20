// PostModal.jsx
import React from "react";

const PostModal = ({ post, onClose, onLike, onReply, replyText, setReplyText, liked }) => {
    return (
        <dialog open className="modal modal-open backdrop-brightness-100 backdrop-blur-xs">
            <div className="modal-box w-3/4 max-w-4xl bg-white">
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={onClose}
                >
                    ✕
                </button>

                <p className="text-gray-600 mb-2 ">
                    {post.realm.charAt(0).toUpperCase() + post.realm.slice(1)} - {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </p>
                <div className="text-sm text-gray-400">
                    Posted by: <strong>{post.username}</strong> - {new Date(post.timestamp).toLocaleString()}
                </div>

                <h3 className="text-xl font-semibold mt-2">{post.question}</h3>
                <p className="text-base text-gray-600 mt-1">{post.moreDetails}</p>

                <div className="flex items-center mt-4">
                    <div className="flex items-center mt-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onLike(post._id);
                            }}
                            className={`cursor-pointer mr-2 `}
                        >
                            <span>
                                {liked ? '❤️ ' : '🤍 '}   {post.likeCount}

                            </span>
                        </button>

                        <div className="cursor-pointer">
                            💬 <span className="">{post?.replies?.length || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <h4 className="font-semibold mb-2">Replies</h4>
                    {post.replies?.length > 0 ? (
                        <div>
                            {post.replies.map((reply, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                                    {/* Avatar on the left */}
                                    <div className="avatar placeholder">
                                        <div className="bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold">
                                                <p className="text-center mt-2"> {reply.username.substring(0, 2).toUpperCase()}</p>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right content */}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-800">{reply.username}</span>
                                        <p className="text-sm text-gray-700">{reply.reply}</p>
                                        <span className="text-xs text-gray-500 mt-1">
                                            {new Date(reply.timestamp).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>

                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No replies yet</p>
                    )}
                </div>

                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="input input-bordered w-full"
                    />
                    <button onClick={() => onReply(post._id)} className="btn btn-success mt-2">
                        Reply
                    </button>
                </div>

            </div>
        </dialog>
    );
};

export default PostModal;
