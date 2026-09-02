import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  PlusCircle, 
  Search, 
  Users, 
  GraduationCap, 
  Building, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActivePage, challenges, projects, universities, industryPartners } = useApp();
  const { isAuthenticated, profile } = useAuth();

  const workflowSteps = [
    { num: '01', title: 'Report', desc: 'Citizens log grassroot societal issues with geo-tags and photo evidence.' },
    { num: '02', title: 'Validate', desc: 'Gemini Vision AI engine analyzes urgency, scope, and visual features.' },
    { num: '03', title: 'Match', desc: 'System maps academic institution based on faculty domain expertise.' },
    { num: '04', title: 'Collaborate', desc: 'Industry partners pledge technical mentorship, hardware, and funding.' },
    { num: '05', title: 'Build', desc: 'Student engineering teams build functional prototypes under faculty mentorship.' },
    { num: '06', title: 'Deploy', desc: 'Pilot testing and full government implementation in affected communities.' }
  ];

  return (
    <div className="space-y-16 pb-16 animate-fade-in">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Jharkhand Digital Ecosystem for Societal Innovation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
            YOUR GATI
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">
            "Your Problem. Our Universities. One GATI Forward."
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Transforming community challenges into collaborative research, innovation, and deployable engineering solutions across Jharkhand.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActivePage('submit-challenge')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit a Challenge</span>
            </button>

            <button
              onClick={() => {
                if (profile?.role === 'university') setActivePage('university-dashboard');
                else if (profile?.role === 'industry') setActivePage('industry-dashboard');
                else if (profile?.role === 'admin') setActivePage('admin-dashboard');
                else setActivePage('submit-challenge');
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>{isAuthenticated ? 'Open Role Dashboard' : 'Explore Platform'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* THREE STAKEHOLDER CARDS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Ecosystem Stakeholders</h2>
          <p className="text-xs text-slate-500 mt-1">Connecting four pillars of society to convert local needs into scalable engineering deployments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => setActivePage('submit-challenge')}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">CITIZENS</h3>
            <p className="text-sm font-semibold text-emerald-700 mt-1">"Report real problems from your community."</p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Crowdsource localized challenges in agriculture, water, energy, sanitation, and infrastructure with photo evidence.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>Report Challenge</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>

          <div 
            onClick={() => setActivePage('university-dashboard')}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">UNIVERSITIES</h3>
            <p className="text-sm font-semibold text-blue-700 mt-1">"Turn societal challenges into student projects and research."</p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Faculty mentors and engineering students take up verified real-world problems for Capstone & R&D credits.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>View Academic Portal</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>

          <div 
            onClick={() => setActivePage('industry-dashboard')}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">INDUSTRY</h3>
            <p className="text-sm font-semibold text-purple-700 mt-1">"Mentor, fund, prototype and deploy solutions."</p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Corporate partners provide hardware, technical guidance, seed grants, and pilot testing grounds under CSR initiatives.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>Sponsor & Collaborate</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>
        </div>
      </section>

      {/* DATABASE DRIVEN IMPACT STATISTICS */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-4 border-r border-slate-800/80 last:border-0">
            <p className="text-3xl sm:text-4xl font-black text-white">{challenges.length}</p>
            <p className="text-xs font-medium text-slate-400 mt-1">Challenges Logged</p>
          </div>
          <div className="p-4 border-r border-slate-800/80 last:border-0">
            <p className="text-3xl sm:text-4xl font-black text-blue-400">{universities.length}</p>
            <p className="text-xs font-medium text-slate-400 mt-1">Universities Connected</p>
          </div>
          <div className="p-4 border-r border-slate-800/80 last:border-0">
            <p className="text-3xl sm:text-4xl font-black text-purple-400">{industryPartners.length}</p>
            <p className="text-xs font-medium text-slate-400 mt-1">Industry Partners</p>
          </div>
          <div className="p-4">
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">{projects.length}</p>
            <p className="text-xs font-medium text-slate-400 mt-1">Active Projects</p>
          </div>
        </div>
      </section>

      {/* 6-STEP WORKFLOW */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase font-bold text-blue-600 tracking-wider">End-to-End Governance Flow</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">How YOUR GATI Works</h2>
          <p className="text-xs text-slate-500 mt-1">A transparent 6-stage lifecycle turning raw community feedback into operational public utility projects.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((step) => (
            <div key={step.num} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all relative group">
              <span className="text-3xl font-black text-slate-200 group-hover:text-blue-600 transition-colors">
                {step.num}
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-2">{step.title}</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POLICY ALIGNMENT SECTION */}
      <section className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>National Education Policy (NEP 2020) Alignment</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bridging Academics, Civic Need & Industrial R&D
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            YOUR GATI implements the NEP 2020 vision for multi-disciplinary experiential learning. Instead of solving hypothetical textbook problems, students earn academic credits by solving real societal challenges in Jharkhand—backed by faculty research and industry hardware.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
            <div className="flex items-start gap-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-100">Experiential Learning Credits</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Students gain hands-on capstone experience with real community impact.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-100">Industry CSR & Mentorship</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Direct technology transfer, hardware grants, and expert mentorship.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
