
import React, { useState, useEffect, useRef } from 'react';
import { LocationData, ChatMessage } from '../types';
import { 
    ShieldCheckIcon, 
    ExclamationTriangleIcon, 
    ArrowTopRightOnSquareIcon,
    PaperAirplaneIcon,
    SparklesIcon,
    MapPinIcon,
    ArrowPathIcon,
    SpeakerWaveIcon,
    StopIcon,
    SignalIcon,
    UserGroupIcon,
    TruckIcon,
    BoltIcon,
    BeakerIcon
} from '@heroicons/react/24/solid';
import { getSmartGuideResponse, checkTrafficForLocation, generateSpeechFromText, playAudioContent } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface SafeRoutesProps {
    data: LocationData[];
}

const QUICK_ACTIONS = [
    { label: "🚦 Live Traffic Check", query: "What is the real-time traffic condition in Godowlia and Lanka?" },
    { label: "📍 Best Route to Ghats", query: "Suggest the fastest route to Dashashwamedh Ghat avoiding crowds." },
    { label: "☕ Best Cafes & Hangouts", query: "Recommend some famous cafes, housing clubs, and nice hangout spots in Varanasi. Include their vibe and location." },
];

const SafeRoutes: React.FC<SafeRoutesProps> = ({ data }) => {
    // Split data into Safe (Low Risk) and Avoid (High Risk)
    const safePlaces = data
        .filter(d => d.riskScore < 40 && d.currentCrowd < d.baseCapacity * 0.8 && d.roadCondition === 'Good')
        .sort((a, b) => a.riskScore - b.riskScore)
        .slice(0, 6); 
        
    const avoidPlaces = data
        .filter(d => d.riskScore > 60 || d.roadCondition === 'Blocked' || d.roadCondition === 'Construction')
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5);

    // Chat State
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'Namaste! 🙏 I am your **Smart Travel Guide**. \n\nI can help you with:\n* 🚦 Real-time traffic updates\n* 🗺️ Safe & fast routes\n* ☕ Famous cafes & clubs\n\nHow can I help you navigate Varanasi today?' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [userLoc, setUserLoc] = useState<{lat: number, lon: number} | undefined>(undefined);
    
    // Traffic Check State
    const [trafficUpdates, setTrafficUpdates] = useState<Record<string, {status: string, details: string, loading: boolean}>>({});

    // Voice & Proximity State
    const [autoRead, setAutoRead] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [notifiedZones, setNotifiedZones] = useState<Set<string>>(new Set());

    // --- Geolocation & Proximity Logic ---
    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const currentLoc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
                setUserLoc(currentLoc);

                // Check proximity to high-risk zones (Step-in feature)
                data.forEach(place => {
                    // Only alert for high risk places (>60) that haven't been notified yet
                    if (place.riskScore > 60 && !notifiedZones.has(place.id)) {
                        const dist = getDistanceFromLatLonInKm(currentLoc.lat, currentLoc.lon, place.lat, place.lon);
                        // If within 300 meters
                        if (dist < 0.3) {
                            triggerProximityAlert(place);
                        }
                    }
                });
            },
            (err) => console.log("Location access denied for chat grounding"),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [data, notifiedZones]); // Dependency on data to check risk scores

    // Helper: Calculate distance
    const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = (deg2rad(lon2 - lon1));
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return R * c;
    };
    const deg2rad = (deg: number) => deg * (Math.PI/180);

    const triggerProximityAlert = (place: LocationData) => {
        const alertMsg = `⚠️ **Zone Alert**: You are entering **${place.name}**. It is currently congested (Risk: ${place.riskScore}%). Please proceed with caution or check alternative routes.`;
        
        setMessages(prev => [...prev, { role: 'model', text: alertMsg }]);
        setNotifiedZones(prev => new Set(prev).add(place.id));
        
        if (autoRead) {
            handleSpeak(alertMsg);
        }
    };

    // --- Chat & Voice Logic ---

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: text }]);
        setIsThinking(true);

        const response = await getSmartGuideResponse(text, userLoc);
        
        setIsThinking(false);
        setMessages(prev => [...prev, { role: 'model', text: response }]);

        if (autoRead) {
            handleSpeak(response);
        }
    };

    const handleSpeak = async (text: string) => {
        if (isSpeaking) return; // simple lock
        setIsSpeaking(true);
        try {
            // Removing markdown symbols for cleaner speech
            const cleanText = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*#_`]/g, ''); 
            const audioData = await generateSpeechFromText(cleanText);
            if (audioData) {
                await playAudioContent(audioData);
            }
        } catch (e) {
            console.error("TTS Error", e);
        } finally {
            setIsSpeaking(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
    };

    const requestAlternativeRoute = (placeName: string) => {
        const query = `I need to go to ${placeName} but it is crowded. Please find a 'traffic-aware' alternative route or transport mode (like boat) using Google Maps data.`;
        handleSendMessage(query);
    };

    const handleCheckTraffic = async (placeName: string) => {
        setTrafficUpdates(prev => ({ ...prev, [placeName]: { status: '', details: '', loading: true } }));
        const result = await checkTrafficForLocation(placeName, userLoc);
        setTrafficUpdates(prev => ({ ...prev, [placeName]: { ...result, loading: false } }));
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6 bg-gray-50/50 p-2 lg:p-0">
            {/* LEFT PANEL: Travel Feed (Combined Data) */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Header Summary */}
                <div className="mb-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Real-Time Traffic Dashboard</h2>
                        <p className="text-gray-500 text-sm mt-1">Live congestion tracking & smart routing</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2 shadow-sm">
                            {safePlaces.length} Clear Zones
                        </div>
                        <div className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 text-sm font-semibold flex items-center gap-2 shadow-sm">
                            {avoidPlaces.length} Traffic Alerts
                        </div>
                    </div>
                </div>

                {/* Safe Places Section */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <ShieldCheckIcon className="w-6 h-6 text-emerald-600" />
                        <h3 className="text-lg font-bold text-gray-800">Low Traffic Zones (Recommended)</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                        {safePlaces.map(place => (
                            <div key={place.id} className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-gray-800 text-lg group-hover:text-emerald-700 transition-colors">{place.name}</h4>
                                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                                        Clear Road
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                     <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                        Waste: {place.wasteIndex}
                                     </span>
                                     <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                        Power: {place.electricityStatus}
                                     </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
                                    <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        Low Crowd
                                    </span>
                                    <span className="text-gray-300">|</span>
                                    <span>AQI {place.aqi}</span>
                                </div>
                                <a 
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition-all text-sm shadow-emerald-200 shadow-sm"
                                >
                                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                    Navigate Now
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Traffic Alerts Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <ExclamationTriangleIcon className="w-6 h-6 text-rose-600" />
                        <h3 className="text-lg font-bold text-gray-800">High Congestion & Risk Alerts</h3>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        {avoidPlaces.map(place => {
                            const trafficInfo = trafficUpdates[place.name];
                            const mapLink = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}&travelmode=driving`;
                            
                            return (
                                <div key={place.id} className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-rose-500 flex flex-col gap-4 transition-all hover:shadow-md">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-bold text-gray-800 text-lg">{place.name}</h4>
                                                <span className="text-xs bg-rose-100 text-rose-700 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider">
                                                    {place.scenario}
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500 mb-2">
                                                <span>
                                                    Risk Level: <span className="font-semibold text-rose-600">{place.riskScore}%</span>
                                                </span>
                                                <span className="hidden sm:block text-gray-300">|</span>
                                                <span className="flex items-center gap-1.5">
                                                    <UserGroupIcon className="w-4 h-4 text-gray-400" />
                                                    <span>Current Crowd: <strong className="text-gray-800">{place.currentCrowd.toLocaleString()}</strong></span>
                                                </span>
                                            </div>

                                            {/* Infrastructure Warnings */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {place.roadCondition !== 'Good' && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                                                        <TruckIcon className="w-3 h-3" /> Road: {place.roadCondition}
                                                    </span>
                                                )}
                                                {place.electricityStatus === 'Outage' && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                                        <BoltIcon className="w-3 h-3" /> Power Outage
                                                    </span>
                                                )}
                                                {place.diseaseRisk === 'High' && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                                                        <BeakerIcon className="w-3 h-3" /> Health Risk
                                                    </span>
                                                )}
                                                {place.wasteIndex === 'High Accumulation' && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100">
                                                        ⚠️ High Waste
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            <a
                                                href={mapLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors border border-blue-200"
                                            >
                                                <MapPinIcon className="w-4 h-4" />
                                                Go to Map
                                            </a>
                                            <button
                                                onClick={() => handleCheckTraffic(place.name)}
                                                disabled={trafficInfo?.loading}
                                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-200"
                                            >
                                                {trafficInfo?.loading ? (
                                                    <span className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                                                ) : (
                                                    <SignalIcon className="w-4 h-4" />
                                                )}
                                                {trafficInfo ? 'Update Traffic' : 'Traffic Check'}
                                            </button>
                                            <button
                                                onClick={() => requestAlternativeRoute(place.name)}
                                                className="flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg transition-colors border border-indigo-200"
                                            >
                                                <ArrowPathIcon className="w-4 h-4" />
                                                Find Alt Route
                                            </button>
                                        </div>
                                    </div>

                                    {/* Real-time Traffic Result Box */}
                                    {trafficInfo && !trafficInfo.loading && (
                                        <div className={`mt-1 p-3 rounded-lg border flex items-start gap-3 animate-fadeIn ${
                                            trafficInfo.status.includes('High') || trafficInfo.status.includes('Heavy') 
                                            ? 'bg-rose-50 border-rose-100 text-rose-800' 
                                            : 'bg-orange-50 border-orange-100 text-orange-800'
                                        }`}>
                                            <div className={`mt-0.5 w-3 h-3 rounded-full flex-shrink-0 ${
                                                 trafficInfo.status.includes('High') || trafficInfo.status.includes('Heavy') 
                                                 ? 'bg-red-500' : 'bg-orange-400'
                                            }`}></div>
                                            <div>
                                                <p className="font-bold text-sm">{trafficInfo.status}</p>
                                                <p className="text-sm opacity-90">{trafficInfo.details}</p>
                                                <a href={mapLink} target="_blank" rel="noreferrer" className="text-xs underline mt-1 block">View in Maps</a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            {/* RIGHT PANEL: AI Assistant */}
            <div className="lg:w-[420px] xl:w-[480px] flex-shrink-0 bg-white lg:rounded-3xl shadow-2xl border border-gray-100 flex flex-col h-[600px] lg:h-full mt-6 lg:mt-0 overflow-hidden relative z-10">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-5 flex items-center justify-between flex-shrink-0 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                            <SparklesIcon className="w-6 h-6 text-yellow-300" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg leading-tight">Smart Guide</h3>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-indigo-200 font-medium">Maps Grounding Active</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-green-300 bg-green-900/40 px-2 py-0.5 rounded-full border border-green-500/30">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                            </span>
                            Live
                        </div>
                        
                        {/* Voice Toggle */}
                        <button 
                            onClick={() => setAutoRead(!autoRead)}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                                autoRead 
                                ? 'bg-indigo-500 text-white border-indigo-400 shadow-sm' 
                                : 'bg-indigo-900/50 text-indigo-200 border-indigo-700/50 hover:bg-indigo-800'
                            }`}
                            title="BharatGen TTS Integration"
                        >
                            <SpeakerWaveIcon className="w-3 h-3" />
                            {autoRead ? 'Voice ON' : 'Voice OFF'}
                        </button>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50 custom-scrollbar scroll-smooth">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                            <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm leading-relaxed relative group ${
                                msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-200' 
                                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-gray-200'
                            }`}>
                                <ReactMarkdown 
                                    components={{
                                        a: ({node, ...props}) => <a {...props} className="text-blue-500 hover:text-blue-700 underline font-semibold transition-colors bg-blue-50 px-1 py-0.5 rounded" target="_blank" rel="noreferrer" />,
                                        p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />,
                                        ul: ({node, ...props}) => <ul {...props} className="list-disc pl-4 mb-2" />,
                                        li: ({node, ...props}) => <li {...props} className="mb-1" />
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                                
                                {/* Manual TTS Button */}
                                {msg.role === 'model' && (
                                    <button 
                                        onClick={() => handleSpeak(msg.text)}
                                        className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 p-1 rounded-full shadow-sm"
                                        title="Read aloud with BharatGen"
                                    >
                                        <SpeakerWaveIcon className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="bg-white rounded-2xl rounded-bl-none p-4 border border-gray-200 shadow-sm flex items-center gap-2">
                                <span className="text-xs text-gray-400 font-medium">Checking Maps & Search...</span>
                                <div className="flex space-x-1.5">
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area (Pinned Bottom) */}
                <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
                    
                    {/* Quick Actions Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
                        {QUICK_ACTIONS.map((action, i) => (
                            <button
                                key={i}
                                onClick={() => handleSendMessage(action.query)}
                                disabled={isThinking}
                                className="whitespace-nowrap px-3 py-1.5 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-transparent rounded-full text-xs font-semibold text-gray-600 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
                        <label htmlFor="chat-input" className="sr-only">Type your message</label>
                        <input
                            id="chat-input"
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about traffic, places, routes..."
                            className="flex-1 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all outline-none shadow-inner"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isThinking}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 flex-shrink-0"
                            aria-label="Send Message"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">
                        AI-generated info. Verify critical navigation details.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SafeRoutes;
