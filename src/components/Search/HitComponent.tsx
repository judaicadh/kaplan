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
                className="max-w-sm cursor-pointer overflow-hidden rounded bg-white shadow-lg"
            >
                <img
                    src={hit.thumbnail || 'default-thumbnail.jpg'}
                    alt={hit['title from colenda'] || 'No title available'}
                    className="h-48 w-full object-cover"
                />
                <div className="px-6 py-4">
                    <div className="mb-2 text-xl font-bold">
                        <Highlight attribute="title from colenda" hit={hit} />
                    </div>
                    <p className="text-base text-gray-700">
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