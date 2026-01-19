
import React, { useState, useEffect } from 'react';
import { Recipe, Goal, Gift, UserProfile } from './types';
import { INITIAL_RECIPES, PREMIUM_GIFTS } from './constants';
import { generateAIPromptedRecipe, getDailyInsight } from './services/gemini';

const MobileHeader = ({ user }: { user: UserProfile | null }) => (
  <header className="fixed top-0 left-0 right-0 z-[60] bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-tr from-[#c4a052] to-[#f5e1b0] rounded-lg flex items-center justify-center shadow-lg shadow-[#c4a052]/20">
        <i className="fa-solid fa-crown text-[#1a1a1a] text-sm"></i>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-black text-white uppercase leading-none tracking-tight">VidaSana</span>
        <span className="text-[8px] text-[#c4a052] font-black uppercase tracking-[0.3em]">Elite VIP</span>
      </div>
    </div>
    <div className="flex items-center space-x-3">
      <div className="flex flex-col items-end mr-1">
        <span className="text-[8px] font-black text-white uppercase opacity-70 truncate max-w-[80px]">{user?.name || 'Invitado'}</span>
        <div className="w-12 h-0.5 bg-white/10 rounded-full mt-0.5">
          <div className="h-full bg-[#c4a052] w-full animate-pulse"></div>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full border border-[#c4a052]/30 overflow-hidden bg-[#1a1a1a]">
        <img src={`https://ui-avatars.com/api/?name=${user?.name || 'VIP'}&background=c4a052&color=000`} className="w-full h-full object-cover" />
      </div>
    </div>
  </header>
);

const MobileBottomNav = ({ activeTab, setTab }: { activeTab: string, setTab: (t: string) => void }) => {
  const tabs = [
    { id: 'inicio', icon: 'fa-house', label: 'Inicio' },
    { id: 'vault', icon: 'fa-vault', label: 'Bóveda' },
    { id: 'ai', icon: 'fa-brain-circuit', label: 'Chef AI' },
    { id: 'recetas', icon: 'fa-utensils', label: 'Recetas' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-black/90 backdrop-blur-2xl border-t border-white/10 px-4 pb-safe flex justify-around items-center h-20 safe-bottom">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => {
            setTab(tab.id);
            document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center space-y-1 w-16 transition-all duration-300 ${activeTab === tab.id ? 'text-[#c4a052]' : 'text-gray-500'}`}
        >
          <i className={`fa-solid ${tab.icon} ${activeTab === tab.id ? 'text-lg' : 'text-base'}`}></i>
          <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
          {activeTab === tab.id && <div className="w-1 h-1 bg-[#c4a052] rounded-full mt-1"></div>}
        </button>
      ))}
    </nav>
  );
};

const Onboarding = ({ onComplete }: { onComplete: (profile: UserProfile) => void }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Masculino' | 'Femenino' | 'Otro'>('Masculino');
  const [goal, setGoal] = useState<Goal>('Perder Peso');

  const next = () => {
    if (step === 1 && !name) return;
    if (step === 2 && !age) return;
    if (step < 4) setStep(step + 1);
    else onComplete({ name, age, gender, goal });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col p-8 items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#c4a052]/10 via-transparent to-transparent opacity-50"></div>
      
      <div className="max-w-md w-full relative z-10 text-center">
        {step === 1 && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-[#c4a052] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#c4a052]/30">
              <i className="fa-solid fa-heart-pulse text-black text-4xl"></i>
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">¡Gracias por tu compra!</h2>
            <p className="text-gray-400 text-sm mb-12 font-medium">Estás a un paso de desbloquear tu transformación Elite. Primero, dinos tu nombre.</p>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Escribe tu nombre..."
              className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-5 text-white font-bold focus:outline-none focus:border-[#c4a052] transition-all mb-8 shadow-inner"
            />
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right duration-500">
            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Tu Vitalidad</h2>
            <p className="text-gray-400 text-sm mb-12 font-medium">¿Qué edad tienes? Esto nos ayuda a ajustar los macronutrientes.</p>
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)}
              placeholder="Ej: 28"
              className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-5 text-white font-bold focus:outline-none focus:border-[#c4a052] transition-all mb-8"
            />
          </div>
        )}

        {step === 3 && (
          <div className="animate-in slide-in-from-right duration-500 text-center">
            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Género</h2>
            <p className="text-gray-400 text-sm mb-12 font-medium">Selecciona tu perfil biológico para una precisión total.</p>
            <div className="grid grid-cols-1 gap-4 mb-8">
              {(['Masculino', 'Femenino', 'Otro'] as const).map(g => (
                <button 
                  key={g}
                  onClick={() => setGender(g)}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border ${gender === g ? 'bg-[#c4a052] text-black border-[#c4a052]' : 'bg-white/5 text-gray-500 border-white/5'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in slide-in-from-right duration-500">
            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Misión Final</h2>
            <p className="text-gray-400 text-sm mb-12 font-medium">¿Cuál es tu objetivo principal con VidaSana VIP?</p>
            <div className="grid grid-cols-1 gap-4 mb-8">
              {(['Perder Peso', 'Ganar Músculo', 'Desintoxicación', 'Mantenerse Sano'] as Goal[]).map(g => (
                <button 
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border ${goal === g ? 'bg-[#c4a052] text-black border-[#c4a052]' : 'bg-white/5 text-gray-500 border-white/5'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={next}
          className="w-full bg-[#c4a052] text-black py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-[#c4a052]/20 active:scale-95 transition-all"
        >
          {step === 4 ? 'EMPEZAR AHORA' : 'CONTINUAR'}
        </button>

        <div className="mt-12 flex justify-center space-x-2">
          {[1,2,3,4].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#c4a052] w-6' : 'bg-white/10'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InstallPWA = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col p-8 items-center justify-end">
    <div className="w-full max-w-md bg-[#0d0d0d] rounded-[3rem] border border-[#c4a052]/20 p-10 animate-in slide-in-from-bottom duration-500">
      <div className="w-16 h-16 bg-[#c4a052] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#c4a052]/20">
        <i className="fa-solid fa-mobile-screen-button text-black text-3xl"></i>
      </div>
      <h2 className="text-2xl font-black text-white text-center mb-4 uppercase tracking-tighter">Instalar App VIP</h2>
      <p className="text-gray-400 text-xs text-center mb-10 font-medium leading-relaxed">
        Para tener acceso instantáneo desde tu pantalla de inicio como una aplicación nativa, sigue estos pasos:
      </p>
      
      <div className="space-y-6 mb-10">
        <div className="flex items-start">
          <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-black text-[#c4a052] mr-4 flex-shrink-0">1</div>
          <p className="text-gray-300 text-[11px]">Pulsa el icono de <span className="text-[#c4a052] font-bold">"Compartir"</span> (el cuadro con la flecha hacia arriba).</p>
        </div>
        <div className="flex items-start">
          <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-black text-[#c4a052] mr-4 flex-shrink-0">2</div>
          <p className="text-gray-300 text-[11px]">Desliza hacia abajo y elige <span className="text-[#c4a052] font-bold">"Añadir a la pantalla de inicio"</span>.</p>
        </div>
        <div className="flex items-start">
          <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-black text-[#c4a052] mr-4 flex-shrink-0">3</div>
          <p className="text-gray-300 text-[11px]">Pulsa <span className="text-[#c4a052] font-bold">"Añadir"</span> en la esquina superior derecha.</p>
        </div>
      </div>

      <button 
        onClick={onClose}
        className="w-full bg-white/5 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 active:scale-95 transition-all"
      >
        Entendido, lo haré después
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [activeTab, setActiveTab] = useState('inicio');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dailyInsight, setDailyInsight] = useState("");
  const [aiInput, setAiInput] = useState("");

  useEffect(() => {
    const savedProfile = localStorage.getItem('vidasana_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setUser(parsed);
      getDailyInsight(parsed.goal).then(setDailyInsight);
    }
  }, []);

  useEffect(() => {
    if (user) {
      getDailyInsight(user.goal).then(setDailyInsight);
    }
  }, [user?.goal]);

  const completeOnboarding = (profile: UserProfile) => {
    localStorage.setItem('vidasana_profile', JSON.stringify(profile));
    setUser(profile);
    setShowInstallPrompt(true);
  };

  const handleAIRequest = async () => {
    if (!aiInput || !user) return;
    setIsGenerating(true);
    const newRecipe = await generateAIPromptedRecipe(aiInput, user.goal);
    if (newRecipe) {
      setRecipes(prev => [newRecipe, ...prev]);
      setSelectedRecipe(newRecipe);
    }
    setAiInput("");
    setIsGenerating(false);
  };

  if (!user) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <div className="pb-32 bg-[#050505] min-h-screen">
      <MobileHeader user={user} />
      <MobileBottomNav activeTab={activeTab} setTab={setActiveTab} />
      
      {showInstallPrompt && <InstallPWA onClose={() => setShowInstallPrompt(false)} />}

      {/* DASHBOARD */}
      <section id="inicio" className="pt-24 px-6 pb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="inline-flex items-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-[#c4a052] rounded-full mr-2 animate-pulse"></span>
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Portal Platinum</span>
          </div>
          <button onClick={() => setShowInstallPrompt(true)} className="text-[#c4a052] text-[9px] font-black uppercase flex items-center">
            <i className="fa-solid fa-download mr-2"></i> Instalar App
          </button>
        </div>
        
        <h1 className="text-4xl font-black text-white mb-4 leading-tight">
          Bienvenido, <span className="text-[#c4a052]">{user.name}</span>
        </h1>
        <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
          Tu plan <span className="text-white font-bold">{user.goal}</span> para <span className="text-white font-bold">{user.age} años</span> está optimizado.
        </p>

        {/* Daily Insight Box */}
        <div className="bg-gradient-to-br from-[#111] to-black p-6 rounded-[2rem] border border-white/5 mb-10 shadow-xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#c4a052]/5 rounded-full blur-3xl group-hover:bg-[#c4a052]/10 transition-all"></div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#c4a052]/10 rounded-lg flex items-center justify-center mr-3">
              <i className="fa-solid fa-dna text-[#c4a052] text-xs"></i>
            </div>
            <span className="text-[10px] font-black uppercase text-[#c4a052] tracking-widest">Biohacking Insight</span>
          </div>
          <p className="text-gray-400 text-xs italic font-semibold leading-relaxed">
            "{dailyInsight || "Consultando bases de biohacking..."}"
          </p>
        </div>

        {/* Abundance Horizontal View */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Novedades Elite</h3>
            <span className="text-[9px] font-black text-[#c4a052] uppercase tracking-widest">Ver Todo</span>
          </div>
          <div className="flex overflow-x-auto no-scrollbar pb-2">
            {recipes.slice(0, 8).map(r => (
              <div 
                key={r.id} 
                onClick={() => setSelectedRecipe(r)}
                className="flex-shrink-0 w-48 bg-[#111] rounded-[2.5rem] overflow-hidden border border-white/5 mr-5 active:scale-95 transition-all shadow-2xl"
              >
                <div className="h-36 relative">
                  <img src={r.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-[11px] font-black text-white truncate">{r.title}</h4>
                    <div className="text-[8px] text-[#c4a052] font-black uppercase tracking-widest">{r.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
            <div className="text-2xl font-black text-white">1,024</div>
            <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest mt-1">Recetas Pro</div>
          </div>
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
            <div className="text-2xl font-black text-[#c4a052]">20</div>
            <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest mt-1">Regalos VIP</div>
          </div>
        </div>
      </section>

      {/* THE VAULT */}
      <section id="vault" className="py-12 px-6 bg-[#0a0a0a]">
        <div className="mb-10 text-center">
          <div className="text-[9px] font-black text-[#c4a052] uppercase tracking-[0.5em] mb-4">Tus Activos Desbloqueados</div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">La Bóveda VIP</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {PREMIUM_GIFTS.map(gift => (
            <div 
              key={gift.id}
              onClick={() => setSelectedGift(gift)}
              className="relative flex flex-col bg-[#111] rounded-[2rem] border border-white/5 active:scale-95 transition-all p-6 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-3 right-3">
                 <span className="text-[7px] font-black text-[#c4a052] bg-[#c4a052]/10 px-2 py-0.5 rounded-full border border-[#c4a052]/20 uppercase">
                  {gift.tag}
                 </span>
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-lg shadow-black">
                <i className={`fa-solid ${gift.icon} text-[#c4a052] text-xl`}></i>
              </div>
              <h4 className="text-white font-black text-xs mb-2 leading-tight uppercase tracking-tight">{gift.title}</h4>
              <div className="flex items-center space-x-2 text-[8px] font-black uppercase mb-4">
                <span className="text-green-500">LIBRE</span>
                <span className="text-gray-600 line-through">{gift.value}</span>
              </div>
              <button className="mt-auto w-full py-3 bg-[#c4a052] text-black rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#c4a052]/10">
                BAJAR
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* AI COACH */}
      <section id="ai" className="py-12 px-6">
        <div className="bg-gradient-to-b from-[#121212] to-[#050505] rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5">
            <i className="fa-solid fa-brain-circuit text-[150px] text-[#c4a052]"></i>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Chef AI Elite</h2>
            <p className="text-gray-500 text-xs mb-10 leading-relaxed font-medium">
              Escribe los ingredientes de tu nevera y nuestra IA generará una receta de alta cocina optimizada para <span className="text-[#c4a052] font-bold">{user.goal}</span>.
            </p>
            
            <div className="space-y-4">
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ej: Tengo atún, tomate y aguacate..."
                className="w-full bg-black/50 border border-white/10 rounded-[2rem] px-8 py-6 text-sm text-white focus:outline-none focus:border-[#c4a052] transition-all min-h-[120px] resize-none shadow-inner"
              />
              <button 
                onClick={handleAIRequest}
                disabled={isGenerating}
                className="w-full bg-[#c4a052] text-black py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center shadow-xl shadow-[#c4a052]/20 active:scale-95 transition-all"
              >
                {isGenerating ? <i className="fa-solid fa-spinner fa-spin mr-3 text-lg"></i> : <i className="fa-solid fa-sparkles mr-3 text-lg"></i>}
                {isGenerating ? 'Calculando...' : 'Crear Receta VIP'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RECIPES INFINITE */}
      <section id="recetas" className="py-12 px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Recetario Infinito</h2>
          <div className="bg-[#c4a052]/10 px-4 py-1.5 rounded-full border border-[#c4a052]/20">
            <span className="text-[8px] font-black text-[#c4a052] uppercase tracking-[0.2em]">Sincronizado</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {recipes.map(recipe => (
            <div 
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-[#111] rounded-[2.5rem] overflow-hidden border border-white/5 active:scale-[0.98] transition-all shadow-2xl relative"
            >
              <div className="h-64 relative">
                <img src={recipe.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                <div className="absolute top-6 left-6">
                  <span className="bg-[#c4a052] text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-2xl">{recipe.category}</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-white leading-tight mb-2 pr-4 tracking-tight">{recipe.title}</h3>
                    <div className="flex space-x-4 text-[9px] font-black uppercase text-[#c4a052] tracking-widest">
                       <span><i className="fa-solid fa-bolt mr-2"></i> {recipe.calories} kcal</span>
                       <span><i className="fa-solid fa-clock mr-2"></i> {recipe.time}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#c4a052] flex items-center justify-center text-black shadow-lg shadow-[#c4a052]/20">
                    <i className="fa-solid fa-chevron-right text-sm"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center p-12 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
           <div className="w-16 h-16 border-4 border-[#c4a052]/20 border-t-[#c4a052] rounded-full mx-auto mb-8 animate-spin"></div>
           <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] leading-relaxed">
             Estamos procesando y sincronizando el resto de las 1,000+ recetas exclusivas con tu perfil de biohacking...
           </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-8 py-20 text-center text-gray-800 bg-black border-t border-white/5">
        <div className="flex items-center justify-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-[#c4a052] rounded-xl flex items-center justify-center shadow-2xl rotate-3">
            <i className="fa-solid fa-crown text-black text-xl"></i>
          </div>
          <span className="text-2xl font-black text-white uppercase tracking-tighter">VidaSana <span className="text-[#c4a052]">Elite</span></span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mb-10">Tu Éxito es Inevitable</p>
        <div className="flex justify-center space-x-8 mb-12 opacity-30 grayscale">
          <i className="fa-brands fa-cc-visa text-3xl"></i>
          <i className="fa-brands fa-cc-mastercard text-3xl"></i>
          <i className="fa-brands fa-cc-apple-pay text-3xl"></i>
        </div>
        <p className="text-[8px] font-medium text-gray-800 tracking-widest uppercase">© 2024 VidaSana System LLC • Todos los Derechos Reservados</p>
      </footer>

      {/* GIFT MODAL */}
      {selectedGift && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedGift(null)}></div>
          <div className="relative bg-[#0d0d0d] w-full rounded-t-[4rem] border-t border-[#c4a052]/20 p-12 animate-in slide-in-from-bottom duration-500 max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-10"></div>
            <div className="w-24 h-24 bg-[#c4a052] rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-[#c4a052]/30 rotate-6">
              <i className={`fa-solid ${selectedGift.icon} text-black text-5xl`}></i>
            </div>
            <div className="text-center mb-12">
              <div className="inline-block bg-[#c4a052]/10 text-[#c4a052] px-4 py-2 rounded-full border border-[#c4a052]/20 text-[9px] font-black uppercase tracking-widest mb-6">
                CONTENIDO PLATINUM DESBLOQUEADO
              </div>
              <h2 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase leading-none">{selectedGift.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">{selectedGift.longDescription}</p>
            </div>
            <button 
              onClick={() => { alert("Iniciando descarga segura en tu dispositivo..."); setSelectedGift(null); }}
              className="w-full bg-[#c4a052] text-black py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-[#c4a052]/20 active:scale-95 transition-all flex items-center justify-center"
            >
              <i className="fa-solid fa-cloud-arrow-down mr-3 text-xl"></i> BAJAR AHORA
            </button>
            <button onClick={() => setSelectedGift(null)} className="w-full mt-6 py-4 text-gray-600 font-black text-[10px] uppercase tracking-widest">Regresar</button>
          </div>
        </div>
      )}

      {/* RECIPE MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-[100] bg-black overflow-y-auto">
          <div className="h-[50vh] relative">
            <img src={selectedRecipe.image} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
            <button 
              onClick={() => setSelectedRecipe(null)}
              className="absolute top-12 right-6 w-12 h-12 bg-black/60 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/10 z-10"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          <div className="p-10 pb-32 relative z-0">
            <div className="flex items-center space-x-3 mb-6">
              <span className="bg-[#c4a052] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{selectedRecipe.category}</span>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{selectedRecipe.difficulty}</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">{selectedRecipe.title}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                <div className="text-[9px] text-gray-500 font-black uppercase mb-2 tracking-widest">Impacto Calórico</div>
                <div className="text-xl font-black text-[#c4a052]">{selectedRecipe.calories} kcal</div>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                <div className="text-[9px] text-gray-500 font-black uppercase mb-2 tracking-widest">Tiempo de Prep.</div>
                <div className="text-xl font-black text-white">{selectedRecipe.time}</div>
              </div>
            </div>

            <div className="mb-12">
              <h4 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-8 border-b border-white/5 pb-4">Activos de Nutrición</h4>
              <ul className="space-y-5">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center text-gray-400 text-sm font-medium">
                    <div className="w-5 h-5 bg-green-500/10 border border-green-500/20 rounded flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fa-solid fa-check text-green-500 text-[10px]"></i>
                    </div>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-12">
              <h4 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-8 border-b border-white/5 pb-4">Protocolo de Elaboración</h4>
              <div className="space-y-10">
                {selectedRecipe.instructions.map((step, i) => (
                  <div key={i} className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#c4a052] text-black rounded-xl flex items-center justify-center text-[11px] font-black mr-5 shadow-xl shadow-[#c4a052]/20">{i + 1}</span>
                    <p className="text-gray-400 text-sm leading-relaxed font-medium pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-[#c4a052] text-black py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center mb-10 shadow-2xl shadow-[#c4a052]/20 active:scale-95 transition-all">
              <i className="fa-solid fa-file-pdf mr-3 text-lg"></i> GUARDAR EN MI NUBE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
