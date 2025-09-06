import React from 'react';
import { Link } from "react-router-dom";

const SellerPanel = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/4 bg-[#3c3007] text-white">
                <div className="p-4 text-2xl font-bold">ASSOONASPOSIBLE</div>
                <div className="mt-10">
                    <ul>
                        <li className="py-2 px-4 hover:bg-gray-700"><a href="#">Dashboard</a></li>
                        <li className="py-2 px-4 hover:bg-gray-700"><Link to="/profile">Profile</Link></li>
                         <li className="py-2 px-4 hover:bg-gray-700"><Link to="/userEvent">UsreEvents</Link></li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Fixed Header */}
                <div className="bg-white shadow p-4 sticky top-0 z-10">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold">Seller Dashboard</h1>
                        <div className="text-gray-600">Welcome sufian,</div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto p-6 space-y-8">
                    
                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded shadow">
                            <h2 className="font-semibold text-gray-700">Users</h2>
                            <p className="text-3xl font-bold text-indigo-600">26</p>
                        </div>
                        <div className="bg-white p-6 rounded shadow">
                            <h2 className="font-semibold text-gray-700">Categories</h2>
                            <p className="text-3xl font-bold text-indigo-600">14</p>
                        </div>
                        <div className="bg-white p-6 rounded shadow">
                            <h2 className="font-semibold text-gray-700">Orders</h2>
                            <p className="text-3xl font-bold text-indigo-600">0</p>
                        </div>
                    </div>

                    {/* Booking List */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">List of Bookings</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow rounded">
                                <thead>
                                    <tr className="bg-gray-200 text-left">
                                        <th className="py-3 px-5 border-b">#</th>
                                        <th className="py-3 px-5 border-b">Product Name</th>
                                        <th className="py-3 px-5 border-b">Buyer Name</th>
                                        <th className="py-3 px-5 border-b">Contact</th>
                                        <th className="py-3 px-5 border-b">Email</th>
                                        <th className="py-3 px-5 border-b">Date</th>
                                        <th className="py-3 px-5 border-b">Status</th>
                                        <th className="py-3 px-5 border-b">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-3 px-5 border-b">1</td>
                                        <td className="py-3 px-5 border-b">Product A</td>
                                        <td className="py-3 px-5 border-b">John Doe</td>
                                        <td className="py-3 px-5 border-b">1234567890</td>
                                        <td className="py-3 px-5 border-b">john@example.com</td>
                                        <td className="py-3 px-5 border-b">01/01/2023</td>
                                        <td className="py-3 px-5 border-b text-green-600 font-medium">Completed</td>
                                        <td className="py-3 px-5 border-b">
                                            <button className="text-blue-600 hover:underline">Edit</button>
                                        </td>
                                    </tr>
                                    {/* More rows as needed */}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SellerPanel;
