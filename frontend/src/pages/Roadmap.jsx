import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { BookOpen, CheckCircle } from 'lucide-react';

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const res = await api.get('/roadmap');
      setRoadmap(res.data);
      setLoading(false);
    } catch (err) {
      // If not found, show generate button
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/roadmap/generate');
      setRoadmap(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-2">Your AI Learning Roadmap</h1>
      <p className="text-slate-400 mb-10">Personalized week-by-week plan to bridge your skill gaps.</p>

      {!roadmap ? (
        <div className="bg-slate-800 p-8 rounded-xl text-center border border-slate-700">
          <p className="text-lg text-slate-300 mb-6">You don't have a roadmap yet. Generate one based on your resume analysis.</p>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {generating ? 'AI is Crafting Your Roadmap...' : 'Generate Roadmap'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {roadmap.weeks.map((week, index) => (
            <div key={index} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex gap-6">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold text-xl border border-blue-500/30">
                  W{week.week}
                </div>
                {index !== roadmap.weeks.length - 1 && (
                  <div className="w-1 bg-slate-700 h-full mt-4 rounded"></div>
                )}
              </div>
              <div className="flex-grow pb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{week.title}</h3>
                <p className="text-slate-300 mb-4">{week.description}</p>
                <div className="bg-slate-900 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Recommended Resources
                  </h4>
                  <ul className="space-y-2">
                    {week.resources.map((res, i) => (
                      <li key={i} className="flex items-start gap-2 text-blue-400">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Roadmap;
