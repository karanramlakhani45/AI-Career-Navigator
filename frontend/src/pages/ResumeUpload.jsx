import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud } from 'lucide-react';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('SDE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, update the target role
      await api.put('/auth/target-role', { targetRole: role });
      
      // Then upload resume
      const formData = new FormData();
      formData.append('resume', file);
      
      await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update local user state if needed (or refetch profile on dashboard)
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Upload Your Resume</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6">{error}</div>}
        
        <form onSubmit={handleUpload} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Target Role</label>
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="SDE">Software Development Engineer (SDE)</option>
              <option value="AI/ML">AI / Machine Learning Engineer</option>
              <option value="Data Science">Data Scientist</option>
              <option value="DevOps">DevOps Engineer</option>
              <option value="Cyber Security">Cyber Security Analyst</option>
              <option value="UI/UX">UI/UX Designer</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center hover:border-blue-500 transition-colors">
            <UploadCloud className="mx-auto h-16 w-16 text-slate-400 mb-4" />
            <p className="text-slate-300 mb-2">Drag and drop your resume here, or click to browse</p>
            <p className="text-sm text-slate-500 mb-6">Supported formats: PDF, DOCX (Max 5MB)</p>
            <input 
              type="file" 
              id="resume" 
              className="hidden" 
              accept=".pdf,.docx" 
              onChange={handleFileChange} 
            />
            <label 
              htmlFor="resume" 
              className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Select File
            </label>
            {file && <p className="mt-4 text-emerald-400">Selected: {file.name}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading || !file}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              loading || !file 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
            }`}
          >
            {loading ? 'Analyzing with AI...' : 'Analyze Resume'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeUpload;
