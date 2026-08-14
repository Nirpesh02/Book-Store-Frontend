import React, { useState, useEffect } from 'react';
import { membershipAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, XCircle, CheckCircle, Clock, MapPin, Eye, X, IdCard } from 'lucide-react';

export default function MembershipRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { addToast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await membershipAPI.getPendingRequests();
      setRequests(data);
    } catch (error) {
      addToast(error.message || 'Failed to fetch membership requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (userId) => {
    try {
      const response = await membershipAPI.approveRequest(userId);
      addToast(`Approved! New Membership ID: ${response.user.membershipNumber}`, 'success');
      setRequests(requests.filter(req => req._id !== userId));
      setSelectedRequest(null);
    } catch (error) {
      addToast(error.message || 'Failed to approve request', 'error');
    }
  };

  const handleReject = async (userId) => {
    try {
      await membershipAPI.rejectRequest(userId);
      addToast('Membership request rejected', 'success');
      setRequests(requests.filter(req => req._id !== userId));
      setSelectedRequest(null);
    } catch (error) {
      addToast(error.message || 'Failed to reject request', 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-500" />
          Membership Requests
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-500" />
          Membership Requests
        </h2>
        <p className="text-slate-500 mt-1">Review citizenship documents and approve applications for the Kitabghar Premium Membership.</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">All Caught Up!</h3>
          <p className="text-sm text-slate-400 mt-2">There are no pending membership requests at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(request => (
            <div key={request._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent -mr-4 -mt-4 rounded-bl-full pointer-events-none"></div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-lg text-slate-400 border border-slate-200 shrink-0">
                  {request.avatar ? (
                    <img src={request.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    request.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 leading-tight">{request.name}</h3>
                  <p className="text-xs text-slate-500 mb-1 truncate">{request.email}</p>
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    <Clock className="w-3 h-3" />
                    Pending Review
                  </span>
                </div>
              </div>

              {/* Location Preview */}
              {request.location && (
                <div className="mt-3 flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">{request.location}</p>
                </div>
              )}

              {/* Citizenship Thumbnails */}
              {(request.citizenshipFront || request.citizenshipBack) && (
                <div className="mt-3 flex gap-2">
                  {request.citizenshipFront && (
                    <div className="w-1/2 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={request.citizenshipFront} alt="ID Front" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {request.citizenshipBack && (
                    <div className="w-1/2 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={request.citizenshipBack} alt="ID Back" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl transition-colors border border-blue-100 flex justify-center items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> View Details
                </button>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => handleReject(request._id)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold rounded-xl transition-colors border border-transparent hover:border-rose-200 flex justify-center items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button
                  onClick={() => handleApprove(request._id)}
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all flex justify-center items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center font-bold text-2xl text-slate-400 border-2 border-slate-200 shrink-0 overflow-hidden">
                {selectedRequest.avatar ? (
                  <img src={selectedRequest.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  selectedRequest.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selectedRequest.name}</h2>
                <p className="text-sm text-slate-500">{selectedRequest.email}</p>
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg text-xs font-bold mt-1">
                  <Clock className="w-3 h-3" />
                  Pending Review
                </span>
              </div>
            </div>

            {/* Client Info Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Current Tier</p>
                <p className="text-sm font-bold text-slate-700">{selectedRequest.tier || 'Standard'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Account Status</p>
                <p className="text-sm font-bold text-slate-700">{selectedRequest.status}</p>
              </div>
              <div className="col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-500" /> Location
                </p>
                <p className="text-sm font-semibold text-slate-700">{selectedRequest.location || 'Not provided'}</p>
              </div>
            </div>

            {/* Citizenship Documents */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
                <IdCard className="w-4 h-4 text-amber-500" /> Citizenship Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">Front Side</p>
                  {selectedRequest.citizenshipFront ? (
                    <a href={selectedRequest.citizenshipFront} target="_blank" rel="noopener noreferrer" className="block">
                      <img
                        src={selectedRequest.citizenshipFront}
                        alt="Citizenship Front"
                        className="w-full h-48 object-cover rounded-xl border border-slate-200 hover:shadow-lg transition-shadow cursor-pointer"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-48 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-xs text-slate-400">
                      Not uploaded
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">Back Side</p>
                  {selectedRequest.citizenshipBack ? (
                    <a href={selectedRequest.citizenshipBack} target="_blank" rel="noopener noreferrer" className="block">
                      <img
                        src={selectedRequest.citizenshipBack}
                        alt="Citizenship Back"
                        className="w-full h-48 object-cover rounded-xl border border-slate-200 hover:shadow-lg transition-shadow cursor-pointer"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-48 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-xs text-slate-400">
                      Not uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleReject(selectedRequest._id)}
                className="flex-1 py-3 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-sm font-bold rounded-xl transition-colors border border-transparent hover:border-rose-200 flex justify-center items-center gap-2 cursor-pointer"
              >
                <XCircle className="w-5 h-5" /> Reject Application
              </button>
              <button
                onClick={() => handleApprove(selectedRequest._id)}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex justify-center items-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-5 h-5" /> Approve & Generate ID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
