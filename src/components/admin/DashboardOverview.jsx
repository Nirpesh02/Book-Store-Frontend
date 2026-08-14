import React from 'react';
import StatCard from './StatCard';
import { BookOpen, Users, ShoppingBag, RotateCcw, ArrowUpRight, DollarSign, Star, Banknote, Truck } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function DashboardOverview({ onNavigate }) {
  const { books, customers, history, reviews } = useLibrary();

  const totalStock = books.reduce((acc, b) => acc + Number(b.copies), 0);
  const activeCustomers = customers.filter((p) => p.status === 'Active').length;
  const purchasedOrders = history.filter((h) => h.status === 'Purchased');
  const totalSold = purchasedOrders.length;
  const refundCount = history.filter((h) => h.status === 'Refunded').length;
  const pendingDeliveries = history.filter((h) => h.status === 'Purchased' && h.deliveryStatus === 'Pending').length;

  const totalRevenue = purchasedOrders.reduce((sum, order) => {
    const book = books.find((b) => (b._id || b.id) === order.bookId);
    const amount = order.totalAmount || ((book?.price || 0) * (order.quantity || 1));
    return sum + amount;
  }, 0);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const stats = [
    { title: 'Total Revenue', value: `रु. ${totalRevenue.toLocaleString()}`, icon: Banknote, badgeColor: 'bg-emerald-50 text-emerald-600' },
    { title: 'Total Stock', value: totalStock.toLocaleString(), icon: BookOpen, badgeColor: 'bg-blue-50 text-blue-600' },
    { title: 'Active Customers', value: activeCustomers.toLocaleString(), icon: Users, badgeColor: 'bg-violet-50 text-violet-600' },
    { title: 'Books Sold', value: totalSold.toString(), icon: ShoppingBag, badgeColor: 'bg-amber-50 text-amber-600' },
    { title: 'Pending Deliveries', value: pendingDeliveries.toString(), icon: Truck, badgeColor: 'bg-indigo-50 text-indigo-600' },
    { title: 'Avg. Rating', value: `${avgRating} ★`, icon: Star, badgeColor: 'bg-amber-50 text-amber-600' },
    { title: 'Refunds', value: refundCount.toString(), icon: RotateCcw, badgeColor: 'bg-rose-50 text-rose-600' },
  ];

  // ===== CHART DATA PREPARATION =====

  // 1. Sales by Category (Pie Chart)
  const categorySales = {};
  purchasedOrders.forEach((order) => {
    const book = books.find((b) => (b._id || b.id) === order.bookId);
    if (book) {
      const cat = book.category || 'Other';
      categorySales[cat] = (categorySales[cat] || 0) + 1;
    }
  });

  const pieData = Object.keys(categorySales).map((key) => ({
    name: key,
    value: categorySales[key],
  }));

  const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e'];

  // 2. Revenue Trends (Area Chart - Last 7 Days)
  const revenueByDate = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    revenueByDate[dateStr] = 0;
  }

  purchasedOrders.forEach((order) => {
    if (order.orderDate && revenueByDate[order.orderDate] !== undefined) {
      const book = books.find((b) => (b._id || b.id) === order.bookId);
      const amount = order.totalAmount || ((book?.price || 0) * (order.quantity || 1));
      revenueByDate[order.orderDate] += amount;
    }
  });

  // 3. Top Sellers logic
  const bookSales = {};
  purchasedOrders.forEach(order => {
    bookSales[order.bookId] = (bookSales[order.bookId] || 0) + (order.quantity || 1);
  });
  
  const topSellers = [...books]
    .sort((a, b) => (bookSales[b._id || b.id] || 0) - (bookSales[a._id || a.id] || 0))
    .slice(0, 4);

  const areaData = Object.keys(revenueByDate).sort().map((date) => ({
    date: date.slice(5), // MM-DD
    revenue: revenueByDate[date]
  }));

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Analytics row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-lg">Revenue Trend (7 Days)</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(val) => `Rs.${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`Rs. ${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category Donut */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-lg">Sales by Category</h2>
          </div>
          <div className="h-64 w-full flex flex-col items-center justify-center relative">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-slate-400 flex items-center justify-center h-full">No sales data yet</div>
            )}
            
            {/* Custom Legend inside the box */}
            {pieData.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-slate-600">{entry.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Sellers */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-lg">Top Sellers</h2>
            <button onClick={() => onNavigate('catalog')} className="text-xs text-amber-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
              Inventory <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {topSellers.map((book) => (
              <div key={book._id || book.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center text-xs">
                    {book.coverImages && book.coverImages.length > 0 ? (
                      <img src={book.coverImages[0]} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      '📖'
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm truncate max-w-[150px]">{book.title}</h4>
                    <p className="text-xs text-slate-400">{bookSales[book._id || book.id] || 0} copies sold</p>
                  </div>
                </div>
              </div>
            ))}
            {topSellers.length === 0 && (
              <div className="text-xs text-slate-400 py-4">No books available.</div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-lg">Recent Orders</h2>
            <button onClick={() => onNavigate('history')} className="text-xs text-amber-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
              History <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-medium text-xs uppercase">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Date</th>
                  <th className="py-3 px-4">Activity</th>
                  <th className="py-3 px-4">Book Title</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.slice(0, 4).map((row) => (
                  <tr key={row._id || row.id}>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{row.orderDate}</td>
                    <td className="py-3.5 px-4 font-medium">{row.activity}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{row.bookTitle}</td>
                    <td className="py-3.5 px-4">{row.customerName}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        row.status === 'Purchased' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {history.length === 0 && (
              <div className="text-xs text-slate-400 py-4 text-center w-full">No recent orders.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}