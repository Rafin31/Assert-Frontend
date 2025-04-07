import React, { useState } from "react";
import OutcomePoll from "../PollPrediction/OutcomePoll"; // Import OutcomePoll component

const categories = {
    Basketball: [],
    Boxing: [],
    Baseball: ["NBA", "MLB"],
    Cricket: ["Big Bash", "IPL"],
    Football: ["Premier League", "La Liga", "Ligue 1", "Serie A", "UCL", "UEL", "Others"],
    Hockey: ["NHL"],
    Tennis: [],
    NFL: [],
    UFC: []
};

const CreatePoll = () => {
    const [realm, setRealm] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [title, setTitle] = useState('');
    const [outcome, setOutcome] = useState([{ name: '', votes: 0 }]); // Initial state with one option
    const [userPollData, setUserPollData] = useState([]); // Ensure it's an array
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!realm || !title || (realm === "sports" && !category)) {
            alert("Please fill out all required fields.");
            return;
        }

        const validOutcomes = outcome.filter(opt => opt.name.trim() !== '');
        if (validOutcomes.length < 2) {
            alert("Please provide at least two valid options.");

            return;
        }

        // Create userPollData object
        const pollData = {
            realm,
            category,
            subcategory,
            title,
            outcome: validOutcomes.map(opt => ({ name: opt.name, votes: 0 }))
        };

        // Save data as an array
        setUserPollData([pollData]);
        setIsModalOpen(true);

        // Clear form
        setRealm('');
        setCategory('');
        setSubcategory('');
        setTitle('');
        setOutcome([{ name: '', votes: 0 }]);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Handle adding new outcome option
    const addOutcome = () => {
        setOutcome([...outcome, { name: '', votes: 0 }]);
    };

    // Handle removing an outcome option
    const removeOutcome = (index) => {
        if (outcome.length > 1) {
            setOutcome(outcome.filter((_, i) => i !== index));
        }
    };

    // Handle outcome name change
    const handleOutcomeChange = (index, value) => {
        const newOutcome = [...outcome];
        newOutcome[index].name = value;
        setOutcome(newOutcome);
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 py-10">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h1 className="text-2xl font-semibold mb-6">Create Poll</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Realm Selection */}
                    <div>
                        <label htmlFor="realm" className="block text-sm text-gray-700">Choose a Realm:</label>
                        <select
                            id="realm"
                            value={realm}
                            onChange={(e) => {
                                setRealm(e.target.value);
                                setCategory('');
                                setSubcategory('');
                            }}
                            className="w-full p-3 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Select a Realm</option>
                            <option value="politics">Politics</option>
                            <option value="technology">Technology</option>
                            <option value="crypto">Crypto</option>
                            <option value="sports">Sports</option>
                        </select>
                    </div>

                    {/* Category Selection (Only visible when Sports is selected) */}
                    {realm === "sports" && (
                        <div>
                            <label htmlFor="category" className="block text-sm text-gray-700">Choose a Category:</label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setSubcategory('');
                                }}
                                className="w-full p-3 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select a Category</option>
                                {Object.keys(categories).map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Subcategory Selection (Optional) */}
                    {category && categories[category].length > 0 && (
                        <div>
                            <label htmlFor="subcategory" className="block text-sm text-gray-700">Choose a Subcategory (Optional):</label>
                            <select
                                id="subcategory"
                                value={subcategory}
                                onChange={(e) => setSubcategory(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md"
                            >
                                <option value="">None</option>
                                {categories[category].map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block text-sm text-gray-700">Poll Title:</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter your poll title..."
                            className="w-full p-3 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/* Outcome Options */}
                    <div>
                        <label className="block text-sm text-gray-700">Outcome Options:</label>
                        {outcome.map((opt, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={opt.name}
                                    onChange={(e) => handleOutcomeChange(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                                {outcome.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOutcome(index)}
                                        className="p-2 bg-[#f17575] text-white text-sm rounded-md cursor-pointer"
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addOutcome}
                            className="btn btn-active cursor-pointer"
                        >
                            Add Option
                        </button>
                    </div>

                    <button type="submit" className="w-full p-3 bg-[#f17575] text-white rounded-md hover:bg-[#d96969] cursor-pointer">
                        Submit Poll
                    </button>
                </form>
            </div>

            {/* Modal for Submitted Prediction */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-base-100 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-xl font-semibold mb-4 text-center">Submitted Poll for Review</h2>
                        <div className="flex justify-center">
                            <OutcomePoll data={userPollData} />
                        </div>
                        <div className="mt-4 text-center">
                            <button
                                onClick={closeModal}
                                className="p-2 bg-gray-300 rounded-md text-sm text-gray-800 hover:bg-gray-400 cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePoll;