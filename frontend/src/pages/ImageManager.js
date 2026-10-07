import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Upload, Trash2, Copy, Image as ImageIcon, Check, AlertCircle, FolderInput, CheckSquare, Square } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORIES = [
  { value: 'hero', label: 'Hero-Bild' },
  { value: 'hotels', label: 'Hotels' },
  { value: 'distilleries', label: 'Destillerien' },
  { value: 'itinerary', label: 'Reiseroute' },
  { value: 'other', label: 'Sonstiges' }
];

const ImageManager = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadCategory, setUploadCategory] = useState('other');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [bulkCategory, setBulkCategory] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === selectedCategory));
    }
  }, [selectedCategory, images]);

  const fetchImages = async () => {
    try {
      const token = sessionStorage.getItem('hbh_admin_token');
      const response = await axios.get(`${API}/admin/images`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setImages(response.data);
      setFilteredImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Validate all files first
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        alert(`${file.name}: Nur Bilder erlaubt (JPG, PNG, GIF, WEBP)`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name}: Datei zu groß. Maximal 5MB erlaubt.`);
        return;
      }
    }

    setUploading(true);
    setUploadProgress(`Lade ${files.length} Bild(er) hoch...`);

    const token = sessionStorage.getItem('hbh_admin_token');
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', uploadCategory);

      try {
        await axios.post(`${API}/admin/images/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        successCount++;
        setUploadProgress(`${successCount}/${files.length} erfolgreich hochgeladen...`);
      } catch (error) {
        console.error('Upload error:', error);
        failCount++;
      }
    }

    if (failCount === 0) {
      setUploadProgress(`✓ Alle ${successCount} Bilder erfolgreich hochgeladen!`);
    } else {
      setUploadProgress(`⚠ ${successCount} erfolgreich, ${failCount} fehlgeschlagen`);
    }
    
    setTimeout(() => setUploadProgress(''), 3000);
    fetchImages();
    event.target.value = '';
    setUploading(false);
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Bild wirklich löschen?')) return;

    try {
      const token = sessionStorage.getItem('hbh_admin_token');
      await axios.delete(`${API}/admin/images/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchImages();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Löschen fehlgeschlagen');
    }
  };

  const handleSeedExistingImages = async () => {
    if (!window.confirm('24 bestehende Bilder aus dem Code in den Manager importieren?')) return;

    setSeeding(true);
    const token = sessionStorage.getItem('hbh_admin_token');

    try {
      const response = await axios.post(`${API}/admin/images/seed-existing`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(`✅ ${response.data.message}`);
      fetchImages();
    } catch (error) {
      // Fallback: If backend endpoint doesn't exist, show helpful message
      if (error.response?.status === 405 || error.response?.status === 404) {
        alert('⚠️ Seed-Endpoint noch nicht deployed.\n\nDie Bilder funktionieren bereits auf der Website.\nSie können neue Bilder hochladen - der Import ist optional.');
      } else {
        console.error('Seed error:', error);
        alert('❌ Import fehlgeschlagen');
      }
    } finally {
      setSeeding(false);
    }
  };

  // Bulk operations
  const toggleImageSelection = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(img => img.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    if (!window.confirm(`${selectedImages.length} Bild(er) wirklich löschen?`)) return;

    const token = sessionStorage.getItem('hbh_admin_token');
    let successCount = 0;

    for (const imageId of selectedImages) {
      try {
        await axios.delete(`${API}/admin/images/${imageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        successCount++;
      } catch (error) {
        console.error('Delete error:', error);
      }
    }

    alert(`✅ ${successCount} von ${selectedImages.length} Bild(ern) gelöscht`);
    setSelectedImages([]);
    fetchImages();
  };

  const handleBulkCategoryChange = async () => {
    if (selectedImages.length === 0 || !bulkCategory) return;
    if (!window.confirm(`${selectedImages.length} Bild(er) zur Kategorie "${CATEGORIES.find(c => c.value === bulkCategory)?.label}" verschieben?`)) return;

    const token = sessionStorage.getItem('hbh_admin_token');
    let successCount = 0;

    for (const imageId of selectedImages) {
      try {
        await axios.patch(`${API}/admin/images/${imageId}/category`, 
          { category: bulkCategory },
          { headers: { Authorization: `Bearer ${token}` }}
        );
        successCount++;
      } catch (error) {
        console.error('Category update error:', error);
      }
    }

    alert(`✅ ${successCount} von ${selectedImages.length} Bild(ern) verschoben`);
    setSelectedImages([]);
    setBulkCategory('');
    fetchImages();
  };


  const copyToClipboard = (imageId) => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/images/${imageId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(imageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1D1D1D] mb-2">Bilder-Manager</h1>
            <p className="text-[#5A544C]">Verwalten Sie Bilder für Hotels, Destillerien und Hero-Section</p>
          </div>
          
          {/* Seed Button */}
          <Button
            onClick={handleSeedExistingImages}
            disabled={seeding || uploading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            {seeding ? 'Importiere...' : 'Code-Bilder importieren'}
          </Button>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl p-6 border border-[#E6DEC8] mb-8">
          <h2 className="text-xl font-bold text-[#1D1D1D] mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#74CF6C]" />
            Neues Bild hochladen
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#5A544C] mb-2">
                Kategorie
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full px-4 py-2 border border-[#E6DEC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74CF6C]"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5A544C] mb-2">
                Datei(en) auswählen (Mehrfachauswahl möglich)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full px-4 py-2 border border-[#E6DEC8] rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#74CF6C] file:text-white file:cursor-pointer hover:file:bg-[#5eb556]"
              />
            </div>
          </div>

          {uploadProgress && (
            <div className={`mt-4 p-3 rounded-lg ${uploadProgress.includes('✓') ? 'bg-green-50 text-green-700' : uploadProgress.includes('✗') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
              {uploadProgress}
            </div>
          )}

          <p className="text-xs text-[#5A544C] mt-3">
            Erlaubte Formate: JPG, PNG, GIF, WEBP • Maximale Größe: 5MB
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl p-4 border border-[#E6DEC8] mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#74CF6C] text-white'
                  : 'bg-gray-100 text-[#5A544C] hover:bg-gray-200'
              }`}
            >
              Alle ({images.length})
            </button>
            {CATEGORIES.map(cat => {
              const count = images.filter(img => img.category === cat.value).length;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-[#74CF6C] text-white'
                      : 'bg-gray-100 text-[#5A544C] hover:bg-gray-200'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedImages.length > 0 && (
          <div className="bg-[#74CF6C] text-white rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">{selectedImages.length} Bild(er) ausgewählt</span>
              <Button
                onClick={() => setSelectedImages([])}
                variant="outline"
                size="sm"
                className="bg-white text-[#74CF6C] hover:bg-gray-100"
              >
                Auswahl aufheben
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className="px-3 py-2 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="">Kategorie ändern...</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value} className="text-[#1D1D1D]">{cat.label}</option>
                ))}
              </select>
              <Button
                onClick={handleBulkCategoryChange}
                disabled={!bulkCategory}
                size="sm"
                className="bg-white text-[#74CF6C] hover:bg-gray-100 flex items-center gap-2"
              >
                <FolderInput className="w-4 h-4" />
                Verschieben
              </Button>
              <Button
                onClick={handleBulkDelete}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Löschen
              </Button>
            </div>
          </div>
        )}

        {/* Gallery */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#5A544C]">Lade Bilder...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#E6DEC8]">
            <ImageIcon className="w-16 h-16 text-[#E6DEC8] mx-auto mb-4" />
            <p className="text-[#5A544C]">Keine Bilder gefunden</p>
          </div>
        ) : (
          <>
            {/* Select All Button */}
            <div className="mb-4 flex items-center justify-between">
              <Button
                onClick={toggleSelectAll}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {selectedImages.length === filteredImages.length ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                {selectedImages.length === filteredImages.length ? 'Alle abwählen' : 'Alle auswählen'}
              </Button>
              <span className="text-sm text-[#5A544C]">
                {filteredImages.length} Bild(er) in dieser Ansicht
              </span>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map(image => (
              <div key={image.id} className={`bg-white rounded-xl border-2 overflow-hidden hover:shadow-lg transition-all ${selectedImages.includes(image.id) ? 'border-[#74CF6C] ring-2 ring-[#74CF6C]/30' : 'border-[#E6DEC8]'}`}>
                {/* Image Preview */}
                <div className="relative h-48 bg-gray-100">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleImageSelection(image.id)}
                    className="absolute top-2 left-2 z-10 w-6 h-6 bg-white rounded flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    {selectedImages.includes(image.id) ? (
                      <CheckSquare className="w-5 h-5 text-[#74CF6C]" />
                    ) : (
                      <Square className="w-5 h-5 text-[#5A544C]" />
                    )}
                  </button>
                  
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/api/images/${image.id}`}
                    alt={image.original_filename}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EBild nicht verfügbar%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-[#74CF6C] text-white text-xs px-2 py-1 rounded">
                      {CATEGORIES.find(c => c.value === image.category)?.label || image.category}
                    </span>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-4">
                  <p className="text-sm font-medium text-[#1D1D1D] truncate mb-1">
                    {image.original_filename}
                  </p>
                  <p className="text-xs text-[#5A544C] mb-2">
                    {formatFileSize(image.size)} • {formatDate(image.created_at)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(image.id)}
                      className="flex-1 text-xs"
                    >
                      {copiedId === image.id ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Kopiert
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          URL
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(image.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ImageManager;
