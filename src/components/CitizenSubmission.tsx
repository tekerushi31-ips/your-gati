import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { analyzeChallengeWithGemini } from '../lib/geminiVision';
import { dataService } from '../lib/dataService';
import type { Domain, JharkhandDistrict, Urgency, AIAnalysis } from '../types';
import { DOMAINS, JHARKHAND_DISTRICTS } from '../data/mockData';
import { 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  FileText,
  Video
} from 'lucide-react';

export const CitizenSubmission: React.FC = () => {
  const { submitChallenge, setSelectedChallenge, setActivePage, showToast } = useApp();
  const { profile } = useAuth();

  // Controlled Form Inputs (Zero hardcoding)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState<Domain>('Transportation/Infrastructure');
  const [district, setDistrict] = useState<JharkhandDistrict>(profile?.district as JharkhandDistrict || 'Palamu');
  const [block, setBlock] = useState('');
  const [villageCity, setVillageCity] = useState('');
  const [location, setLocation] = useState('');
  const [affectedCount, setAffectedCount] = useState<number>(500);
  const [urgency, setUrgency] = useState<Urgency>('HIGH');
  const [expectedSolution, setExpectedSolution] = useState('');
  const [contactInfo, setContactInfo] = useState(profile?.email || '');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileTypeCategory, setFileTypeCategory] = useState<'image' | 'video' | 'document'>('image');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Gemini Vision AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysis | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedChallengeCode, setSubmittedChallengeCode] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      showToast('File size must be less than 25MB', 'error');
      return;
    }

    setSelectedFile(file);
    setIsUploadingFile(true);

    try {
      // Classify File Category
      const category: 'image' | 'video' | 'document' = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
        ? 'video'
        : 'document';

      setFileTypeCategory(category);

      // Upload to Supabase Storage or local data URL fallback
      const uploadRes = await dataService.uploadEvidenceFile(file);
      setFilePreviewUrl(uploadRes.url);

      if (category === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const cleanBase64 = base64String.split(',')[1];
          setImageBase64(cleanBase64);
        };
        reader.readAsDataURL(file);
        showToast('Image uploaded. Ready for Gemini Vision AI analysis.', 'info');
      } else {
        setImageBase64(null);
        showToast(`${category.toUpperCase()} attached successfully.`, 'info');
      }
    } catch (err: any) {
      showToast('File upload failed. Please try again.', 'error');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setImageBase64(null);
    setAiAnalysisResult(null);
  };

  const handleRunGeminiAnalysis = async () => {
    if (!title || !description) {
      showToast('Please enter a Challenge Title and Description before running AI analysis.', 'warning');
      return;
    }

    if (fileTypeCategory !== 'image') {
      showToast('Gemini Vision AI processes image evidence. Upload a photograph for visual analysis.', 'info');
      return;
    }

    setIsAnalyzing(true);
    setAiError(null);

    try {
      const result = await analyzeChallengeWithGemini({
        challengeId: `temp-${Date.now()}`,
        title,
        description,
        district,
        domain,
        urgency,
        imageBase64: imageBase64 || undefined,
        imageMimeType: selectedFile?.type || 'image/jpeg'
      });

      setAiAnalysisResult(result);
      if (result.primaryCategory) {
        setDomain(result.primaryCategory as Domain);
      }
      showToast('Gemini Vision AI Analysis completed successfully!', 'success');
    } catch (err: any) {
      console.error('Gemini Analysis failed:', err);
      setAiError(err.message || 'AI analysis could not be completed.');
      showToast('AI analysis failed. You can retry or continue with form submission.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !location.trim() || !contactInfo.trim()) {
      showToast('Please complete all required fields (*)', 'error');
      return;
    }

    if (affectedCount <= 0) {
      showToast('Affected population count must be greater than 0.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await submitChallenge({
        title: title.trim(),
        description: description.trim(),
        domain,
        district,
        block: block.trim(),
        villageCity: villageCity.trim(),
        location: location.trim(),
        affectedCount: Number(affectedCount),
        urgency,
        expectedSolution: expectedSolution.trim(),
        contactInfo: contactInfo.trim(),
        evidenceFiles: filePreviewUrl ? [{
          url: filePreviewUrl,
          name: selectedFile?.name || 'evidence-file',
          type: fileTypeCategory
        }] : [],
        aiAnalysisResult: aiAnalysisResult
      });

      setSubmittedChallengeCode(created.challengeCode);
      setSelectedChallenge(created);
      showToast(`Challenge ${created.challengeCode} submitted successfully to Supabase!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Submission failed. Please check network/DB configuration.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedChallengeCode) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-extrabold rounded-full border border-emerald-300">
            CHALLENGE LOGGED IN SUPABASE DB
          </span>

          <h2 className="text-2xl font-black text-slate-900">Reference Code: {submittedChallengeCode}</h2>
          
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Your societal challenge has been synchronized with the Jharkhand State database and queued for Government Admin validation.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActivePage('citizen-track')}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <span>TRACK CHALLENGE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('citizen-challenges')}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-xs"
            >
              VIEW MY CHALLENGES
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto font-sans">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900">Report a Societal Challenge</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit verified public infrastructure or social issues across Jharkhand.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: CHALLENGE INFORMATION */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-emerald-800">1. Challenge Information</h2>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="challenge-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Challenge Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="challenge-title"
              type="text"
              required
              placeholder="e.g. Broken road culvert causing flooding in village market"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="challenge-description" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Problem Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="challenge-description"
              required
              rows={4}
              placeholder="Describe the issue, public impact, and current status in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="challenge-domain" className="block text-xs font-bold uppercase tracking-wider text-slate-700">Primary Domain Category</label>
              <select
                id="challenge-domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value as Domain)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl px-3 py-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {DOMAINS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="challenge-urgency" className="block text-xs font-bold uppercase tracking-wider text-slate-700">Reported Urgency</label>
              <select
                id="challenge-urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Urgency)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl px-3 py-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="CRITICAL">Critical Priority</option>
                <option value="HIGH">High Urgency</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low / Routine</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: LOCATION & IMPACT (REAL INPUTS) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-emerald-800">2. Location & Public Impact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="challenge-district" className="block text-xs font-bold uppercase tracking-wider text-slate-700">District <span className="text-rose-500">*</span></label>
              <select
                id="challenge-district"
                value={district}
                onChange={(e) => setDistrict(e.target.value as JharkhandDistrict)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl px-3 py-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {JHARKHAND_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="challenge-block" className="block text-xs font-bold uppercase tracking-wider text-slate-700">Block / Sub-Division</label>
              <input
                id="challenge-block"
                type="text"
                placeholder="e.g. Satbarwa"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-3 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="challenge-village" className="block text-xs font-bold uppercase tracking-wider text-slate-700">Village / City</label>
              <input
                id="challenge-village"
                type="text"
                placeholder="e.g. School Tola"
                value={villageCity}
                onChange={(e) => setVillageCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-3 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="challenge-location" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Landmark / Specific Location <span className="text-rose-500">*</span>
              </label>
              <input
                id="challenge-location"
                type="text"
                required
                placeholder="e.g. Main road near Government Primary School"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-4 py-3 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="challenge-affected" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Affected Citizens Count <span className="text-rose-500">*</span>
              </label>
              <input
                id="challenge-affected"
                type="number"
                min={1}
                required
                value={affectedCount}
                onChange={(e) => setAffectedCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-4 py-3 font-semibold font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="challenge-solution" className="block text-xs font-bold uppercase tracking-wider text-slate-700">Expected Solution / Request</label>
              <input
                id="challenge-solution"
                type="text"
                placeholder="e.g. Drainage culvert reconstruction and pavement leveling"
                value={expectedSolution}
                onChange={(e) => setExpectedSolution(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-4 py-3 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="challenge-contact" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Contact Information <span className="text-rose-500">*</span>
              </label>
              <input
                id="challenge-contact"
                type="text"
                required
                placeholder="e.g. ramesh@gmail.com | +91 94311 00000"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-4 py-3 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: MULTI-FORMAT EVIDENCE UPLOAD */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-emerald-800">3. Upload Field Evidence</h2>
            <span className="text-[10px] text-slate-400 font-mono">Supports Image, Video & PDF</span>
          </div>

          {!filePreviewUrl ? (
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center bg-slate-50 hover:bg-emerald-50/30 transition-colors relative cursor-pointer group">
              <input
                type="file"
                accept="image/*,video/*,application/pdf"
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 mx-auto mb-2 transition-colors" />
              <p className="text-xs font-bold text-slate-800">Upload Photo, Video or PDF Document</p>
              <p className="text-[11px] text-slate-500 mt-1">Drag & drop or Click to browse (Max 25MB)</p>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {fileTypeCategory === 'image' ? (
                  <img src={filePreviewUrl} alt="Evidence Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-300 shadow-xs" />
                ) : fileTypeCategory === 'video' ? (
                  <div className="w-16 h-16 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Video className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <FileText className="w-8 h-8" />
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold text-slate-900">{selectedFile?.name || 'attached_evidence_file'}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'File Uploaded'} • {fileTypeCategory.toUpperCase()}
                  </p>
                  {fileTypeCategory === 'image' && (
                    <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded mt-1">Ready for Gemini Vision AI</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                Remove File
              </button>
            </div>
          )}
        </div>

        {/* SECTION 4: REAL GEMINI VISION AI ANALYSIS INTEGRATION */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-emerald-800">4. Gemini AI Visual Intelligence</h2>
            </div>

            <button
              type="button"
              onClick={handleRunGeminiAnalysis}
              disabled={isAnalyzing || isUploadingFile}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing with Gemini...' : 'Analyze Photo with Gemini AI'}</span>
            </button>
          </div>

          {isAnalyzing && (
            <div className="p-6 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-center space-y-3">
              <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-emerald-900">Processing Multimodal Vision with Gemini 2.5 Flash...</p>
            </div>
          )}

          {aiError && (
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-800 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>AI Visual Inspection Notice</span>
              </div>
              <p className="text-[11px] text-rose-700">{aiError}</p>
            </div>
          )}

          {aiAnalysisResult && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-extrabold text-slate-900">Gemini AI Inspection Result</span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[11px] font-extrabold rounded-md border border-emerald-300">
                  {aiAnalysisResult.confidenceScore}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Problem Detected</span>
                  <span className="font-bold text-emerald-600">✓ Yes</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">AI Category</span>
                  <span className="font-bold text-slate-900 truncate block">{aiAnalysisResult.primaryCategory}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Issue</span>
                  <span className="font-bold text-slate-900 truncate block">{aiAnalysisResult.detectedIssue}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Severity</span>
                  <span className="font-bold text-amber-600">{aiAnalysisResult.priority}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-100/60 rounded-xl border border-emerald-200 text-xs">
                <span className="text-[9px] uppercase font-extrabold text-emerald-800 block">Recommended Action</span>
                <p className="font-bold text-slate-900 mt-0.5">{aiAnalysisResult.recommendedAction}</p>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5: REVIEW & SUBMIT */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActivePage('citizen-dashboard')}
            className="px-4 py-2.5 bg-white text-slate-600 font-bold text-xs rounded-xl border border-slate-300 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isUploadingFile}
            className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <span>{isSubmitting ? 'Submitting to Supabase DB...' : 'SUBMIT CHALLENGE TO SUPABASE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
