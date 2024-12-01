
const GraphModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-bkg p-6 rounded shadow-lg">
                <div className="mt-4">
                        {data?.error ? (
                            <p className="text-red-500">{data.error}</p>
                        ) : (
                            <div>
                                <h2 className="text-lg font-bold text-gray-200 mb-4">{`Graph for ${data.productName}`}</h2>
                                <img
                                src={data.imageUrl}
                                alt={`Graph for ${data.productName}`}
                                className="max-w-full max-h-64"
                                />
                            </div>
                        )}
                    </div>
                    <div className="mt-4 flex justify-between">
                    <button
                        onClick={onClose}
                        className="ml-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GraphModal;
