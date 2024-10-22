import React, { useState } from 'react';
import Modal from './Modal';

const Hit = ({ hit }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div
                onClick={handleOpenModal}
                className="max-w-sm rounded overflow-hidden shadow-lg bg-white cursor-pointer"
            >
                <img
                    src={hit.thumbnail || 'default-thumbnail.jpg'}
                    alt={hit['title from colenda'] || 'No title available'}
                    className="w-full h-48 object-cover"
                />
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">
                        <Highlight attribute="title from colenda" hit={hit} />
                    </div>
                    <p className="text-gray-700 text-base">
                        <Snippet hit={hit} attribute="Description" />
                    </p>
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} hit={hit} />
        </>
    );
};

export default Hit;