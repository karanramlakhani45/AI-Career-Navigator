import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/resume/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}</h1>
        {!profile && (
          <Link to="/resume" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Upload Resume
          </Link>
        )}
      </div>

      {!profile ? (
        <div className="bg-slate-800 p-8 rounded-xl text-center border border-slate-700">
          <p className="text-slate-400 mb-4">You haven't uploaded a resume yet to analyze your skill gaps.</p>
          <Link to="/resume" className="text-blue-400 hover:underline">Go to Resume Upload</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">ATS Score</h3>
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-blue-500 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">{profile.atsScore}</span>
              </div>
            </div>
            <p className="text-center mt-4 text-slate-400">Out of 100</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">Skill Analysis</h3>
            <div className="mb-6">
              <h4 className="text-emerald-400 font-semibold mb-2">Matched Skills</h4>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm border border-emerald-500/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-red-400 font-semibold mb-2">Missing Skills</h4>
              <div className="flex flex-wrap gap-2">
                {profile.missingSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm border border-red-500/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-8">
              <Link to="/roadmap" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                View AI Roadmap
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
