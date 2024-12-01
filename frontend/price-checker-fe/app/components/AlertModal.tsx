import React, { useState } from 'react';

const AlertModal = ({ isOpen, onClose, onSetAlert, productName }) => {
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!price || isNaN(price) || price <= 0) {
            setError('Please enter a valid price');
            return;
        }

        onSetAlert(price);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-bkg p-6 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4 text-accent-2">Set Price Alert for {productName}</h2>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border border-gray-300 text-accent-2 p-2 mb-4 w-full"
                    placeholder="Enter price"
                />
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-black rounded mr-2">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded">
                        Set Alert
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
