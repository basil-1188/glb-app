import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [models, setModels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/models`);
      setModels(response.data);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      setFile(null);
      return;
    }
    setError('');
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('model', file);
    formData.append('name', file.name);

    try {
      setIsUploading(true);
      setError('');
      await axios.post('http://localhost:5000/api/models', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFile(null);
      fetchModels();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleModelClick = (modelId) => {
    navigate(`/viewer/${modelId}`);
  };

  return (
    <div className="dashboard">
      <h1>3D Model Dashboard</h1>
      
      <div className="upload-section">
        <label className="file-choose-btn">
          Choose File
          <input 
            type="file" 
            accept=".glb" 
            onChange={handleFileChange} 
            hidden 
          />
        </label>
        {file && (
          <button 
            onClick={handleUpload} 
            className="upload-btn" 
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        )}
      </div>
      
      {file && (
        <div className="file-info">
          Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}
      
      {error && <div className="error">{error}</div>}
      
      <div className="models-list">
        <h2>Your Models</h2>
        {models.length === 0 ? (
          <p>No models uploaded yet</p>
        ) : (
          <ul>
            {models.map(model => (
              <li 
                key={model._id} 
                className="model-item"
                onClick={() => handleModelClick(model._id)}
              >
                {model.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
