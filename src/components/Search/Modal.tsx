import React from 'react';

const Modal = ({ isOpen, onClose, hit }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg max-w-lg mx-auto shadow-lg relative">
                {/* Close button */}
                <button
                    className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
                    onClick={onClose}
                >
                    &times;
                </button>
                {/* Modal Content */}
                <img
                    src={hit.thumbnail || 'default-thumbnail.jpg'}
                    alt={hit['title from colenda']}
                    className="w-full h-64 object-cover rounded"
                />
                <h2 className="text-xl font-semibold mt-4">{hit['title from colenda']}</h2>
                <p className="text-gray-600 mt-2">{hit.description}</p>
                {/* Additional Info */}
                <div className="mt-4">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {hit.object_type}
          </span>
                    {hit.geography && (
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {hit.geography}
            </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;