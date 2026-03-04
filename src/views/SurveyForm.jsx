import { useState, useRef } from 'react';
import { Camera, MapPin, UploadCloud, CheckCircle2, Navigation2, FileText } from 'lucide-react';
import { useData } from '../context/SurveyContext';
import { useAuth } from '../context/AuthContext';

export default function SurveyForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        aadhaar: '',
        phone: '',
        jobRole: '',
        familyMembers: 1,
        gpsTagged: false,
        coords: null,
        aadhaarFile: null,
        livePhoto: null
    });

    const fileInputRef = useRef(null);
    const { addSurvey } = useData();
    const { currentUser } = useAuth();
    const [submittedId, setSubmittedId] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (formData.firstName && formData.aadhaar) {
            setStep(2);
        } else {
            alert("Please fill required fields (Name, Aadhaar)");
        }
    };

    const handleBack = () => setStep(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            role: formData.jobRole || 'Unspecified',
            submitter: currentUser?.name || 'Unknown',
            gps: formData.gpsTagged,
            region: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)], // Mock region assignment
        };
        const id = addSurvey(payload);
        setSubmittedId(id);
        setStep(3); // Success step
    };

    // Mock Camera Action
    const handleCameraCapture = () => {
        alert("Opening Device Camera... (Mock)\nPretending to capture photo.");
        setFormData(prev => ({ ...prev, livePhoto: 'captured_photo_timestamp.jpg' }));
    };

    // True File Input Action
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, aadhaarFile: file.name }));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // True GPS Action
    const handleGPS = (e) => {
        const checked = e.target.checked;
        setFormData(prev => ({ ...prev, gpsTagged: checked }));

        if (checked) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setFormData(prev => ({
                            ...prev,
                            coords: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
                        }));
                    },
                    (error) => {
                        alert("Error obtaining location: " + error.message);
                        setFormData(prev => ({ ...prev, gpsTagged: false, coords: null }));
                    }
                );
            } else {
                alert("Geolocation is not supported by this browser.");
                setFormData(prev => ({ ...prev, gpsTagged: false }));
            }
        } else {
            setFormData(prev => ({ ...prev, coords: null }));
        }
    };

    return (
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">Labour Registration</h1>
                <p className="text-sm text-slate-500 font-medium">Capture personal, family, and employment details accurately.</p>
            </div>

            {/* Modern Stepper */}
            <div className="card !p-4 flex items-center">
                <div className={`flex items-center gap-3 transition-colors ${step >= 1 ? 'text-brand-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-brand-100' : 'bg-slate-100 text-slate-500'}`}>1</div>
                    <span className="font-semibold text-sm hidden sm:block">Personal Details</span>
                </div>

                <div className="flex-1 h-0.5 bg-slate-100 mx-4 sm:mx-8">
                    <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: step >= 2 ? '100%' : '0%' }}></div>
                </div>

                <div className={`flex items-center gap-3 transition-colors ${step >= 2 ? 'text-brand-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-brand-100' : 'bg-slate-100 text-slate-500'}`}>2</div>
                    <span className="font-semibold text-sm hidden sm:block">Verification</span>
                </div>
            </div>

            <div className="card relative overflow-hidden">
                {step === 1 && (
                    <form className="animate-in fade-in slide-in-from-right-4 duration-300" onSubmit={handleNext}>
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-brand-500 rounded-full inline-block"></span>
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                                <div className="form-group">
                                    <label className="form-label">First Name *</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="form-input" placeholder="e.g. Ramesh" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="form-input" placeholder="e.g. Kumar" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Aadhaar Number *</label>
                                    <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} className="form-input tracking-widest font-mono" placeholder="XXXX XXXX XXXX" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">+91</span>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input pl-11" placeholder="98765 43210" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-accent-500 rounded-full inline-block"></span>
                                Employment & Family
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                                <div className="form-group">
                                    <label className="form-label">Primary Job Role</label>
                                    <select name="jobRole" value={formData.jobRole} onChange={handleChange} className="form-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[position:right_12px_center] bg-no-repeat pr-10">
                                        <option value="">Select a role</option>
                                        <option value="mason">Mason</option>
                                        <option value="carpenter">Carpenter</option>
                                        <option value="plumber">Plumber</option>
                                        <option value="electrician">Electrician</option>
                                        <option value="helper">General Helper</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Dependent Family Members</label>
                                    <input type="number" name="familyMembers" value={formData.familyMembers} onChange={handleChange} className="form-input" min="0" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-slate-100 mt-4">
                            <button type="submit" className="btn btn-primary px-8">
                                Continue to Verification
                            </button>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form className="animate-in fade-in slide-in-from-right-4 duration-300" onSubmit={handleSubmit}>
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-brand-500 rounded-full inline-block"></span>
                                Identity Uploads
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Camera Card */}
                                <div className={`relative group border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4 transition-all duration-200 cursor-pointer ${formData.livePhoto ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-300 hover:border-brand-500 hover:bg-brand-50/30'}`} onClick={handleCameraCapture}>
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${formData.livePhoto ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-600'}`}>
                                        {formData.livePhoto ? <CheckCircle2 size={28} /> : <Camera size={28} />}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800">{formData.livePhoto ? 'Photo Captured' : 'Live Capture'}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{formData.livePhoto ? formData.livePhoto : 'Take a real-time portrait'}</p>
                                    </div>
                                    {!formData.livePhoto && (
                                        <button type="button" className="btn btn-secondary py-1.5 text-xs shadow-none mt-2 w-full max-w-[140px]">Open Camera</button>
                                    )}
                                </div>

                                {/* File Upload Card */}
                                <div className={`relative group border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4 transition-all duration-200 cursor-pointer ${formData.aadhaarFile ? 'border-brand-400 bg-brand-50/50' : 'border-slate-300 hover:border-brand-500 hover:bg-brand-50/30'}`} onClick={triggerFileInput}>
                                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${formData.aadhaarFile ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-600'}`}>
                                        {formData.aadhaarFile ? <FileText size={28} /> : <UploadCloud size={28} />}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800">{formData.aadhaarFile ? 'Document Uploaded' : 'Aadhaar Document'}</h4>
                                        <p className="text-xs text-slate-500 mt-1 max-w-[200px] truncate">{formData.aadhaarFile ? formData.aadhaarFile : 'PDF, JPG or PNG up to 5MB'}</p>
                                    </div>
                                    {!formData.aadhaarFile && (
                                        <button type="button" className="btn btn-secondary py-1.5 text-xs shadow-none mt-2 w-full max-w-[140px]">Browse Files</button>
                                    )}
                                </div>

                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-accent-500 rounded-full inline-block"></span>
                                Location Data
                            </h3>

                            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl border transition-colors ${formData.gpsTagged ? 'bg-brand-50/50 border-brand-200' : 'bg-slate-50 border-slate-200'}`}>
                                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                                    <div className={`p-2.5 rounded-lg ${formData.gpsTagged ? 'bg-brand-100 text-brand-600' : 'bg-slate-200 text-slate-500'}`}>
                                        {formData.gpsTagged && formData.coords ? <Navigation2 size={24} className="animate-pulse" /> : <MapPin size={24} />}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 text-base">Geo-Tag Registration</h4>
                                        <p className="text-sm text-slate-500 mt-0.5">
                                            {formData.coords ? `Captured: ${formData.coords}` : 'Attach current GPS coordinates.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Modern Tailwind Toggle */}
                                <label className="relative inline-flex items-center cursor-pointer ml-14 sm:ml-0 shrink-0">
                                    <input type="checkbox" className="sr-only peer" checked={formData.gpsTagged} onChange={handleGPS} />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600 shadow-inner"></div>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-between pt-6 border-t border-slate-100 mt-4">
                            <button type="button" className="btn btn-secondary px-6" onClick={handleBack}>
                                Back
                            </button>
                            <button type="submit" className="btn btn-primary px-8">
                                Submit Record
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div className="animate-in zoom-in-95 duration-500 py-16 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 ring-8 ring-emerald-50">
                            <CheckCircle2 size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Record Saved Successfully!</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg">
                            The survey <span className="font-bold text-brand-600">#{submittedId}</span> for <span className="font-semibold text-slate-700">{formData.firstName} {formData.lastName}</span> has been encrypted and queued for auto-sync.
                        </p>
                        <div className="flex gap-4">
                            <button type="button" className="btn btn-secondary" onClick={() => window.location.href = '/'}>
                                Go to Dashboard
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
                                Start New Survey
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
