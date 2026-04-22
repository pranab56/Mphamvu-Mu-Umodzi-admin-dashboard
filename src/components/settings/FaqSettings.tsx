"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

const initialFaqs: FAQ[] = [
  { id: 1, question: "How do I reset my password?", answer: "To reset your password, navigate to the login page and click on 'Forgot Password'. You will receive an email with reset instructions." },
  { id: 2, question: "How do I reset my password?", answer: "To reset your password, navigate to the login page and click on 'Forgot Password'. You will receive an email with reset instructions." },
  { id: 3, question: "How do I track my progress?", answer: "You can track your progress by visiting the 'Dashboard' section. It provides a comprehensive overview of your habit streaks, completion rates, and historical data to help you stay motivated." },
  { id: 4, question: "How do I reset my password?", answer: "To reset your password, navigate to the login page and click on 'Forgot Password'. You will receive an email with reset instructions." },
  { id: 5, question: "How do I reset my password?", answer: "To reset your password, navigate to the login page and click on 'Forgot Password'. You will receive an email with reset instructions." },
  { id: 6, question: "How do I reset my password?", answer: "To reset your password, navigate to the login page and click on 'Forgot Password'. You will receive an email with reset instructions." },
  { id: 7, question: "How do I reset my password?", answer: "To reset your password, navigate to the login page and click on 'Forgot Password'. You will receive an email with reset instructions." },
  { id: 8, question: "How do I reset my password?", answer: "To reset your password, navigate to the login page and click on 'Forgot Password'. You will receive an email with reset instructions." },
  { id: 9, question: "How do I reset my password?", answer: "To reset your password, navigate to the login page and click on 'Forgot Password'. You will receive an email with reset instructions." },
];

type ModalMode = "add" | "edit" | null;

