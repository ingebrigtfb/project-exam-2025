import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

const MyVenueCard = ({ venue, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const imageUrl =
    Array.isArray(venue.media) &&
    venue.media.length > 0 &&
    venue.media[0]?.url &&
    venue.media[0].url.trim() !== ''
      ? venue.media[0].url
      : 'https://placehold.co/300x200?text=No+Image';

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/profile/edit-venue/${venue.id}`);
  };

  const handleDelete = (e) => {
    if (e) e.stopPropagation();
    setDeleteLoading(true);
    onDelete(venue.id);
    setDeleteLoading(false);
    setShowDeleteModal(false);
  };

  const handleShowDeleteModal = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  return (
    <>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Venue"
        message="Are you sure you want to delete this venue? This action cannot be undone."
        itemName={venue.name}
        isLoading={deleteLoading}
      />
    
      <div 
        className="bg-white rounded-lg shadow w-full max-w-[320px] mx-auto min-h-[220px] flex flex-col cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg"
        onClick={() => navigate(`/venues/${venue.id}`, { state: { from: 'profile' } })}
      >
        <div className="relative">
          <img
            src={imageUrl}
            alt={venue.media && venue.media[0]?.alt ? venue.media[0].alt : venue.name} 
            className="rounded-t-md w-full h-42 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              className="bg-white/80 hover:bg-white rounded-full p-2 shadow text-[#0C5560] transition"
              onClick={handleEdit}
              title="Edit venue"
            >
              <FaEdit size={20} />
            </button>
            <button
              className="bg-white/80 hover:bg-white rounded-full p-2 shadow text-red-500 transition"
              onClick={handleShowDeleteModal}
              title="Delete venue"
            >
              <FaTrash size={20} />
            </button>
          </div>
        </div>
        <div className="p-3 flex flex-col flex-1">
          <h3 className="font-semibold text-sm mb-1 truncate">{venue.name}</h3>
          <p className="text-xs text-gray-600 mb-3 overflow-hidden text-ellipsis line-clamp-3">
            {venue.description}
          </p>
          <div className="mt-auto text-right">
            <span className="text-[#0C5560] font-semibold">${venue.price}</span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>
        </div>
      </div>
    </>
  );
};

MyVenueCard.propTypes = {
  venue: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default MyVenueCard; 