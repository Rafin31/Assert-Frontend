import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);

const NotificationModal = ({ id }) => {
    const notifications = useSelector((state) => state.notifications.items);
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <dialog id={id} className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
            <div className="modal-box rounded-2xl max-w-sm p-0 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-violet-100 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 01-6 0m6 0H9" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-xs bg-violet-600 text-white font-semibold px-2 py-0.5 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    <form method="dialog">
                        <button className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {notifications.map((n) => (
                                <Link to="/dashboard/results" key={n.id} className="block">
                                    <div className={`notif-item flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors ${!n.read ? "bg-violet-50/60" : ""}`}>
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${!n.read ? "bg-violet-100" : "bg-slate-100"}`}>
                                            <svg className={`w-4 h-4 ${!n.read ? "text-violet-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {n.createdAt ? dayjs(n.createdAt).fromNow() : "just now"}
                                            </p>
                                        </div>
                                        {!n.read && <div className="w-2 h-2 rounded-full bg-violet-600 mt-1.5 shrink-0" />}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 01-6 0m6 0H9" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-slate-600">All caught up</p>
                            <p className="text-xs text-slate-400 mt-1">No notifications yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </dialog>
    );
};

export default NotificationModal;
