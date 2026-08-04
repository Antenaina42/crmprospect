"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  Users,
  Key,
  Mail,
  MessageSquare,
  PhoneCall,
  Database,
  ShieldCheck,
  Plus,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function ParametresPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings State
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpUser, setSmtpUser] = useState("prospect@prospectmada.mg");
  const [whatsAppToken, setWhatsAppToken] = useState("");
  const [voipEndpoint, setVoipEndpoint] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Create user modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("COMMERCIAL");
  const [newUserPassword, setNewUserPassword] = useState("admin123");
  const [submittingUser, setSubmittingUser] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(Array.isArray(data?.users) ? data.users : []);
      setAuditLogs(Array.isArray(data?.auditLogs) ? data.auditLogs : []);
    } catch (e) {
      console.error(e);
      setUsers([]);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingUser(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          role: newUserRole,
          password: newUserPassword,
        }),
      });

      if (res.ok) {
        setShowAddUserModal(false);
        setNewUserName("");
        setNewUserEmail("");
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingUser(false);
    }
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const safeAuditLogs = Array.isArray(auditLogs) ? auditLogs : [];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
            Administration & Sécurité
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Paramètres du CRM Prospect Mada</h2>
          <p className="text-xs text-slate-500">
            Gestion des utilisateurs, des clés API Google Places, SMTP, WhatsApp et règles de sécurité.
          </p>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel Utilisateur</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Paramètres sauvegardés avec succès.</span>
        </div>
      )}

      {/* Main Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management Section */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-600" />
              <span>Gestion des Utilisateurs & Rôles</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">{safeUsers.length} comptes actifs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-3">Nom & Email</th>
                  <th className="py-3 px-3">Rôle</th>
                  <th className="py-3 px-3">Portefeuille</th>
                  <th className="py-3 px-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {safeUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-slate-400">
                      Aucun utilisateur trouvé ou chargement...
                    </td>
                  </tr>
                ) : (
                  safeUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === "SUPER_ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : u.role === "ADMIN"
                              ? "bg-brand-100 text-brand-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-600">
                        {u._count?.assignedProspects || 0} prospects
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          Actif
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Integration API Config */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-brand-600" />
            <span>Clés d'Intégration API</span>
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Clé API Google Places</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Laisser vide pour utiliser le simulateur Madagascar.
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Serveur SMTP Host</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Business API (Futur)</span>
                </label>
                <input
                  type="text"
                  placeholder="Token WhatsApp Business..."
                  value={whatsAppToken}
                  onChange={(e) => setWhatsAppToken(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                  <span>Téléphonie VoIP PBX (Futur)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://pbx.prospectmada.mg/api"
                  value={voipEndpoint}
                  onChange={(e) => setVoipEndpoint(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-xs"
            >
              Enregistrer la Configuration
            </button>
          </form>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Journal des Connexions & Actions de Sécurité</span>
        </h3>

        <div className="space-y-2">
          {safeAuditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">{log.action}</span>
                <span className="text-slate-500 ml-2">{log.details}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {new Date(log.createdAt).toLocaleString("fr-FR")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-modal">
            <h3 className="text-base font-bold text-slate-900 mb-4">Créer un Compte Utilisateur</h3>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Raveloson Jean"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Adresse Email</label>
                <input
                  type="email"
                  required
                  placeholder="raveloson@prospectmada.mg"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Rôle d'Accès</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="ADMIN">Admin (Chef Ventes)</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mot de Passe Initial</label>
                <input
                  type="text"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submittingUser}
                  className="flex-1 py-2 bg-brand-600 text-white rounded-xl font-bold shadow-xs"
                >
                  {submittingUser ? "Création..." : "Créer le Compte"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