export default function FaqSettings() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [search, setSearch] = useState("");
  const [tableSearch, setTableSearch] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formQuestion, setFormQuestion] = useState("");
  const [formAnswer, setFormAnswer] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAdd = () => {
    setFormQuestion("");
    setFormAnswer("");
    setEditingFaq(null);
    setModalMode("add");
  };

  const openEdit = (faq: FAQ) => {
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setEditingFaq(faq);
    setModalMode("edit");
  };

  const handleSubmit = () => {
    if (!formQuestion.trim() || !formAnswer.trim()) return;
    if (modalMode === "add") {
      setFaqs((prev) => [...prev, { id: Date.now(), question: formQuestion, answer: formAnswer }]);
    } else if (modalMode === "edit" && editingFaq) {
      setFaqs((prev) => prev.map((f) => f.id === editingFaq.id ? { ...f, question: formQuestion, answer: formAnswer } : f));
    }
    setModalMode(null);
  };

  const handleDelete = (id: number) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    setDeleteConfirmId(null);
  };

  const filtered = faqs.filter((f) =>
    f.question.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <div className="w-full py-6 pb-10">
      <div className="w-full flex flex-col gap-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-[#EAECEF] hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
            </button>
            <h1 className="text-[26px] font-extrabold text-[#111827]">FAQ&apos;s Settings</h1>
          </div>
          <p className="text-[13px] text-gray-400 font-medium ml-11">{faqs.length} faq&apos;s</p>
        </div>

        {/* Top Search */}
        <div className="relative w-full flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-gray-400" strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200/80 rounded-xl text-[13px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A53200]/30 shadow-sm"
          />
        </div>

        {/* FAQ List Card */}
        <div className="bg-white border border-gray-200/60 rounded-2xl overflow-hidden shadow-sm">
          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-[16px] font-bold text-gray-900">FAQ List</h2>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-[13px] font-bold rounded-xl hover:bg-primary/80 transition-colors cursor-pointer shadow-sm shadow-primary/20"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
              Add FAQ
            </button>
          </div>

          {/* Table search */}
          <div className="px-6 py-3 border-b border-gray-100 flex justify-end">
            <div className="relative w-full max-w-xs flex items-center">
              <Search className="absolute left-3 w-3.5 h-3.5 text-gray-400" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Search Questions..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F0F2F5] rounded-lg text-[12px] font-medium text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A53200]/20"
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-4">Question</div>
            <div className="col-span-6">Answer Snippet</div>
            <div className="col-span-2">Action</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100">
            {filtered.map((faq) => (
              <div key={faq.id} className="grid grid-cols-12 px-6 py-3.5 items-center hover:bg-gray-50/70 transition-colors">
                <div className="col-span-4 text-[13px] text-gray-700 font-medium pr-4 truncate">{faq.question}</div>
                <div className="col-span-6 text-[13px] text-gray-500 font-medium pr-4 truncate">
                  {faq.answer.slice(0, 45)}..
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <button
                    onClick={() => openEdit(faq)}
                    className="text-[12px] font-bold text-[#D97706] hover:text-[#B45309] transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(faq.id)}
                    className="text-[12px] font-bold text-[#E11D48] hover:text-[#BE123C] transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-4 sm:px-6 py-5 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-[#EAECEF] text-gray-600 text-[12px] font-bold hover:bg-gray-200 cursor-pointer transition-colors flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Previous</span>
            </button>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 rounded-lg text-[12px] font-bold cursor-pointer transition-colors bg-[#A53200] text-white">1</button>
              <button className="w-8 h-8 rounded-lg text-[12px] font-bold cursor-pointer transition-colors bg-[#EAECEF] text-gray-600 hover:bg-gray-200">2</button>
              <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg text-[12px] font-bold cursor-pointer transition-colors bg-[#EAECEF] text-gray-600 hover:bg-gray-200">3</button>
              <span className="text-gray-400 font-bold text-[12px] px-1">...</span>
              <button className="w-8 h-8 rounded-lg bg-[#EAECEF] text-gray-600 text-[12px] font-bold cursor-pointer hover:bg-gray-200">25</button>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-[#A53200] text-white text-[12px] font-bold cursor-pointer hover:bg-[#007BB5] transition-colors flex items-center gap-1">
              <span className="hidden sm:inline">Next</span> <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Add / Edit FAQ Modal ── */}
      <AnimatePresence>
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalMode(null)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative bg-white rounded-[20px] shadow-2xl w-full max-w-lg border border-gray-100 p-8"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-[20px] font-bold text-gray-900">Frequently Asked Questions</h3>
                <p className="text-[13px] text-gray-400 font-medium mt-1">
                  {modalMode === "add" ? "Create a frequently asked question to help users." : "Edit a frequently asked question to help users."}
                </p>
              </div>

              {/* Form */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">FAQ Question</label>
                  <input
                    type="text"
                    placeholder="Enter the question here"
                    value={formQuestion}
                    onChange={(e) => setFormQuestion(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A53200]/30"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Answer</label>
                  <textarea
                    rows={5}
                    placeholder="Provide a detailed answer"
                    value={formAnswer}
                    onChange={(e) => setFormAnswer(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A53200]/30 resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModalMode(null)}
                  className="flex-1 py-3 rounded-xl bg-[#EAECEF] text-gray-700 font-bold text-[14px] hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-[14px] hover:bg-primary/80 transition-colors cursor-pointer shadow-lg shadow-primary/20"
                >
                  {modalMode === "add" ? "Submit" : "Save"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative bg-white rounded-[20px] shadow-2xl w-full max-w-sm border border-gray-100 p-8 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-[#E11D48]" strokeWidth={2} />
              </div>
              <h3 className="text-[18px] font-bold text-gray-900 mb-1">Delete FAQ?</h3>
              <p className="text-[13px] text-gray-400 font-medium mb-6">This action cannot be undone. The FAQ will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-[14px] hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 py-3 rounded-xl bg-[#E11D48] text-white font-bold text-[14px] hover:bg-[#BE123C] transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
