
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
    SignalIcon,
    UserGroupIcon,
    TruckIcon,
    BoltIcon,
    BeakerIcon,
    MicrophoneIcon,
    StopIcon
} from '@heroicons/react/24/solid';
import { 
    getSmartGuideResponse, 
    checkTrafficForLocation, 
    generateSpeechFromText, 
    playAudioContent,
    transcribeUserAudio 
} from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface SafeRoutesProps {
    data: LocationData[];
}

const QUICK_ACTIONS = [
    { label: "🚦 Traffic Check", query: "What is the real-time traffic in Godowlia?" },
    { label: "📍 Route to Ghats", query: "Fastest route to Dashashwamedh Ghat avoiding crowds." },
    { label: "☕ Best Cafes", query: "Recommend nice cafes in Varanasi." },
];

const SafeRoutes: React.FC<SafeRoutesProps> = ({ data }) => {
    // Data Filtering
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
        { role: 'model', text: 'Namaste! 🙏 I am your **Smart Travel Guide**. I can help with traffic updates, safe routes, and local recommendations.' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [userLoc, setUserLoc] = useState<{lat: number, lon: number} | undefined>(undefined);
    const [trafficUpdates, setTrafficUpdates] = useState<Record<string, {status: string, details: string, loading: boolean}>>({});
    
    // Voice State
    const [autoRead, setAutoRead] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // Geolocation
    useEffect(() => {
        if (!navigator.geolocation) return;
        const watchId = navigator.geolocation.watchPosition(
            (pos) => setUserLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            (err) => console.log("Location denied"),
            { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

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
        if (autoRead) handleSpeak(response);
    };

    const handleSpeak = async (text: string) => {
        if (isSpeaking) return;
        setIsSpeaking(true);
        try {
            const cleanText = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*#_`]/g, ''); 
            const audioData = await generateSpeechFromText(cleanText);
            if (audioData) await playAudioContent(audioData);
        } catch (e) {
            console.error("TTS Error", e);
        } finally {
            setIsSpeaking(false);
        }
    };

    const handleCheckTraffic = async (placeName: string) => {
        setTrafficUpdates(prev => ({ ...prev, [placeName]: { status: '', details: '', loading: true } }));
        const result = await checkTrafficForLocation(placeName, userLoc);
        setTrafficUpdates(prev => ({ ...prev, [placeName]: { ...result, loading: false } }));
    };

    // --- AUDIO RECORDING ---
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = async () => {
                    const base64Audio = (reader.result as string).split(',')[1];
                    setIsThinking(true); // Show thinking while transcribing
                    const transcription = await transcribeUserAudio(base64Audio);
                    setIsThinking(false);
                    if (transcription) {
                        setInput(transcription);
                        // Optional: Auto-send
                        // handleSendMessage(transcription);
                    }
                };
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Mic Error:", err);
            alert("Microphone access denied.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            // Stop tracks
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6 bg-gray-50/50 p-2 lg:p-0">
            {/* LEFT PANEL */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {/* Header */}
                <div className="mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Traffic & Routing</h2>
                        <p className="text-gray-500 text-xs mt-1">Live updates • Gemini Powered</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">{safePlaces.length} Safe</span>
                        <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold border border-rose-100">{avoidPlaces.length} Risky</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {safePlaces.map(place => (
                        <div key={place.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-800">{place.name}</h4>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">CLEAR</span>
                            </div>
                            <div className="flex gap-2 mb-3">
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">AQI {place.aqi}</span>
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">Power: {place.electricityStatus}</span>
                            </div>
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`} target="_blank" rel="noreferrer" className="block text-center w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                                Navigate
                            </a>
                        </div>
                    ))}
                </div>

                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Active Congestion Alerts</h3>
                <div className="space-y-3">
                    {avoidPlaces.map(place => {
                         const trafficInfo = trafficUpdates[place.name];
                         return (
                            <div key={place.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-rose-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{place.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold text-rose-600">{place.riskScore}% Risk</span>
                                            <span className="text-gray-300">|</span>
                                            <span className="text-xs text-gray-500">{place.currentCrowd} People</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {place.roadCondition !== 'Good' && <span className="px-1.5 py-0.5 bg-orange-50 text-orange-700 text-[10px] rounded border border-orange-100 font-bold">Road: {place.roadCondition}</span>}
                                            {place.wasteIndex === 'High Accumulation' && <span className="px-1.5 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] rounded border border-yellow-100 font-bold">Waste High</span>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => handleCheckTraffic(place.name)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium transition-colors">
                                            {trafficInfo?.loading ? 'Checking...' : 'Check Traffic'}
                                        </button>
                                    </div>
                                </div>
                                {trafficInfo && !trafficInfo.loading && (
                                    <div className="mt-3 text-xs bg-gray-50 p-2 rounded border border-gray-200 text-gray-700">
                                        <strong>{trafficInfo.status}:</strong> {trafficInfo.details}
                                    </div>
                                )}
                            </div>
                         );
                    })}
                </div>
            </div>

            {/* RIGHT PANEL: Chat */}
            <div className="lg:w-[400px] xl:w-[450px] flex-shrink-0 bg-white lg:rounded-2xl shadow-xl border border-gray-100 flex flex-col h-[500px] lg:h-full overflow-hidden">
                <div className="p-4 bg-indigo-900 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-yellow-400" />
                        <h3 className="font-bold">Smart Assistant</h3>
                    </div>
                    <button onClick={() => setAutoRead(!autoRead)} className={`text-[10px] px-2 py-1 rounded border ${autoRead ? 'bg-indigo-500 border-transparent' : 'border-indigo-400 text-indigo-200'}`}>
                        TTS: {autoRead ? 'ON' : 'OFF'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'}`}>
                                <ReactMarkdown 
                                    components={{
                                        a: ({node, ...props}) => <a {...props} className="text-blue-500 underline font-bold" target="_blank" />
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {isThinking && <div className="text-xs text-gray-400 italic ml-4">Thinking...</div>}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-3 bg-white border-t border-gray-100">
                     <div className="flex gap-2 overflow-x-auto pb-2 mb-1 no-scrollbar">
                        {QUICK_ACTIONS.map((action, i) => (
                            <button key={i} onClick={() => handleSendMessage(action.query)} className="whitespace-nowrap px-2 py-1 bg-gray-100 hover:bg-indigo-50 text-gray-600 text-[10px] font-bold rounded-full transition-colors">
                                {action.label}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex gap-2 items-center">
                        <button
                            type="button"
                            onMouseDown={startRecording}
                            onMouseUp={stopRecording}
                            onTouchStart={startRecording}
                            onTouchEnd={stopRecording}
                            className={`p-3 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white scale-110 shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            title="Hold to Record"
                        >
                            <MicrophoneIcon className="w-5 h-5" />
                        </button>
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type or speak..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <button type="submit" disabled={!input.trim()} className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SafeRoutes;
