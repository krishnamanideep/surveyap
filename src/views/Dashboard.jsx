import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/SurveyContext';
import {
    Users,
    MapPin,
    FileCheck,
    TrendingUp,
    Activity,
    AlertCircle,
    Download
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Dynamic data parsing integrated directly 

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="card group">
        <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-slate-500">{title}</div>
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:scale-110 group-hover:bg-brand-100 transition-all duration-300">
                <Icon size={20} />
            </div>
        </div>
        <div className="text-3xl font-bold text-slate-800 tracking-tight mb-2">{value}</div>
        <div className={`text-xs font-semibold flex items-center gap-1 ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
            <span>{trend === 'up' ? '↑' : '↓'} {change}</span>
            <span className="text-slate-400 font-medium">vs last week</span>
        </div>
    </div>
);

export default function Dashboard() {
    const [isExporting, setIsExporting] = useState(false);
    const { currentUser } = useAuth();
    const { surveys } = useData();
    const isAdmin = currentUser?.role === 'admin';

    // Dynamic stats compilation
    const roleSurveys = isAdmin ? surveys : surveys.filter(s => s.submitter === currentUser?.name);

    // Numbers
    const totalSurveys = roleSurveys.length;
    const verifiedSurveys = roleSurveys.filter(s => s.status === 'approved').length;
    const pendingChecks = roleSurveys.filter(s => s.status === 'pending').length;
    const activeRegions = new Set(roleSurveys.map(s => s.region).filter(Boolean)).size;

    // Regions Chart Data
    const regionCounts = roleSurveys.reduce((acc, curr) => {
        if (curr.region) acc[curr.region] = (acc[curr.region] || 0) + 1;
        return acc;
    }, {});
    const dynamicRegionData = Object.entries(regionCounts).map(([name, amount]) => ({ name, amount }));

    // Historical Chart Data (Aggregated by Date)
    const dateCounts = roleSurveys.reduce((acc, curr) => {
        const d = curr.date.substring(5); // e.g. "11-20"
        if (!acc[d]) acc[d] = { name: d, surveys: 0, verified: 0 };
        acc[d].surveys += 1;
        if (curr.status === 'approved') acc[d].verified += 1;
        return acc;
    }, {});
    const dynamicSurveyData = Object.values(dateCounts)
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(-7); // Last 7 days 

    const handleExport = () => {
        setIsExporting(true);
        // Simulate generation delay
        setTimeout(() => {
            const csvContent = "data:text/csv;charset=utf-8,"
                + "ID,Name,Role,Date,Status,Region\n"
                + roleSurveys.map(e => `${e.id},${e.name},${e.role},${e.date},${e.status},${e.region || 'N/A'}`).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "survey_report.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsExporting(false);
        }, 800);
    };

    return (
        <div className="flex flex-col gap-6 lg:gap-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 p-1">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">
                        {isAdmin ? 'Real-Time Analytics' : `Welcome back, ${currentUser?.name.split(' ')[0]}`}
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        {isAdmin ? 'Monitor survey progress and field officer performance.' : 'Here is your daily survey activity summary.'}
                    </p>
                </div>
                <button
                    className="btn btn-primary shadow-lg shadow-brand-500/20 w-fit"
                    onClick={handleExport}
                    disabled={isExporting}
                >
                    {isExporting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Download size={18} />
                    )}
                    <span>{isExporting ? 'Exporting...' : 'Export Report CSV'}</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
                <StatCard
                    title={isAdmin ? "Total Surveys" : "My Total Surveys"}
                    value={totalSurveys.toString()}
                    change="2"
                    icon={Users}
                    trend="up"
                />
                <StatCard
                    title={isAdmin ? "Verified Entries" : "Approved Submissions"}
                    value={verifiedSurveys.toString()}
                    change="3"
                    icon={FileCheck}
                    trend="up"
                />
                {isAdmin && (
                    <>
                        <StatCard title="Active Regions" value={activeRegions.toString()} change="1" icon={MapPin} trend="up" />
                        <StatCard title="Pending Checks" value={pendingChecks.toString()} change="4" icon={AlertCircle} trend="down" />
                    </>
                )}
            </div>

            {/* Charts section */}
            <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
                <div className={`card ${isAdmin ? 'lg:col-span-2' : 'lg:col-span-2'} flex flex-col min-h-[400px]`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-bold text-slate-800">
                            {isAdmin ? 'Global Survey Activity' : 'My Survey Submissions'}
                        </h3>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Activity size={18} /></div>
                    </div>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dynamicSurveyData.length ? dynamicSurveyData : [{ name: 'Today', surveys: 0 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSurveys" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="surveys" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSurveys)" activeDot={{ r: 6, strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {isAdmin && (
                    <div className="card flex flex-col min-h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-base font-bold text-slate-800">Region Distribution</h3>
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><TrendingUp size={18} /></div>
                        </div>
                        <div className="flex-1 w-full min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dynamicRegionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                    <RechartsTooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="amount" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* Map Section */}
            {isAdmin && (
                <div className="card flex flex-col min-h-[450px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-bold text-slate-800">Geographical Survey Distribution</h3>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><MapPin size={18} /></div>
                    </div>
                    <div className="flex-1 w-full rounded-xl overflow-hidden border border-slate-200 z-0">
                        <MapContainer center={[22.5937, 78.9629]} zoom={4} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            />
                            {roleSurveys.filter(s => s.location).map(survey => (
                                <Marker key={survey.id} position={[survey.location.lat, survey.location.lng]}>
                                    <Popup>
                                        <div className="text-xs font-semibold text-slate-800">{survey.name}</div>
                                        <div className="text-xs text-slate-500">{survey.id} - {survey.status.replace('_', ' ').toUpperCase()}</div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            )}

        </div>
    );
}
