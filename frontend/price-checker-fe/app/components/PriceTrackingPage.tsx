// frontend/src/routes/price-tracking-page.jsx
import React, { useEffect, useState } from 'react';
import { Link } from "@remix-run/react";
import axios from 'axios';

export default function PriceTrackingPage() {
    const [trackingData, setTrackingData] = useState([]);
    const [error, setError] = useState(null);
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;


    useEffect(() => {
        const fetchTrackingData = async () => {
            try {
                const productIdsResponse = await axios.get(`http://localhost:5001/api/users/item-tracking/${userId}`);
                const productIds = productIdsResponse.data.map(item => item.item_id);


                if (productIds.length === 0) {
                    setError('No tracked items found for this user.');
                    return;
                }


                const productDetailsResponses = await Promise.all(
                    productIds.map(productId =>
                        axios.get(`http://localhost:3000/api/product/product-details/${productId}`)
                    )
                );




                const combinedData = productDetailsResponses.map(response => response.data);
                setTrackingData(combinedData);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch tracking data:', error);
                setError('Failed to load tracking data.');
            }
        };

        fetchTrackingData();
    }, []);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`http://localhost:5001/api/users/item-tracking/${userId}/${productId}`);
            setTrackingData((prevData) => {
                return prevData.filter(product => product.id !== productId);
            });
        } catch (error) {
            console.error('Failed to delete the product:', error);
            setError('Failed to delete the product.');
        }
    };


    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-200">Tracked Items</h1>
            <Link to="/addItem">
                <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                    Add Product
                </button>
            </Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full border border-gray-700 mt-4 bg-gray-800">
                <thead className="bg-gray-900">
                    <tr>
                        <th className="border-b border-gray-700 p-4 text-left text-gray-200">Product Name</th>
                        <th className="border-b border-gray-700 p-4 text-left text-gray-200">Price History</th>
                        <th className="border-b border-gray-700 p-4 text-left text-gray-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {trackingData.length > 0 ? (
                        trackingData.map((product, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-600'}>
                                <td className="border-b border-gray-700 p-4">
                                    <a href={product.url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className="text-blue-400 hover:underline"
                                    >
                                        {product.name}
                                    </a>
                                </td>
                                <td className="border-b border-gray-700 p-4">
                                    <ul>
                                        {product.metrics.map((metric, metricIndex) => (
                                            <li key={metricIndex} className="text-gray-300">
                                                Price: ${metric.price}, Sale: {metric.discount}%, {formatDate(metric.record_date)}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="border-b border-gray-700 p-4">
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center p-4 text-gray-300">No tracked items found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
