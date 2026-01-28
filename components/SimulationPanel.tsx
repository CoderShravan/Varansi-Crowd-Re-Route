
import React, { useState, useRef } from 'react';
import { generateCrowdSimulation } from '../services/geminiService';
import { 
    VideoCameraIcon, 
    PhotoIcon, 
    ArrowPathIcon, 
    CloudArrowUpIcon,
    PlayCircleIcon,
    CpuChipIcon
} from '@heroicons/react/24/outline';

const SimulationPanel: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!image || !prompt) return;
        
        setLoading(true);
        setStatus('Initializing simulation...');
        setVideoUrl(null);

        try {
            // Strip base64 header for API
            const base64Data = image.split(',')[1];
            const url = await generateCrowdSimulation(prompt, base64Data, setStatus);
            if (url) {
                setVideoUrl(url);
            } else {
                setStatus('Failed to generate video.');
            }
        } catch (error) {
            console.error(error);
            setStatus('Error occurred. Please verify your API key supports Veo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-6 p-2">
            {/* Left Control Panel */}
            <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <CpuChipIcon className="w-6 h-6 text-indigo-600" />
                        AI Simulation Studio
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Upload a photo of a location (e.g., Ghat, Street) and describe a crowd scenario to generate a predictive video simulation using <strong>Veo</strong>.
                    </p>
                </div>

                <div className="space-y-6 flex-1">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">1. Upload Source Image</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${image ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}
                        >
                            {image ? (
                                <div className="relative w-full h-32">
                                    <img src={image} alt="Source" className="w-full h-full object-cover rounded-lg" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                                        <p className="text-white text-xs font-bold">Change Image</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500 font-medium">Click to upload photo</p>
                                    <p className="text-xs text-gray-400">JPG or PNG</p>
                                </>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleImageUpload} 
                            />
                        </div>
                    </div>

                    {/* Prompt Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">2. Describe Scenario</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="E.g., A dense crowd moving peacefully towards the temple gate during evening aarti..."
                            className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!image || !prompt || loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <VideoCameraIcon className="w-5 h-5" />
                                Generate Simulation
                            </>
                        )}
                    </button>
                    
                    {loading && (
                        <div className="text-xs text-center text-gray-500 animate-pulse">
                            {status}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Preview Panel */}
            <div className="flex-1 bg-gray-900 rounded-2xl flex items-center justify-center overflow-hidden relative shadow-inner">
                {videoUrl ? (
                    <div className="w-full h-full flex flex-col">
                        <video 
                            src={videoUrl} 
                            controls 
                            autoPlay 
                            loop 
                            className="w-full h-full object-contain bg-black"
                        />
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white text-xs px-3 py-1 rounded-full">
                            Generated by Veo
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-10">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PlayCircleIcon className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-gray-400 font-medium text-lg">No Simulation Generated</h3>
                        <p className="text-gray-600 text-sm mt-2 max-w-xs mx-auto">
                            Upload an image and prompt to visualize crowd dynamics, bottlenecks, and evacuation routes.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimulationPanel;
