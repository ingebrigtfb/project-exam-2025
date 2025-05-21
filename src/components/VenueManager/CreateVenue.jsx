import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaStar, FaRegStar, FaArrowLeft } from 'react-icons/fa';

const placeholderImg = 'https://placehold.co/800x400?text=Venue+Image';

export default function CreateVenue() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    media: [],
    price: '',
    maxGuests: '',
    rating: 0,
    meta: { wifi: false, parking: false, breakfast: false, pets: false },
    location: { address: '', city: '', zip: '', country: '' },
  });
  const [showImageFields, setShowImageFields] = useState(false);
  const [newImage, setNewImage] = useState({ url: '', alt: '' });
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Add image to media array
  const handleAddImage = () => {
    if (!newImage.url) return;
    setForm((prev) => {
      const updated = { ...prev, media: [...prev.media, { ...newImage }] };
      setSelectedImgIdx(updated.media.length - 1);
      return updated;
    });
    setNewImage({ url: '', alt: '' });
    setShowImageFields(false);
  };

  // Remove image from media array
  const handleRemoveImage = () => {
    setForm((prev) => {
      const newMedia = prev.media.filter((_, i) => i !== selectedImgIdx);
      let newIdx = selectedImgIdx;
      if (newIdx > 0) newIdx--;
      setSelectedImgIdx(newIdx);
      return { ...prev, media: newMedia };
    });
  };

  // Star rating logic
  const handleStarClick = (idx) => {
    setForm({ ...form, rating: idx + 1 });
  };
  const handleStarHover = (idx) => {
    setForm((prev) => ({ ...prev, hoverRating: idx + 1 }));
  };
  const handleStarLeave = () => {
    setForm((prev) => ({ ...prev, hoverRating: undefined }));
  };

  // Handle all other field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in form.meta) {
      setForm({ ...form, meta: { ...form.meta, [name]: checked } });
    } else if (name in form.location) {
      setForm({ ...form, location: { ...form.location, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch('https://v2.api.noroff.dev/holidaze/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
          'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          media: form.media,
          price: Number(form.price),
          maxGuests: Number(form.maxGuests),
          rating: form.rating,
          meta: form.meta,
          location: form.location,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errors?.[0]?.message || 'Failed to create venue');
      }
      setSuccess(true);
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Venue preview helpers
  const previewImg = form.media[selectedImgIdx]?.url || placeholderImg;
  const previewAlt = form.media[selectedImgIdx]?.alt || 'Venue preview';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to profile button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-[#0C5560] hover:text-[#094147] transition-colors"
          >
            <FaArrowLeft />
            <span>Back to profile</span>
          </button>
        </div>

        {/* Image Carousel/Area */}
        <div className="mb-8 relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border">
          <img
            src={previewImg}
            alt={previewAlt}
            className="object-cover w-full h-full"
            onError={e => { e.target.src = placeholderImg; }}
          />
          {/* Plus and Trash icons at top right */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              className="bg-white/80 hover:bg-white rounded-full p-2 shadow text-[#0C5560]"
              onClick={() => setShowImageFields(true)}
              type="button"
              title="Add image"
            >
              <FaPlus size={24} />
            </button>
            {form.media.length > 0 && (
              <button
                className="bg-white/80 hover:bg-white rounded-full p-2 shadow text-red-500"
                onClick={handleRemoveImage}
                type="button"
                title="Delete selected image"
              >
                <FaTrash size={24} />
              </button>
            )}
          </div>
          {/* Thumbnails row at bottom */}
          {form.media.length > 0 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-white/70 rounded-lg px-2 py-1">
              {form.media.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`w-16 h-12 rounded border-2 ${selectedImgIdx === idx ? 'border-[#0C5560]' : 'border-transparent'} overflow-hidden focus:outline-none`}
                  onClick={() => setSelectedImgIdx(idx)}
                  title={img.alt || `Image ${idx + 1}`}
                >
                  <img
                    src={img.url || placeholderImg}
                    alt={img.alt || `Image ${idx + 1}`}
                    className="object-cover w-full h-full"
                    onError={e => { e.target.src = placeholderImg; }}
                  />
                </button>
              ))}
            </div>
          )}
          {/* Add image fields overlay */}
          {showImageFields && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
              <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4 w-full max-w-xs">
                <input
                  type="url"
                  placeholder="Image URL"
                  value={newImage.url}
                  onChange={e => setNewImage({ ...newImage, url: e.target.value })}
                  className="border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Alt text (optional)"
                  value={newImage.alt}
                  onChange={e => setNewImage({ ...newImage, alt: e.target.value })}
                  className="border rounded px-3 py-2"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="bg-[#0C5560] text-white px-4 py-2 rounded hover:bg-[#094147] transition"
                    onClick={handleAddImage}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                    onClick={() => setShowImageFields(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Venue Info Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="My cabin in New York" className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Price</label>
                    <input name="price" type="number" min="1" value={form.price} onChange={handleChange} required placeholder="150" className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Max Guests</label>
                    <input name="maxGuests" type="number" min="1" value={form.maxGuests} onChange={handleChange} required placeholder="4" className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Rating</label>
                    <div className="flex items-center gap-1 mt-1">
                      {[0,1,2,3,4].map(idx => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => handleStarClick(idx)}
                          onMouseEnter={() => handleStarHover(idx)}
                          onMouseLeave={handleStarLeave}
                          className="focus:outline-none"
                        >
                          {((form.hoverRating !== undefined ? form.hoverRating : form.rating) > idx)
                            ? <FaStar className="text-yellow-400 w-7 h-7" />
                            : <FaRegStar className="text-yellow-400 w-7 h-7" />}
                        </button>
                      ))}
                      <span className="ml-2 text-gray-500 text-sm">{form.rating || 0}/5</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required placeholder="A cozy cabin in the heart of New York, perfect for a weekend getaway." className="w-full border rounded px-3 py-2 min-h-[80px]" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="wifi" checked={form.meta.wifi} onChange={handleChange} /> Wifi
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="parking" checked={form.meta.parking} onChange={handleChange} /> Parking
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="breakfast" checked={form.meta.breakfast} onChange={handleChange} /> Breakfast
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="pets" checked={form.meta.pets} onChange={handleChange} /> Pets
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-1">Address</label>
                    <input name="address" value={form.location.address} onChange={handleChange} placeholder="123 Main St" className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">City</label>
                    <input name="city" value={form.location.city} onChange={handleChange} placeholder="New York" className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Zip</label>
                    <input name="zip" value={form.location.zip} onChange={handleChange} placeholder="10001" className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Country</label>
                    <input name="country" value={form.location.country} onChange={handleChange} placeholder="USA" className="w-full border rounded px-3 py-2" />
                  </div>
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {success && <div className="text-green-600 text-sm">Venue created! Redirecting...</div>}
                <button type="submit" disabled={loading} className="w-[150px] bg-[#0C5560] text-white py-2 px-4 rounded-md hover:bg-[#094147] transition-colors font-medium text-base disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Venue'}
                </button>
              </form>
            </div>
          </div>

          {/* Venue Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8 z-10">
              <div className="mb-4 text-lg font-semibold text-[#0C5560] text-center">Live venue preview</div>
              <div className="mb-4">
                <div className="w-full aspect-video bg-gray-100 rounded overflow-hidden flex items-center justify-center border mb-4">
                  <img
                    src={previewImg}
                    alt={previewAlt}
                    className="object-cover w-full h-full"
                    onError={e => { e.target.src = placeholderImg; }}
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-[#0C5560]">{form.name || 'Venue Name'}</h2>
                <div className="flex items-center gap-1 text-yellow-400 text-sm mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) =>
                      i < form.rating ? <FaStar key={i} className="w-4 h-4" /> : <FaRegStar key={i} className="w-4 h-4" />
                    )}
                  </div>
                  <span className="ml-1 text-gray-600 font-medium">{form.rating?.toFixed(1) || '0.0'}</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl font-bold text-[#0C5560]">{form.price ? `$${form.price}` : '$0'}</span>
                  <span className="text-gray-600">per night</span>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                  <div><span className="font-medium">Max guests:</span> {form.maxGuests || 0}</div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                  {form.meta.wifi && <span className="bg-gray-100 rounded px-2 py-1">WiFi</span>}
                  {form.meta.parking && <span className="bg-gray-100 rounded px-2 py-1">Parking</span>}
                  {form.meta.breakfast && <span className="bg-gray-100 rounded px-2 py-1">Breakfast</span>}
                  {form.meta.pets && <span className="bg-gray-100 rounded px-2 py-1">Pets</span>}
                </div>
                <div className="text-gray-700 text-sm mt-2">
                  {form.description || 'Venue description will appear here.'}
                </div>
                <div className="mt-4">
                  <div className="font-medium text-gray-700 mb-1">Location</div>
                  <div className="text-xs text-gray-500">
                    {form.location.address && <div>{form.location.address}</div>}
                    {(form.location.city || form.location.zip) && <div>{form.location.city}{form.location.city && form.location.zip ? ', ' : ''}{form.location.zip}</div>}
                    {form.location.country && <div>{form.location.country}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 