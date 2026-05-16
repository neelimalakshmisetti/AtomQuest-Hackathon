import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { PlusCircle, Send, LogOut, CheckCircle2 } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', thrustArea: 'Financial', uomType: 'Percentage', target: '', weightage: '' });

  const fetchGoals = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/goals', { headers: { Authorization: `Bearer ${user.token}` } });
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const totalWeightage = goals.reduce((sum, g) => sum + (g.status === 'Draft' || g.status === 'Rejected' ? g.weightage : 0), 0);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/goals', newGoal, { headers: { Authorization: `Bearer ${user.token}` } });
      setShowForm(false);
      setNewGoal({ title: '', description: '', thrustArea: 'Financial', uomType: 'Percentage', target: '', weightage: '' });
      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating goal');
    }
  };

  const handleSubmitGoals = async () => {
    try {
      await axios.post('http://localhost:5000/api/goals/submit', {}, { headers: { Authorization: `Bearer ${user.token}` } });
      alert('Goals submitted successfully!');
      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting goals');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">Employee Portal</h1>
        <div className="flex items-center space-x-4">
          <span className="text-slate-600 font-medium">{user.name}</span>
          <button onClick={logout} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><LogOut size={20} /></button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto mt-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">My Goals</h2>
          <div className="space-x-3">
            <button onClick={() => setShowForm(!showForm)} className="bg-white text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center shadow-sm">
              <PlusCircle size={18} className="mr-2" /> Add Goal
            </button>
            <button onClick={handleSubmitGoals} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors shadow flex items-center">
              <Send size={18} className="mr-2" /> Submit for Approval
            </button>
          </div>
        </div>

        {/* Total Weightage Indicator */}
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Draft Goals Weightage:</span>
            <div className="flex items-center space-x-2">
                <span className={`text-xl font-bold ${totalWeightage === 100 ? 'text-green-500' : 'text-amber-500'}`}>{totalWeightage}%</span>
                {totalWeightage === 100 && <CheckCircle2 className="text-green-500" size={20} />}
            </div>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mb-8 animate-fade-in-up">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Create New Goal</h3>
            <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input required type="text" className="w-full px-3 py-2 border rounded-lg" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Thrust Area</label>
                <select className="w-full px-3 py-2 border rounded-lg" value={newGoal.thrustArea} onChange={e => setNewGoal({...newGoal, thrustArea: e.target.value})}>
                  <option>Financial</option>
                  <option>Customer</option>
                  <option>Internal Process</option>
                  <option>Learning & Growth</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea required className="w-full px-3 py-2 border rounded-lg" value={newGoal.description} onChange={e => setNewGoal({...newGoal, description: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">UoM Type</label>
                <select className="w-full px-3 py-2 border rounded-lg" value={newGoal.uomType} onChange={e => setNewGoal({...newGoal, uomType: e.target.value})}>
                  <option>Percentage</option>
                  <option>Numeric</option>
                  <option>Timeline</option>
                  <option>Zero-based</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target</label>
                <input required type="number" className="w-full px-3 py-2 border rounded-lg" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Weightage (%)</label>
                <input required type="number" min="10" max="100" className="w-full px-3 py-2 border rounded-lg" value={newGoal.weightage} onChange={e => setNewGoal({...newGoal, weightage: Number(e.target.value)})} />
              </div>
              <div className="md:col-span-2 flex justify-end mt-2">
                <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-secondary shadow transition">Save Draft</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map(goal => (
            <div key={goal._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg text-slate-800">{goal.title}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${goal.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        goal.status === 'Pending Approval' ? 'bg-amber-100 text-amber-700' : 
                        goal.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-slate-100 text-slate-700'}`}>
                        {goal.status}
                    </span>
                </div>
                <p className="text-slate-500 text-sm mb-4 flex-grow">{goal.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg">
                    <div><span className="text-slate-500 block text-xs">Target</span><span className="font-semibold text-slate-800">{goal.target} {goal.uomType === 'Percentage' ? '%' : ''}</span></div>
                    <div><span className="text-slate-500 block text-xs">Weightage</span><span className="font-semibold text-slate-800">{goal.weightage}%</span></div>
                </div>
                {goal.status === 'Rejected' && goal.managerComment && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                        <strong>Manager's Feedback:</strong> {goal.managerComment}
                    </div>
                )}
            </div>
          ))}
          {goals.length === 0 && !showForm && (
              <div className="col-span-2 text-center py-12 text-slate-400">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PlusCircle size={32} className="text-slate-300" />
                  </div>
                  <p>No goals yet. Create one to get started.</p>
              </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
