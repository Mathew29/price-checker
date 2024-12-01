import React, { useEffect, useState } from 'react';
import { Link } from "@remix-run/react";
import axios from 'axios';
import Modal from './Modal';
import GraphModal from './GraphModal';
import AlertModal from './AlertModal';

export default function PriceTracking() {
    const [trackingData, setTrackingData] = useState([]);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [graphModalOpen, setGraphModalOpen] = useState(false);
    const [graphModalData, setGraphModalData] = useState(null)
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const [alertProductName, setAlertProductName] = useState('');
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
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);

        return `${month}/${day}/${year}`;
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5001/api/users/item-tracking/${userId}/${currentProductId}`);
            setTrackingData((prevData) => prevData.filter(product => product.id !== currentProductId));
            setModalOpen(false);
            setCurrentProductId(null);
        } catch (error) {
            console.error('Failed to delete the product:', error);
            setError('Failed to delete the product.');
        }
    };

    const handleCSV = async () => {
        try {
            const res = await axios.post('http://localhost:5010/api/download-csv/download', trackingData, {
                responseType: 'arraybuffer'
            });

            const blob = new Blob([res.data], { type: 'text/csv' })
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'tracking_data.csv';
            link.click();


        } catch (error) {
            console.error('Failed to download csv:', error);
            setError('Failed to download csv.');
        }
    }

    const handleGraph = async (product) => {
        try {
            const response = await axios.post("http://localhost:5011/api/graph/", {product}, {responseType: 'blob'})

            const imageUrl = URL.createObjectURL(new Blob([response.data], {type: "image/png"}));

            setGraphModalData({imageUrl, productName: product.name})
            setGraphModalOpen(true);

        } catch (error) {
            console.error('Failed to send graph data:', error);
            setError('Failed to send graph data.');
        }
    }

    const handleSetAlert = async (price) => {
        try {
           const alertData = {
            user_id: userId,
            item_id: currentProductId,
            threshold_price: price
           }

            await axios.post('http://localhost:5001/api/users/set-alert', {alertData});
            setAlertModalOpen(false)
            setAlertProductName('')
            setCurrentProductId(null)
        } catch (error) {

        }
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-200">Tracked Items</h1>
            <Link to="/addItem">
                <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                    Add Product
                </button>
            </Link>
            <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500" onClick={handleCSV}>
                    Download CSV
            </button>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full border border-gray-700 mt-4 bg-gray-800">
                <thead className="bg-gray-900">
                    <tr>
                        <th className="border-b border-gray-700 p-4 text-left text-gray-200">Product Name</th>
                        <th className="border-b border-gray-700 p-4 text-left text-gray-200">Latest Price</th>
                        <th className="border-b border-gray-700 p-4 text-left text-gray-200">Latest Date</th>
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
                                    <p>
                                        {product.metrics[0]['price']}
                                    </p>
                                </td>
                                <td className="border-b border-gray-700 p-4">
                                    <p>
                                        {formatDate(product.metrics[0]['record_date'])}
                                    </p>
                                </td>
                                <td className="border-b border-gray-700 p-4">
                                    <button
                                        onClick={() => {
                                            setCurrentProductId(product.id);
                                            setModalOpen(true);
                                        }}
                                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                                    >
                                        Delete
                                    </button>
                                    <button className="px-2.5 py-1 bg-blue-600 text-white rounded hover:bg-blue-500" onClick={() => {
                                        handleGraph(product)
                                    }}>
                                        Graph
                                    </button>
                                    <button className="px-2.5 py-1 bg-green-600 text-white rounded hover:bg-green-500" onClick={() => {
                                        setCurrentProductId(product.id);
                                        setAlertProductName(product.name)
                                        setAlertModalOpen(true)
                                    }}>
                                        Set Alert
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
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDelete}
            />
            <GraphModal
                isOpen={graphModalOpen}
                onClose={() => setGraphModalOpen(false)}
                data={graphModalData}
            />
            <AlertModal
                isOpen={alertModalOpen}
                onClose={() => setAlertModalOpen(false)}
                onSetAlert={handleSetAlert}
                productName={alertProductName}
            />
        </div>
    );
}
