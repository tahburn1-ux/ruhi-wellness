import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { AdminSidebar } from "./Dashboard";
import AdminGuard from "@/components/AdminGuard";
import { Mail, MailOpen, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

function AdminMessagesInner() {
  const utils = trpc.useUtils();
  const [statusFilter, setStatusFilter] = useState("");
  const { data: messages = [], isLoading } = trpc.contact.list.useQuery();
  const markRead = trpc.contact.markRead.useMutation({ onSuccess: () => utils.contact.list.invalidate() });
  const del = trpc.contact.delete.useMutation({ onSuccess: () => { utils.contact.list.invalidate(); toast.success("Deleted"); } });
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = (messages as any[]).filter(m => !statusFilter || m.status === statusFilter);

  return (
    <div className="flex min-h-screen bg-[oklch(0.97_0.01_210)]">
      <AdminSidebar active="/admin/messages" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[oklch(0.18_0.05_60)]">Messages</h1>
            <p className="text-[oklch(0.50_0.03_65)] mt-1">Contact form submissions from clients</p>
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 border border-[oklch(0.87_0.025_78)] rounded-xl bg-white text-sm focus:outline-none">
              <option value="">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.58_0.03_65)] pointer-events-none" />
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? [...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />) :
          filtered.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Mail className="w-12 h-12 text-[oklch(0.7_0.03_215)] mx-auto mb-3" />
              <p className="text-[oklch(0.50_0.03_65)]">No messages found.</p>
            </div>
          ) : filtered.map((m: any) => (
            <div key={m.id} className={`glass-card rounded-2xl overflow-hidden transition-all ${m.status === "unread" ? "border-l-4 border-[oklch(0.52_0.10_75)]" : ""}`}>
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-[oklch(0.97_0.005_215)]"
                onClick={() => {
                  setExpanded(expanded === m.id ? null : m.id);
                  if (m.status === "unread") markRead.mutate({ id: m.id });
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.status === "unread" ? "bg-[oklch(0.92_0.03_78)]" : "bg-[oklch(0.96_0.03_78)]"}`}>
                    {m.status === "unread" ? <Mail className="w-4 h-4 text-[oklch(0.52_0.10_75)]" /> : <MailOpen className="w-4 h-4 text-[oklch(0.58_0.03_65)]" />}
                  </div>
                  <div>
                    <div className={`font-medium text-sm ${m.status === "unread" ? "text-[oklch(0.22_0.05_60)]" : "text-[oklch(0.45_0.03_65)]"}`}>
                      {m.fullName}
                    </div>
                    <div className="text-xs text-[oklch(0.58_0.03_65)]">{m.email} · {new Date(m.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {m.status === "unread" && <span className="w-2 h-2 rounded-full bg-[oklch(0.52_0.10_75)]" />}
                  <button onClick={e => { e.stopPropagation(); if (confirm("Delete?")) del.mutate({ id: m.id }); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronDown className={`w-4 h-4 text-[oklch(0.58_0.03_65)] transition-transform ${expanded === m.id ? "rotate-180" : ""}`} />
                </div>
              </div>
              {expanded === m.id && (
                <div className="px-5 pb-5 border-t border-[oklch(0.92_0.01_215)]">
                  <p className="text-sm text-[oklch(0.35_0.04_65)] mt-4 leading-relaxed">{m.inquiry}</p>
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="inline-flex items-center gap-2 mt-4 text-sm text-[oklch(0.52_0.10_75)] font-semibold hover:underline">
                      <Mail className="w-4 h-4" /> Reply via Email
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function AdminMessages() {
  return (
    <AdminGuard>
      <AdminMessagesInner />
    </AdminGuard>
  );
}
