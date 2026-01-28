
import React from 'react';
import { 
    ShieldCheckIcon, 
    CpuChipIcon, 
    UserGroupIcon, 
    LanguageIcon, 
    ArrowTrendingUpIcon, 
    GlobeAsiaAustraliaIcon,
    MapIcon, 
    CodeBracketIcon, 
    SparklesIcon 
} from '@heroicons/react/24/outline';

interface VisionPanelProps {
    onStartDemo: () => void;
}

const VisionPanel: React.FC<VisionPanelProps> = ({ onStartDemo }) => {
    return (
        <div className="h-full overflow-y-auto custom-scrollbar bg-gray-50/30">
            <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-12">
                
                {/* Hero Section */}
                <div className="relative rounded-[2.5rem] bg-[#0f172a] overflow-hidden shadow-2xl border border-gray-800 isolate">
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/30 to-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-8 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-orange-300 text-sm font-bold tracking-wide shadow-lg">
                                <SparklesIcon className="w-4 h-4" />
                                <span>SMART INDIA HACKATHON 2024</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
                                AI-Powered <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400">
                                    Crowd Safety
                                </span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl font-light">
                                Revolutionizing pilgrimage management in Varanasi with <strong className="text-white font-semibold">Gemini 2.5 Multimodal AI</strong>. We predict risks, optimize flows, and save lives in real-time.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                                <button 
                                    onClick={onStartDemo}
                                    className="group relative px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold shadow-lg hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <MapIcon className="w-5 h-5" />
                                        Launch Live Map
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </button>
                                
                                <a 
                                    href="https://github.com/CoderShravan/Varansi-Crowd-Re-Route" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 rounded-xl font-bold backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <CodeBracketIcon className="w-5 h-5" />
                                    GitHub Repo
                                </a>
                            </div>
                        </div>

                        {/* Hero Graphic / Stats */}
                        <div className="flex-1 w-full max-w-md md:max-w-full">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl transform md:rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="grid grid-cols-2 gap-4">
                                    <StatBox label="Annual Visitors" value="100M+" color="text-orange-400" />
                                    <StatBox label="Risk Accuracy" value="94%" color="text-emerald-400" />
                                    <StatBox label="Response Time" value="<2s" color="text-blue-400" />
                                    <StatBox label="Languages" value="Hindi/En" color="text-purple-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Problem & Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300">
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <ArrowTrendingUpIcon className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Varanasi's ancient infrastructure struggles with <strong>massive surges</strong> during festivals like Dev Deepawali. Narrow <i>galis</i>, communication gaps, and lack of real-time data create high-risk zones for stampedes.
                        </p>
                    </div>

                    <div className="group p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <ShieldCheckIcon className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            A centralized <strong>AI Command Center</strong>. We fuse CCTV data, IoT sensors, and Google Maps traffic info to generate predictive heatmaps and autonomous public safety announcements.
                        </p>
                    </div>
                </div>

                {/* Technical Pillars */}
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-gray-900">Core Technology</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard 
                            icon={<GlobeAsiaAustraliaIcon className="w-6 h-6" />}
                            title="Geospatial Risk Engine"
                            desc="Calculates dynamic risk scores (0-100) by overlaying crowd density on infrastructure health (Roads, Power, Waste)."
                            color="blue"
                        />
                        <FeatureCard 
                            icon={<LanguageIcon className="w-6 h-6" />}
                            title="Hyper-Local AI Alerts"
                            desc="Gemini 2.5 generates culturally aware Hindi warnings, instantly broadcasted via TTS to public speakers."
                            color="orange"
                        />
                        <FeatureCard 
                            icon={<CpuChipIcon className="w-6 h-6" />}
                            title="RAG-Based Pilgrim Guide"
                            desc="A chat assistant grounded in Google Maps data to route pilgrims to safe zones and amenities in real-time."
                            color="purple"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, color }: any) => (
    <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
        <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{label}</div>
    </div>
);

const FeatureCard = ({ icon, title, desc, color }: any) => {
    const colorStyles: any = {
        blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
        orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
        purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    };

    return (
        <div className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${colorStyles[color]}`}>
                {icon}
            </div>
            <h4 className="font-bold text-lg text-gray-900 mb-2">{title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
};

export default VisionPanel;
