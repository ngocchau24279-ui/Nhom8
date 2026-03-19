import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageSquare, BarChart3, AlertCircle, CheckCircle2, MinusCircle, Loader2, RefreshCcw, Quote, TrendingUp, Info } from 'lucide-react';
import { analyzeSentiment, SentimentResult } from './services/sentimentService';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeSentiment(input);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không mong muốn');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'Tích cực';
      case 'Negative': return 'Tiêu cực';
      default: return 'Trung lập';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Negative': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return <CheckCircle2 className="w-5 h-5" />;
      case 'Negative': return <AlertCircle className="w-5 h-5" />;
      default: return <MinusCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#F8F9FB]">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-zinc-900">Phân Tích Cảm Xúc</h1>
                <p className="text-zinc-500 text-sm">Thấu hiểu khách hàng qua từng câu chữ</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  Nội dung phản hồi
                </label>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {input.length} ký tự
                </span>
              </div>
              
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ví dụ: Sản phẩm dùng rất tốt, nhân viên nhiệt tình nhưng giao hàng hơi chậm một chút..."
                  className="w-full h-48 p-5 rounded-2xl bg-zinc-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white transition-all resize-none placeholder:text-zinc-300 text-zinc-700 leading-relaxed outline-none"
                />
                <div className="absolute bottom-4 right-4 text-zinc-300">
                  <Quote className="w-8 h-8 opacity-20" />
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang phân tích...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Bắt đầu phân tích
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50 flex items-start gap-4">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-600/80 leading-relaxed">
              Hệ thống sử dụng mô hình Gemini AI để nhận diện sắc thái biểu cảm, giúp bạn đánh giá mức độ hài lòng của khách hàng một cách khách quan nhất.
            </p>
          </div>
        </motion.div>

        {/* Right Column: Results */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5"
        >
          <AnimatePresence mode="wait">
            {!result && !loading && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-8 bg-white rounded-[32px] border-2 border-dashed border-zinc-100 text-center space-y-4"
              >
                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-zinc-200" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-400">Chưa có dữ liệu</h3>
                  <p className="text-sm text-zinc-300">Nhập phản hồi bên trái để xem kết quả</p>
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-8 bg-white rounded-[32px] border border-zinc-100 text-center space-y-6"
              >
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-indigo-50 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-zinc-900">Đang xử lý dữ liệu</h3>
                  <p className="text-sm text-zinc-500">AI đang đọc và cảm nhận văn bản của bạn...</p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-rose-50 rounded-[32px] border border-rose-100 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="font-bold text-rose-900">Đã có lỗi xảy ra</h3>
                <p className="text-sm text-rose-600">{error}</p>
                <button 
                  onClick={handleAnalyze}
                  className="px-6 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold"
                >
                  Thử lại
                </button>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[32px] shadow-xl shadow-zinc-200/30 border border-zinc-100 space-y-8"
              >
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Kết quả phân tích</span>
                  <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 font-bold text-lg ${getSentimentColor(result.sentiment)}`}>
                    {getSentimentIcon(result.sentiment)}
                    {getSentimentLabel(result.sentiment)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-bold text-zinc-500">Chỉ số cảm xúc</span>
                    <span className="text-4xl font-display font-black text-zinc-900">{result.score}<span className="text-lg text-zinc-300 ml-1">%</span></span>
                  </div>
                  <div className="h-4 w-full bg-zinc-50 rounded-full p-1 border border-zinc-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.score}%` }}
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.sentiment === 'Positive' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 
                        result.sentiment === 'Negative' ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]' : 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Nhận định từ AI</span>
                  <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 relative">
                    <Quote className="w-6 h-6 text-zinc-200 absolute -top-3 -left-1 rotate-180" />
                    <p className="text-zinc-600 text-sm leading-relaxed italic">
                      {result.explanation}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setInput('');
                    setResult(null);
                  }}
                  className="w-full py-4 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Làm mới
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <footer className="mt-12 text-zinc-300 text-[10px] tracking-[0.3em] uppercase font-bold">
        Sentiment Analysis Dashboard • v1.0
      </footer>
    </div>
  );
}
