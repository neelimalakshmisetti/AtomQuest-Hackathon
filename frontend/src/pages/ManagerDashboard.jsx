import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { LogOut, CheckCircle, XCircle, Users } from 'lucide-react';

const ManagerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [comment, setComment] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const fetchTeamGoals = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/goals`, { headers: { Authorization: `Bearer ${user.token}` } });
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeamGoals();
  }, []);

  const handleStatusChange = async (id, status) => {
    if (status === 'Rejected' && (!comment || selectedGoalId !== id)) {
        setSelectedGoalId(id);
        return; // wait for comment
    }
    
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/goals/${id}/status`, { status, managerComment: comment }, { headers: { Authorization: `Bearer ${user.token}` } });
      setComment('');
      setSelectedGoalId(null);
      fetchTeamGoals();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const pendingGoals = goals.filter(g => g.status === 'Pending Approval');
  const otherGoals = goals.filter(g => g.status !== 'Pending Approval' && g.status !== 'Draft');

  const displayGoals = activeTab === 'Pending' ? pendingGoals : otherGoals;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary flex items-center"><Users className="mr-2" /> Manager Portal</h1>
        <div className="flex items-center space-x-4">
          <span className="text-slate-600 font-medium">{user.name}</span>
          <button onClick={logout} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><LogOut size={20} /></button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto mt-8 px-4">
        
        <div className="flex space-x-4 border-b border-slate-200 mb-6">
            <button onClick={() => setActiveTab('Pending')} className={`py-3 px-4 font-medium transition-colors border-b-2 ${activeTab === 'Pending' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                Pending Approvals ({pendingGoals.length})
            </button>
            <button onClick={() => setActiveTab('All')} className={`py-3 px-4 font-medium transition-colors border-b-2 ${activeTab === 'All' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                Team Goals Overview
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayGoals.map(goal => (
            <div key={goal._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold text-lg text-slate-800">{goal.title}</h4>
                        <p className="text-xs text-primary font-medium">{goal.employeeId?.name || 'Employee'}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${goal.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        goal.status === 'Pending Approval' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'}`}>
                        {goal.status}
                    </span>
                </div>
                
                <p className="text-slate-500 text-sm mb-4 bg-slate-50 p-3 rounded-lg flex-grow">{goal.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div><span className="text-slate-500 block text-xs">Target</span><span className="font-semibold text-slate-800">{goal.target} {goal.uomType === 'Percentage' ? '%' : ''}</span></div>
                    <div><span className="text-slate-500 block text-xs">Weightage</span><span className="font-semibold text-slate-800">{goal.weightage}%</span></div>
                </div>

                {activeTab === 'Pending' && selectedGoalId === goal._id && (
                    <div className="mb-4 animate-fade-in-up">
                        <textarea 
                            placeholder="Add reason for rejection..." 
                            className="w-full text-sm p-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                            <button onClick={() => setSelectedGoalId(null)} className="px-3 py-1 text-sm text-slate-500 hover:bg-slate-100 rounded">Cancel</button>
                            <button onClick={() => handleStatusChange(goal._id, 'Rejected')} className="px-3 py-1 text-sm bg-red-500 text-white hover:bg-red-600 rounded shadow">Confirm Reject</button>
                        </div>
                    </div>
                )}

                {activeTab === 'Pending' && selectedGoalId !== goal._id && (
                    <div className="flex justify-end space-x-3 mt-auto pt-4 border-t border-slate-100">
                        <button onClick={() => handleStatusChange(goal._id, 'Rejected')} className="flex items-center text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-medium transition">
                            <XCircle size={18} className="mr-1" /> Reject
                        </button>
                        <button onClick={() => handleStatusChange(goal._id, 'Approved')} className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition shadow">
                            <CheckCircle size={18} className="mr-1" /> Approve
                        </button>
                    </div>
                )}
            </div>
          ))}
          {displayGoals.length === 0 && (
              <div className="col-span-2 text-center py-12 text-slate-400">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-slate-300" />
                  </div>
                  <p>All caught up! No {activeTab === 'Pending' ? 'pending approvals' : 'goals'} found.</p>
              </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
