import React, { useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function ClientStatsChart() {
  const { books } = useLibrary();

  const stats = useMemo(() => {
    if (!books || books.length === 0) return { totalSold: 0, chartData: [] };

    let totalSold = 0;
    const categorySales = {};

    books.forEach(book => {
      const initial = book.copies || book.totalCopies || 0;
      const available = book.available || book.availableCopies || 0;
      
      // Calculate sold books dynamically based on difference between total copies and available stock
      const sold = Math.max(0, initial - available);
      totalSold += sold;

      const cat = book.category || 'Uncategorized';
      if (!categorySales[cat]) categorySales[cat] = 0;
      categorySales[cat] += sold;
    });

    const chartData = Object.keys(categorySales)
      .map(key => ({
        name: key,
        sold: categorySales[key]
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5); // Top 5 categories

    return { totalSold, chartData };
  }, [books]);

  // Premium golden-brown gradient colors for the chart
  const colors = ['#c28453', '#8a5a44', '#a0683a', '#d4a017', '#ebdcc2'];

  return (
    <section className="w-full bg-[#fcfaf7] py-20 border-t border-[#eadac2]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-16 gap-4 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#f9f4ec] border border-[#eadac2] shadow-sm mb-2">
            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shadow-sm text-[#a0683a]">05</span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-sans pr-2 text-[#a0683a]">Our Impact</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#3e2723] tracking-tight font-bold">
            The Numbers <span className="italic text-[#a0683a] font-medium">Speak</span>.
          </h2>
          <p className="text-[#6d5b53] font-serif text-lg max-w-2xl mx-auto mt-2">
            See how many literary adventures have been embarked upon through Kitabghar. Our community's love for reading is growing every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Total Block */}
          <div className="col-span-1 flex flex-col gap-6 w-full">
             <div className="bg-white rounded-[2rem] p-8 border border-[#eadac2] shadow-sm flex flex-col items-center justify-center text-center h-[380px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-20 h-20 bg-[#f4ebd9] rounded-full flex items-center justify-center text-[#a0683a] mb-8 border-4 border-white shadow-[0_0_20px_rgba(194,132,83,0.3)]">
                  <TrendingUp className="w-10 h-10" />
                </div>
                <h3 className="text-6xl font-serif text-[#3e2723] font-bold mb-4">{stats.totalSold.toLocaleString()}+</h3>
                <p className="text-xs tracking-[0.2em] text-[#8a5a44] font-bold uppercase">Books Delivered</p>
             </div>
          </div>

          {/* Chart Block */}
          <div className="col-span-1 lg:col-span-2 bg-white rounded-[2rem] p-8 sm:p-10 border border-[#eadac2] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-[380px] flex flex-col">
            <h3 className="text-xl font-bold text-[#3e2723] font-serif mb-6 inline-flex items-center gap-2">
               Popular Genres by Sales
            </h3>
            <div className="w-full flex-1">
              {stats.chartData.length > 0 && stats.totalSold > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#8a5a44', fontSize: 12, fontFamily: 'sans-serif', fontWeight: '600' }}
                      dy={15}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#8a5a44', fontSize: 12, fontWeight: '600' }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f4ebd9', opacity: 0.5 }}
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: '1px solid #eadac2', 
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 
                        fontFamily: 'sans-serif', 
                        fontWeight: 'bold',
                        color: '#3e2723'
                      }}
                    />
                    <Bar dataKey="sold" radius={[8, 8, 4, 4]}>
                      {stats.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#6d5b53] font-serif opacity-70">
                  <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
                  <p>Not enough sales data available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
