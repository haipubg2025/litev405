import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { useStore } from '../store/useStore';

interface NpcUpdateModalProps {
  npc: any;
  npcIndex: number;
  onClose: () => void;
  onApply: (updatedData: any) => void;
}

export default function NpcUpdateModal({ npc, npcIndex, onClose, onApply }: NpcUpdateModalProps) {
  const theme = useStore(state => state.theme);
  const isDark = theme.group === 'Dark';

  const [pending, setPending] = React.useState<any>(npc.pendingUpdates || {});

  // Cập nhật giá trị khi người dùng chỉnh sửa tab cập nhật
  const handleChange = (key: string, val: any) => {
    setPending({ ...pending, [key]: val });
  };

  const handleRemoveField = (key: string) => {
    const updated = { ...pending };
    delete updated[key];
    setPending(updated);
  };

  const handleApply = () => {
    onApply(pending);
  };

  if (!npc) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md`}>
      <div className={`absolute inset-0 ${isDark ? 'bg-black/80' : 'bg-slate-900/40'}`} onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-[95vw] h-[95vh] md:w-[90vw] md:h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${
          isDark 
            ? 'bg-[#0f172a] border border-white/10' 
            : 'bg-white border text-slate-800'
        }`}
      >
        <div className={`p-4 border-b flex justify-between items-center shrink-0 ${isDark ? 'border-white/10' : 'border-slate-200 bg-slate-50'}`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Xác Nhận Update NPC: {npc.name || npc.fullName}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleApply}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              <Check size={18} /> Lưu Thay Đổi
            </button>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-200'}`}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col divide-y border-t border-transparent p-4 gap-4">
          <div className="flex flex-col md:flex-row gap-4 mb-2 sticky top-0 bg-transparent z-10 px-2">
            <div className={`flex-1 text-lg font-bold text-center uppercase tracking-widest py-2 rounded-lg ${isDark ? 'text-blue-400 bg-[#0f172a] shadow-md shadow-black/50' : 'text-blue-600 bg-white shadow-sm'}`}>Nội Dung Gốc</div>
            <div className={`flex-1 text-lg font-bold text-center uppercase tracking-widest py-2 rounded-lg ${isDark ? 'text-green-400 bg-[#0f172a] shadow-md shadow-black/50' : 'text-green-600 bg-white shadow-sm'}`}>Nội Dung Cập Nhật</div>
          </div>

          <div className="flex flex-col gap-6 px-2 pb-20">
            {Object.keys(pending).map((key) => {
              if (key === 'statusData') return null;
              
              const isArray = Array.isArray(npc[key]);
              const isObject = typeof npc[key] === 'object' && npc[key] !== null;
              const originalVal = isArray || isObject ? JSON.stringify(npc[key], null, 2) : npc[key];

              const isUpdatedArray = Array.isArray(pending[key]);
              const isUpdatedObject = typeof pending[key] === 'object' && pending[key] !== null;
              
              return (
                <div key={key} className="flex flex-col md:flex-row gap-4 min-h-[100px]">
                  {/* Cột Gốc */}
                  <div className={`flex-1 p-3 rounded-xl border ${isDark ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'} flex flex-col`}>
                    <span className={`block text-[11px] font-bold uppercase mb-2 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{key}</span>
                    <div className={`text-sm whitespace-pre-wrap opacity-80 flex-1 overflow-auto ${isDark ? 'text-white' : 'text-slate-700'}`}>
                      {originalVal || <span className="italic opacity-50">Không có dữ liệu</span>}
                    </div>
                  </div>

                  {/* Cột Cập Nhật */}
                  <div className={`flex-1 p-3 rounded-xl border relative focus-within:ring-2 ring-green-500/50 ${isDark ? 'bg-green-900/10 border-green-500/30' : 'bg-green-50 border-green-200'} flex flex-col`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[11px] font-bold uppercase ${isDark ? 'text-green-400' : 'text-green-600'}`}>{key}</span>
                      <button onClick={() => handleRemoveField(key)} className="text-[10px] bg-red-500/10 text-red-500 font-bold px-2 py-0.5 rounded hover:bg-red-500 hover:text-white transition-colors">XÓA/BỎ QUA</button>
                    </div>
                    {isUpdatedArray || isUpdatedObject ? (
                      <textarea 
                        value={typeof pending[key] === 'string' ? pending[key] : JSON.stringify(pending[key], null, 2)}
                        onChange={(e) => {
                          try {
                            handleChange(key, JSON.parse(e.target.value));
                          } catch {
                            handleChange(key, e.target.value);
                          }
                        }}
                        className={`w-full h-full text-sm whitespace-pre-wrap outline-none bg-transparent font-mono flex-1 ${isDark ? 'text-white' : 'text-slate-700 bg-white border border-green-200 p-2 rounded'}`}
                      />
                    ) : (
                      <textarea 
                        value={pending[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className={`w-full h-full text-sm outline-none bg-transparent whitespace-pre-wrap flex-1 ${isDark ? 'text-white' : 'text-slate-700 bg-white border border-green-200 p-2 rounded'}`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            
            {pending.statusData && (
              <div className="flex flex-col md:flex-row gap-4 min-h-[150px]">
                <div className={`flex-1 p-3 rounded-xl border ${isDark ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'} flex flex-col`}>
                  <span className={`block text-[11px] font-bold uppercase mb-2 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>statusData (Gốc)</span>
                  <div className={`text-sm whitespace-pre-wrap opacity-80 flex-1 overflow-auto ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    {JSON.stringify(npc.statusData, null, 2)}
                  </div>
                </div>
                
                <div className={`flex-1 p-3 rounded-xl border relative focus-within:ring-2 ring-green-500/50 ${isDark ? 'bg-green-900/10 border-green-500/30' : 'bg-green-50 border-green-200'} flex flex-col`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[11px] font-bold uppercase ${isDark ? 'text-green-400' : 'text-green-600'}`}>statusData (Cập nhật)</span>
                    <button onClick={() => handleRemoveField('statusData')} className="text-[10px] bg-red-500/10 text-red-500 font-bold px-2 py-0.5 rounded hover:bg-red-500 hover:text-white transition-colors">XÓA/BỎ QUA</button>
                  </div>
                  <textarea 
                    value={typeof pending.statusData === 'string' ? pending.statusData : JSON.stringify(pending.statusData, null, 2)}
                    onChange={(e) => {
                      try {
                        handleChange('statusData', JSON.parse(e.target.value));
                      } catch {
                        handleChange('statusData', e.target.value);
                      }
                    }}
                    className={`w-full h-full text-sm whitespace-pre-wrap outline-none bg-transparent font-mono flex-1 ${isDark ? 'text-white' : 'text-slate-700 bg-white border border-green-200 p-2 rounded'}`}
                  />
                </div>
              </div>
            )}

            {Object.keys(pending).length === 0 && (
              <div className="text-center italic opacity-50 p-4">Không còn trường nào để cập nhật.</div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
