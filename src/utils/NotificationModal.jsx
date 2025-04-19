import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


dayjs.extend(relativeTime);

const NotificationModal = ({ id }) => {



    const notifications = useSelector((state) => state.notifications.items);
    const unreadCount = notifications.filter((n) => !n.read).length;



    return (
        <dialog id={id} className="modal">
            <div className="modal-box bg-base-100 shadow-xl border border-base-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 01-6 0m6 0H9"
                            />
                        </svg>
                        Notifications
                        {unreadCount > 0 && (
                            <span className="badge badge-primary text-xs">
                                {unreadCount} Unread
                            </span>
                        )}
                    </h3>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                    </form>
                </div>

                {/* List */}
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`alert alert-soft p-2 shadow-sm flex items-start gap-3 ${n.read
                                    ? "alert-info"
                                    : "alert-warning border-l-4 border-warning-content"
                                    }`}
                            >
                                {/* icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 stroke-current flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                                    />
                                </svg>

                                <Link to={'/dashboard/results'}>
                                    <div className="flex-1">
                                        <span className="text-sm leading-snug block">
                                            {n.title}
                                        </span>
                                        {/* <span className="text-xs leading-snug block">{n.message}</span> */}
                                        <span className="text-[11px] text-gray-400">
                                            {n.createdAt ? dayjs(n.createdAt).fromNow() : "just now"}
                                        </span>
                                    </div>
                                </Link>

                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No notifications to show.</p>
                    )}
                </div>
            </div>
        </dialog>
    );
};

export default NotificationModal;
