import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/SurveyContext';
import {
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Filter,
    Eye,
    Check,
    X,
    ChevronLeft,
    ChevronRight,
    MapPin,
    UserCircle,
    Briefcase
} from 'lucide-react';

export default function VerificationList() {
    const { currentUser } = useAuth();
    const { surveys, updateSurveyStatus } = useData();
    const userRole = currentUser?.role;
    const isReviewer = userRole === 'admin' || userRole === 'regional_manager' || userRole === 'field_manager';
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [reviewComments, setReviewComments] = useState('');
    const itemsPerPage = 5;

    const roleSurveys = useMemo(() => {
        return isReviewer ? surveys : surveys.filter(s => s.submitter === currentUser?.name);
    }, [isReviewer, surveys, currentUser]);

    const canReview = (status) => {
        if (userRole === 'field_manager' && status === 'pending') return true;
        if (userRole === 'regional_manager' && (status === 'fm_approved' || status === 'pending')) return true;
        if (userRole === 'admin' && (status === 'rm_approved' || status === 'fm_approved' || status === 'pending')) return true;
        return false;
    };

    const filteredData = useMemo(() => {
        return roleSurveys.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter, roleSurveys]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatStatus = (status) => {
        switch (status) {
            case 'fm_approved': return 'FM Approved';
            case 'rm_approved': return 'RM Approved';
            case 'queued_offline': return 'Queued Offline';
            default: return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'approved' || status.includes('approved')) return <CheckCircle size={14} />;
        if (status === 'rejected') return <XCircle size={14} />;
        return <Clock size={14} />;
    };

    const getStatusClass = (status) => {
        if (status === 'approved') return 'badge-success';
        if (status === 'fm_approved' || status === 'rm_approved') return 'badge-neutral bg-emerald-50 text-emerald-700 border-emerald-200';
        if (status === 'rejected') return 'badge-error';
        return 'badge-warning';
    };

    const handleViewAction = (survey) => {
        setSelectedSurvey(survey);
    };

    const handleApprove = (id) => {
        let newStatus = 'approved';
        if (userRole === 'field_manager') newStatus = 'fm_approved';
        if (userRole === 'regional_manager') newStatus = 'rm_approved';
        updateSurveyStatus(id, newStatus, currentUser, reviewComments);
        setReviewComments('');
        setSelectedSurvey(null);
    };

    const handleReject = (id) => {
        updateSurveyStatus(id, 'rejected', currentUser, reviewComments);
        setReviewComments('');
        setSelectedSurvey(null);
    };

    return (
        <div className="flex flex-col gap-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">
                    {isReviewer ? 'Verification Workflow' : 'My Submissions'}
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                    {isReviewer ? 'Multi-level verification, approval, and audit trails.' : 'Track the status of your uploaded records.'}
                </p>
            </div>

            <div className="card !p-0 overflow-hidden flex flex-col">

                {/* Controls Bar */}
                {isReviewer && (
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 p-5 border-b border-slate-200 bg-slate-50/50">
                        <div className="relative max-w-md w-full">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by ID or Name..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all shadow-sm"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                    className="appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-9 pr-8 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%224%206%208%2010%2012%206%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[position:right_10px_center] bg-no-repeat"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Survey ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Labour Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tags</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {currentData.length > 0 ? (
                                currentData.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-sm font-medium text-brand-600">{row.id}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-800 text-sm whitespace-nowrap">{row.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{row.role}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{row.date}</td>
                                        <td className="px-6 py-4">
                                            {row.gps ? (
                                                <span className="badge badge-neutral bg-white !text-slate-500">Geo-Tagged</span>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">None</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${getStatusClass(row.status)}`}>
                                                {getStatusIcon(row.status)}
                                                {formatStatus(row.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                                                    title="View Details"
                                                    onClick={() => handleViewAction(row)}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {canReview(row.status) && (
                                                    <>
                                                        <button
                                                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                                            title="Approve"
                                                            onClick={() => handleApprove(row.id)}
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Reject"
                                                            onClick={() => handleReject(row.id)}
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Search size={32} className="text-slate-300 mb-2" />
                                            <p className="font-medium text-slate-600">No records found</p>
                                            <p className="text-sm">Try adjusting your search or filters.</p>
                                            <button className="text-brand-600 font-medium text-sm mt-2 hover:underline" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>Clear Filters</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredData.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
                        <span className="text-sm text-slate-500">
                            Showing <span className="font-medium text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-700">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-medium text-slate-700">{filteredData.length}</span> results
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentPage(idx + 1)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors
                    ${currentPage === idx + 1 ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30' : 'text-slate-600 hover:bg-slate-200'}
                  `}
                                >
                                    {idx + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Details Modal */}
            {selectedSurvey && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                Survey Details
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ml-2 ${getStatusClass(selectedSurvey.status)}`}>
                                    {formatStatus(selectedSurvey.status)}
                                </span>
                            </h3>
                            <button onClick={() => setSelectedSurvey(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-md transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ID</p>
                                    <p className="font-mono text-sm font-medium text-brand-600">{selectedSurvey.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                                    <p className="text-sm font-medium text-slate-800">{selectedSurvey.date}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                                    <UserCircle size={28} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800">{selectedSurvey.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Briefcase size={14} className="text-slate-400" />
                                        <span className="text-sm text-slate-600 font-medium">{selectedSurvey.role}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Metadata</h4>
                                <div className="flex items-center justify-between text-sm py-2 border-b border-slate-50">
                                    <span className="text-slate-500 font-medium flex items-center gap-2"><MapPin size={16} /> Region</span>
                                    <span className="text-slate-800 font-medium">{selectedSurvey.region}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm py-2 border-b border-slate-50">
                                    <span className="text-slate-500 font-medium">GPS Tagged</span>
                                    <span className="text-slate-800 font-medium">{selectedSurvey.gps ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm py-2 border-b border-slate-50">
                                    <span className="text-slate-500 font-medium">Submitter</span>
                                    <span className="text-slate-800 font-medium">{selectedSurvey.submitter}</span>
                                </div>
                            </div>

                            {/* Approval Chain History */}
                            {selectedSurvey.approvalChain?.length > 0 && (
                                <div className="space-y-3 mt-4">
                                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Approval History</h4>
                                    <div className="space-y-2">
                                        {selectedSurvey.approvalChain.map((log, idx) => (
                                            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-semibold text-slate-800">{log.reviewer} <span className="text-xs text-slate-400 font-normal">({log.role})</span></span>
                                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${getStatusClass(log.status)}`}>{formatStatus(log.status)}</span>
                                                </div>
                                                {log.comments && <p className="text-slate-600 italic text-xs mt-1">"{log.comments}"</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {canReview(selectedSurvey.status) && (
                            <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Reviewer Comments</label>
                                    <textarea
                                        value={reviewComments}
                                        onChange={(e) => setReviewComments(e.target.value)}
                                        placeholder="Add note for the next reviewer or reason for rejection..."
                                        className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                                        rows="2"
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        className="btn btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                                        onClick={() => handleReject(selectedSurvey.id)}
                                    >
                                        Reject Application
                                    </button>
                                    <button
                                        className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                                        onClick={() => handleApprove(selectedSurvey.id)}
                                    >
                                        Approve Record
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
