import React from 'react';

const Modal = ({ isOpen, onClose, hit }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="relative mx-auto max-w-lg rounded-lg bg-white p-6 shadow-lg">
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
                    className="h-64 w-full rounded object-cover"
                />
                <h2 className="mt-4 text-xl font-semibold">{hit['title from colenda']}</h2>
                <p className="mt-2 text-gray-600">{hit.description}</p>
                {/* Additional Info */}
                <div className="mt-4">
          <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
            {hit.object_type}
          </span>
                    {hit.geography && (
                        <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
              {hit.geography}
            </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;