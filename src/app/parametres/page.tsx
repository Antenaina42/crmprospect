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
  AlertCircle,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ParametresPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings State
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpUser, setSmtpUser] = useState("");
  const [whatsAppToken, setWhatsAppToken] = useState("");
  const [voipEndpoint, setVoipEndpoint] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Google Key Test State
  const [testingKey, setTestingKey] = useState(false);
  const [keyTestResult, setKeyTestResult] = useState<{
    valid: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  // Create user modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("COMMERCIAL");
  const [newUserPassword, setNewUserPassword] = useState("admin123");
  const [submittingUser, setSubmittingUser] = useState(false);

  const fetchUsersAndSettings = async () => {
    setLoading(true);
    try {
      const [usersRes, settingsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/settings"),
      ]);

      const usersData = await usersRes.json();
      setUsers(Array.isArray(usersData?.users) ? usersData.users : []);
      setAuditLogs(Array.isArray(usersData?.auditLogs) ? usersData.auditLogs : []);

      const settingsData = await settingsRes.json();
      if (settingsData && !settingsData.error) {
        if (settingsData.googleApiKey) setGoogleApiKey(settingsData.googleApiKey);
        if (settingsData.smtpHost) setSmtpHost(settingsData.smtpHost);
        if (settingsData.smtpUser) setSmtpUser(settingsData.smtpUser);
        if (settingsData.whatsAppToken) setWhatsAppToken(settingsData.whatsAppToken);
        if (settingsData.voipEndpoint) setVoipEndpoint(settingsData.voipEndpoint);
      }
    } catch (e) {
      console.error("Error fetching users and settings:", e);
      setUsers([]);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSavedSuccess(false);
    setSaveError(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleApiKey: googleApiKey.trim(),
          smtpHost: smtpHost.trim(),
          smtpUser: smtpUser.trim(),
          whatsAppToken: whatsAppToken.trim(),
          voipEndpoint: voipEndpoint.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        setSaveError(data.error || "Erreur lors de l'enregistrement");
      }
    } catch (err: any) {
      setSaveError(err.message || "Erreur de connexion");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleTestGoogleKey = async () => {
    if (!googleApiKey.trim()) {
      setKeyTestResult({
        valid: false,
        error: "Veuillez d'abord saisir votre clé API Google Places ci-dessus avant de lancer le test.",
      });
      return;
    }

    setTestingKey(true);
    setKeyTestResult(null);

    try {
      const res = await fetch(`/api/settings?testKey=${encodeURIComponent(googleApiKey.trim())}`);
      const data = await res.json();

      if (data.valid) {
        setKeyTestResult({
          valid: true,
          message: data.message || "Clé API valide et connectée à Google Places !",
        });
      } else {
        setKeyTestResult({
          valid: false,
          error: data.error || "Clé API non acceptée par Google Cloud.",
        });
      }
    } catch (err: any) {
      setKeyTestResult({
        valid: false,
        error: "Impossible de contacter l'API de test : " + err.message,
      });
    } finally {
      setTestingKey(false);
    }
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
        fetchUsersAndSettings();
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Paramètres du CRM Prospect M-It LevelUp</h2>
          <p className="text-xs text-slate-500">
            Gestion des utilisateurs, clé API Google Places, configuration SMTP et règles de prospection.
          </p>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Utilisateur</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Configuration et clé API Google Places enregistrées avec succès !</span>
        </div>
      )}

      {saveError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{saveError}</span>
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
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-brand-600" />
              <span>Clés d'Intégration API</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Persistant
            </span>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-3.5 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Clé API Google Places</label>
                <button
                  type="button"
                  onClick={() => setShowGoogleKey(!showGoogleKey)}
                  className="text-[11px] text-slate-400 hover:text-brand-600 flex items-center gap-1 font-semibold"
                >
                  {showGoogleKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showGoogleKey ? "Masquer" : "Afficher"}</span>
                </button>
              </div>

              <input
                type={showGoogleKey ? "text" : "password"}
                placeholder="AIzaSy..."
                value={googleApiKey}
                onChange={(e) => {
                  setGoogleApiKey(e.target.value);
                  setKeyTestResult(null);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Si vide, le CRM utilise automatiquement le simulateur Madagascar.
              </span>

              {/* Test Key Button */}
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  disabled={testingKey || !googleApiKey.trim()}
                  onClick={handleTestGoogleKey}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-brand-700 border border-indigo-200 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {testingKey ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-brand-600" />}
                  <span>{testingKey ? "Test en cours..." : "Tester la Clé Google"}</span>
                </button>
              </div>

              {/* Test Result Message */}
              {keyTestResult && (
                <div
                  className={`mt-2 p-2.5 rounded-xl border text-[11px] font-medium flex items-start gap-2 ${
                    keyTestResult.valid
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  {keyTestResult.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold">{keyTestResult.valid ? "Succès !" : "Erreur de validation :"}</p>
                    <p className="mt-0.5 leading-relaxed">{keyTestResult.message || keyTestResult.error}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Serveur SMTP Host</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Compte SMTP User</label>
              <input
                type="text"
                placeholder="votre.email@domaine.mg"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {savingSettings ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>Enregistrer la Configuration</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Security and Audit Logs Section */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>Journal d'Audit & Sécurité</span>
        </h3>
        <div className="divide-y divide-slate-100 text-xs">
          {safeAuditLogs.length === 0 ? (
            <p className="py-4 text-slate-400 text-xs">Aucune activité récente enregistrée.</p>
          ) : (
            safeAuditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between">
                <span className="font-semibold text-slate-800">{log.action}</span>
                <span className="text-slate-400 text-[11px]">{new Date(log.createdAt).toLocaleString("fr-FR")}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddUserModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-modal space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-slate-900">Créer un Nouveau Collaborateur</h3>
            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  placeholder="Rakoto Jean"
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
                  placeholder="rakoto@prospectmada.mg"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Rôle dans le CRM</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="COMMERCIAL">Commercial (Portefeuille exclusif)</option>
                  <option value="ADMIN">Admin (Supervision équipe)</option>
                  <option value="SUPER_ADMIN">Super Admin (Accès Total)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mot de passe temporaire</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submittingUser}
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold shadow-xs"
                >
                  {submittingUser ? "Création..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
