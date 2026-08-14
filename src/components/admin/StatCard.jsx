import React from 'react';

export default function StatCard({ title, value, icon: Icon, badgeColor }) {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3.5 rounded-2xl ${badgeColor} shadow-inner`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}