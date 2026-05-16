import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { LogOut, Settings, Users, Activity, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Overview');
  const [config, setConfig] = useState(null);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ approved: 0, pending: 0, rejected: 0, draft: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const configRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/config`, { headers: { Authorization: `Bearer ${user.token}` } });
      setConfig(configRes.data);

      const logsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/audit-logs`, { headers: { Authorization: `Bearer ${user.token}` } });
      setLogs(logsRes.data);

      const goalsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/goals`, { headers: { Authorization: `Bearer ${user.token}` } });
      const goals = goalsRes.data;
      
      let approved = 0, pending = 0, rejected = 0, draft = 0;
      goals.forEach(g => {
        if (g.status === 'Approved') approved++;
        else if (g.status === 'Pending Approval') pending++;
        else if (g.status === 'Rejected') rejected++;
        else draft++;
      });
      setStats({ approved, pending, rejected, draft });
    } catch (err) {
      console.error('Error fetching admin data', err);
    }
  };

  const handleCycleChange = async (newCycle) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/config`, { currentCycle: newCycle }, { headers: { Authorization: `Bearer ${user.token}` } });
      fetchData();
      alert('Cycle updated successfully');
    } catch (err) {
      alert('Error updating cycle');
    }
  };

  const chartData = [
    { name: 'Approved', count: stats.approved, fill: '#10b981' },
    { name: 'Pending', count: stats.pending, fill: '#f59e0b' },
    { name: 'Rejected', count: stats.rejected, fill: '#ef4444' },
    { name: 'Drafts', count: stats.draft, fill: '#64748b' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl">
        <div className="p-6">
            <h2 className="text-2xl font-bold flex items-center"><Settings className="mr-2" /> Admin</h2>
            <p className="text-slate-400 text-sm mt-1">{user.name}</p>
        </div>
        <nav className="flex-grow mt-6">
            <button onClick={() => setActiveTab('Overview')} className={`w-full flex items-center px-6 py-3 transition-colors ${activeTab === 'Overview' ? 'bg-primary border-r-4 border-white' : 'hover:bg-slate-800'}`}>
                <Activity size={18} className="mr-3" /> Dashboard
            </button>
            <button onClick={() => setActiveTab('Settings')} className={`w-full flex items-center px-6 py-3 transition-colors ${activeTab === 'Settings' ? 'bg-primary border-r-4 border-white' : 'hover:bg-slate-800'}`}>
                <Settings size={18} className="mr-3" /> System Cycle
            </button>
            <button onClick={() => setActiveTab('Logs')} className={`w-full flex items-center px-6 py-3 transition-colors ${activeTab === 'Logs' ? 'bg-primary border-r-4 border-white' : 'hover:bg-slate-800'}`}>
                <FileText size={18} className="mr-3" /> Audit Logs
            </button>
        </nav>
        <div className="p-4">
            <button onClick={logout} className="w-full flex items-center justify-center bg-slate-800 hover:bg-red-600 text-white py-2 rounded-lg transition-colors">
                <LogOut size={18} className="mr-2" /> Sign Out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">{activeTab}</h1>

        {activeTab === 'Overview' && (
            <div className="space-y-8 animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-green-500">
                        <p className="text-sm text-slate-500 font-medium mb-1">Approved Goals</p>
                        <h3 className="text-3xl font-bold text-slate-800">{stats.approved}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-amber-500">
                        <p className="text-sm text-slate-500 font-medium mb-1">Pending Approvals</p>
                        <h3 className="text-3xl font-bold text-slate-800">{stats.pending}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-red-500">
                        <p className="text-sm text-slate-500 font-medium mb-1">Rejected</p>
                        <h3 className="text-3xl font-bold text-slate-800">{stats.rejected}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-slate-500">
                        <p className="text-sm text-slate-500 font-medium mb-1">Drafts</p>
                        <h3 className="text-3xl font-bold text-slate-800">{stats.draft}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Goal Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}

        {activeTab === 'Settings' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-xl animate-fade-in-up">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Cycle Management</h3>
                <p className="text-slate-500 mb-6">Control the active phase of the performance management system. This restricts what actions employees and managers can take.</p>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                        <span className="font-semibold text-slate-700">Current Phase:</span>
                        <span className="px-3 py-1 bg-primary text-white text-sm rounded-full font-medium">{config?.currentCycle || 'Loading...'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {['Goal Setting', 'Q1', 'Q2', 'Q3', 'Q4'].map(cycle => (
                            <button 
                                key={cycle}
                                onClick={() => handleCycleChange(cycle)}
                                className={`py-2 px-4 rounded-lg font-medium transition ${config?.currentCycle === cycle ? 'bg-primary text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                Switch to {cycle}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'Logs' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Entity Type</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200 text-sm text-slate-700">
                        {logs.map(log => (
                            <tr key={log._id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-primary">{log.action}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{log.performedBy?.name || 'System'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{log.entityType}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && <div className="p-6 text-center text-slate-500">No logs found.</div>}
            </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
