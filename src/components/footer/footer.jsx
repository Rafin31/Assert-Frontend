import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 mt-20">
            <div className="max-w-[1450px] mx-auto px-6 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-md shadow-violet-200">
                                <span className="text-white font-black text-sm">A</span>
                            </div>
                            <span className="font-black text-xl tracking-tight gradient-text">ASSERT</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            A blockchain-powered prediction platform. Earn AT tokens by making accurate predictions on sports, politics, and more.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Predict</h4>
                        <ul className="space-y-2.5">
                            {[{ l: "Sports", p: "/sports" }, { l: "Politics", p: "/politics" }, { l: "Technology", p: "/technology" }, { l: "Thread", p: "/thread" }].map(i => (
                                <li key={i.p}><Link to={i.p} className="text-sm text-slate-500 hover:text-violet-600 transition-colors">{i.l}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Create</h4>
                        <ul className="space-y-2.5">
                            {[{ l: "Prediction", p: "/createprediction" }, { l: "Poll", p: "/createpoll" }, { l: "Debate", p: "/createdebate" }, { l: "Query", p: "/createquery" }].map(i => (
                                <li key={i.p}><Link to={i.p} className="text-sm text-slate-500 hover:text-violet-600 transition-colors">{i.l}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Account</h4>
                        <ul className="space-y-2.5">
                            {[{ l: "Dashboard", p: "/dashboard" }, { l: "My Results", p: "/dashboard/results" }, { l: "Token Wallet", p: "/dashboard/wallet" }, { l: "Leaderboard", p: "/reward" }].map(i => (
                                <li key={i.p}><Link to={i.p} className="text-sm text-slate-500 hover:text-violet-600 transition-colors">{i.l}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-400 text-sm">© {new Date().getFullYear()} ASSERT. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link to="/adminpanel" className="text-xs text-slate-400 hover:text-violet-600 transition-colors">Admin Panel</Link>
                        <div className="flex items-center gap-2">
                            <a href="#" aria-label="Twitter"
                                className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-slate-400 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
