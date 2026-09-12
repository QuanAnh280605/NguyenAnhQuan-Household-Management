'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mockFeedbacks } from '@/lib/mock-data';
import { Feedback, FeedbackCategory, FeedbackStatus } from '@/types';

export default function PhanAnhPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(mockFeedbacks);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);

  // New Ticket Form State
  const [newRoomNumber, setNewRoomNumber] = useState('A-1205');
  const [newResidentName, setNewResidentName] = useState('Trần Hoàng Nam');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<FeedbackCategory>('REPAIR');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');

  // Handle Ticket Form State
  const [handleStatus, setHandleStatus] = useState<FeedbackStatus>('IN_PROGRESS');
  const [handleAssignee, setHandleAssignee] = useState('KTV. Lê Văn Bình');
  const [handleNote, setHandleNote] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter logic
  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesSearch =
      fb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fb.content && fb.content.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'ALL' || fb.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'ALL' || fb.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Dynamic KPIs
  const totalTickets = feedbacks.length;
  const inProgressTickets = feedbacks.filter((f) => f.status === 'IN_PROGRESS').length;
  const resolvedTickets = feedbacks.filter((f) => f.status === 'RESOLVED' || f.status === 'CLOSED').length;
  const urgentTickets = feedbacks.filter((f) => f.priority === 'URGENT').length;

  // Create new ticket
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Feedback = {
      id: `fb-${Date.now()}`,
      apartmentId: `apt-${newRoomNumber.toLowerCase().replace('-', '')}`,
      roomNumber: newRoomNumber,
      residentName: newResidentName,
      title: newTitle,
      content: newContent,
      category: newCategory,
      priority: newPriority,
      status: 'OPEN',
      createdAt: 'Vừa xong',
      updatedAt: 'Vừa xong',
    };

    setFeedbacks([created, ...feedbacks]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setSuccessToast(`Đã tiếp nhận phản ánh mới từ căn hộ ${newRoomNumber}!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Open triage modal
  const handleOpenTriage = (fb: Feedback) => {
    setEditingFeedback(fb);
    setHandleStatus(fb.status);
    setHandleAssignee(fb.assignedTo || 'KTV. Lê Văn Bình');
    setHandleNote('');
  };

  // Submit triage update
  const handleSaveTriage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeedback) return;

    const updated = feedbacks.map((fb) =>
      fb.id === editingFeedback.id
        ? {
            ...fb,
            status: handleStatus,
            assignedTo: handleAssignee,
            updatedAt: 'Vừa xong',
          }
        : fb
    );

    setFeedbacks(updated);
    setEditingFeedback(null);
    setSuccessToast(`Cập nhật tiến độ phản ánh "${editingFeedback.title}" thành công!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-pulse">
            <span className="material-symbols-outlined text-[13px]">bolt</span>
            Khẩn cấp
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            Ưu tiên cao
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
            Bình thường
          </span>
        );
      default:
        return (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-outline">
            Thấp
          </span>
        );
    }
  };

  const getStatusBadge = (status: FeedbackStatus) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            <span className="material-symbols-outlined text-[14px]">task_alt</span>
            Đã giải quyết
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
            <span className="material-symbols-outlined text-[14px]">engineering</span>
            Đang xử lý
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-surface-container-high text-outline">
            Đã đóng
          </span>
        );
      case 'OPEN':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
            <span className="material-symbols-outlined text-[14px]">inbox</span>
            Chờ tiếp nhận
          </span>
        );
    }
  };

  const getCategoryIcon = (category: FeedbackCategory) => {
    switch (category) {
      case 'REPAIR':
        return 'home_repair_service';
      case 'NOISE':
        return 'volume_up';
      case 'CLEANING':
        return 'cleaning_services';
      case 'SECURITY':
        return 'shield';
      case 'SERVICE':
        return 'support_agent';
      default:
        return 'chat';
    }
  };

  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-7xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold animate-bounce">
          <span className="material-symbols-outlined text-[20px]">verified</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Phản Ánh & Tiếp Nhận Yêu Cầu
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold">
              SLA Vận hành
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Hệ thống tiếp nhận khiếu nại, điều phối kỹ thuật viên và kiểm soát tiến độ xử lý sự cố.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary-container text-white shadow-sm hover:bg-primary transition-colors font-label-md text-label-md font-semibold self-start sm:self-auto"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add_task</span>
          <span>Tạo phiếu tiếp nhận mới</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between text-outline">
            <span className="text-xs uppercase font-semibold">Tổng phản ánh</span>
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          </div>
          <div className="font-metric-display text-2xl font-bold text-on-surface mt-1">
            {totalTickets} phiếu
          </div>
          <p className="text-xs text-on-surface-variant mt-1">Ghi nhận trong tháng</p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs uppercase font-semibold">Đang xử lý</span>
            <span className="material-symbols-outlined text-[20px]">engineering</span>
          </div>
          <div className="font-metric-display text-2xl font-bold text-blue-700 mt-1">
            {inProgressTickets} việc
          </div>
          <p className="text-xs text-blue-700 font-semibold mt-1">Đã phân công kỹ thuật</p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs uppercase font-semibold">Đã hoàn thành</span>
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
          <div className="font-metric-display text-2xl font-bold text-emerald-700 mt-1">
            {resolvedTickets} việc
          </div>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            Tỷ lệ xử lý: {totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0}%
          </p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs uppercase font-semibold">Sự cố khẩn cấp</span>
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div className="font-metric-display text-2xl font-bold text-rose-700 mt-1">
            {urgentTickets} sự cố
          </div>
          <p className="text-xs text-rose-700 font-semibold mt-1">Cần can thiệp ngay lập tức</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề, người gửi, số phòng (A-1205)..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Lọc theo phân loại phản ánh"
              className="px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            >
              <option value="ALL">Tất cả phân loại</option>
              <option value="REPAIR">Kỹ thuật & Sửa chữa</option>
              <option value="NOISE">Tiếng ồn & Trật tự</option>
              <option value="CLEANING">Vệ sinh môi trường</option>
              <option value="SECURITY">An ninh trật tự</option>
              <option value="SERVICE">Dịch vụ cư dân</option>
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-outline-variant/15 pt-3">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'OPEN', label: 'Chờ tiếp nhận' },
            { id: 'IN_PROGRESS', label: 'Đang xử lý' },
            { id: 'RESOLVED', label: 'Đã giải quyết' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredFeedbacks.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest rounded-xl border border-outline-variant/20 text-on-surface-variant text-sm">
            Không tìm thấy phản ánh nào phù hợp.
          </div>
        ) : (
          filteredFeedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/20 hover:border-outline-variant/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="p-1.5 rounded-lg bg-surface-container-low text-primary">
                    <span className="material-symbols-outlined text-[18px]">
                      {getCategoryIcon(fb.category)}
                    </span>
                  </span>
                  <h3 className="font-bold text-base text-on-surface">{fb.title}</h3>
                  {getPriorityBadge(fb.priority)}
                  <span className="text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                    {fb.category}
                  </span>
                </div>

                {fb.content && (
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed pl-8">
                    {fb.content}
                  </p>
                )}

                <div className="flex items-center gap-3 text-xs text-outline flex-wrap pl-8 pt-1">
                  <Link
                    href={`/can-ho/${fb.roomNumber}`}
                    className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">apartment</span>
                    Căn {fb.roomNumber}
                  </Link>
                  <span>•</span>
                  <span>Người gửi: <strong className="text-on-surface">{fb.residentName}</strong></span>
                  <span>•</span>
                  <span>Tiếp nhận: {fb.createdAt}</span>
                  {fb.assignedTo && (
                    <>
                      <span>•</span>
                      <span className="text-blue-700 font-medium inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">person</span>
                        {fb.assignedTo}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                <div>{getStatusBadge(fb.status)}</div>
                <button
                  onClick={() => handleOpenTriage(fb)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 text-on-surface transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_note</span>
                  Cập nhật tiến độ
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Tạo phiếu tiếp nhận mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-outline-variant/20 flex items-center justify-between bg-primary-container/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">add_task</span>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Tiếp Nhận Phản Ánh Mới</h3>
                  <p className="text-xs text-on-surface-variant">Lập phiếu ghi nhận khiếu nại hoặc sự cố kỹ thuật</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-on-surface-variant hover:bg-surface-container-high p-1 rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Căn hộ liên quan *</label>
                  <input
                    type="text"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    required
                    placeholder="VD: A-1205"
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Người gửi yêu cầu *</label>
                  <input
                    type="text"
                    value={newResidentName}
                    onChange={(e) => setNewResidentName(e.target.value)}
                    required
                    placeholder="Tên cư dân"
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Tiêu đề phản ánh *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="Tóm tắt ngắn gọn sự cố hoặc yêu cầu"
                  className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Phân loại sự cố</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as FeedbackCategory)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="REPAIR">Kỹ thuật & Sửa chữa</option>
                    <option value="NOISE">Tiếng ồn & Trật tự</option>
                    <option value="CLEANING">Vệ sinh môi trường</option>
                    <option value="SECURITY">An ninh trật tự</option>
                    <option value="SERVICE">Dịch vụ cư dân</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Mức độ ưu tiên</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="LOW">Thấp</option>
                    <option value="MEDIUM">Bình thường</option>
                    <option value="HIGH">Ưu tiên cao</option>
                    <option value="URGENT">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Nội dung chi tiết</label>
                <textarea
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Mô tả cụ thể hiện trạng sự cố, vị trí xảy ra..."
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-primary-container text-white hover:bg-primary rounded-lg shadow-sm transition-colors"
                >
                  Tạo phiếu tiếp nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cập nhật tiến độ & Điều phối */}
      {editingFeedback && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/50">
              <div>
                <span className="text-[10px] uppercase font-bold text-outline">Xử lý phản ánh</span>
                <h3 className="font-bold text-base text-on-surface mt-0.5">{editingFeedback.title}</h3>
                <p className="text-xs text-on-surface-variant">Căn hộ {editingFeedback.roomNumber} • {editingFeedback.residentName}</p>
              </div>
              <button
                onClick={() => setEditingFeedback(null)}
                className="text-on-surface-variant hover:bg-surface-container-high p-1 rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveTriage} className="p-5 space-y-4 text-xs">
              {editingFeedback.content && (
                <div className="p-3 bg-surface-container-low rounded-xl text-on-surface-variant italic leading-relaxed">
                  "{editingFeedback.content}"
                </div>
              )}

              <div>
                <label className="block font-bold text-on-surface mb-1">Trạng thái xử lý *</label>
                <select
                  value={handleStatus}
                  onChange={(e) => setHandleStatus(e.target.value as FeedbackStatus)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="OPEN">Chờ tiếp nhận</option>
                  <option value="IN_PROGRESS">Đang xử lý / Đã phân công</option>
                  <option value="RESOLVED">Đã giải quyết (chờ nghiệm thu)</option>
                  <option value="CLOSED">Đã đóng phiếu</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Nhân viên / Kỹ thuật viên phụ trách *</label>
                <select
                  value={handleAssignee}
                  onChange={(e) => setHandleAssignee(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  <option value="KTV. Lê Văn Bình">KTV. Lê Văn Bình (Điện nước)</option>
                  <option value="KTV. Đỗ Mạnh Dũng">KTV. Đỗ Mạnh Dũng (Thang máy & PCCC)</option>
                  <option value="BV. Hoàng Đình Tùng">BV. Hoàng Đình Tùng (An ninh ca ngày)</option>
                  <option value="Đội trưởng BV. Trần Văn Hải">Đội trưởng BV. Trần Văn Hải</option>
                  <option value="Tạp vụ. Nguyễn Thị Mai">Tạp vụ. Nguyễn Thị Mai (Vệ sinh)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Ghi chú tiến độ / Báo cáo nghiệm thu</label>
                <textarea
                  rows={3}
                  value={handleNote}
                  onChange={(e) => setHandleNote(e.target.value)}
                  placeholder="Ghi nhận hiện trường, vật tư đã thay thế, thời gian hẹn cư dân..."
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingFeedback(null)}
                  className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-container rounded-lg shadow-sm transition-colors"
                >
                  Lưu thay đổi & Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
