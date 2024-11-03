
const Modal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-bkg p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                <p>Are you sure you wish to untrack this item?</p>
                <p>*No data will be lost if this item is untracked*</p>
                <div className="mt-4 flex justify-between">

                    <button
                        onClick={onClose}
                        className="ml-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                    >
                        Untrack
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
