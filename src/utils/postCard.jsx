// PostCard.jsx
import React from "react";

const PostCard = ({ post, onLike, onOpenModal, liked }) => {
    return (
        <div
            className="p-4 mb-4 shadow-sm rounded-lg bg-gray-50 hover:bg-gray-200 cursor-pointer"
            onClick={onOpenModal}
        >
            <p className="text-gray-600 mb-2">
                {post.realm.charAt(0).toUpperCase() + post.realm.slice(1)} - {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
            </p>
            <div className="text-sm text-gray-400">
                Posted by: <strong>{post.username}</strong> - {new Date(post.timestamp).toLocaleString()}
            </div>
            <h3 className="text-xl font-semibold mt-2">{post.question}</h3>
            <p className="text-base text-gray-500 mt-1">{post.moreDetails}</p>

            <div className="flex items-center mt-3">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onLike(post._id);
                    }}
                    className={`btn btn-sm mr-2 ${liked ? "btn-info" : ""}`}
                >
                    ❤️ <span className="badge badge-sm ml-1">{post.likeCount}</span>
                </button>

                <div className="btn btn-sm">
                    💬 <span className="badge badge-sm ml-1">{post?.replies?.length || 0}</span>
                </div>
            </div>
        </div>
    );
};

export default PostCard;