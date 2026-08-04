"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, Download, FileSpreadsheet, FileText, RefreshCw, Users, PhoneCall, Calendar, TrendingUp } from "lucide-react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function StatistiquesPage() {
  const [stats, setStats] = useState<any>(null);
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sRes = await fetch("/api/stats");
      const sData = await sRes.json();
      setStats(sData);

      const pRes = await fetch("/api/prospects");
      const pData = await pRes.json();
      setProspects(pData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportExcel = () => {
    const exportData = prospects.map((p) => ({
      ID: p.id,
      Nom: p.name,
      Catégorie: p.category,
      Téléphone: p.phone,
      Email: p.email || "",
      Adresse: p.address,
      Ville: p.city,
      Région: p.region,
      Statut: p.status,
      Priorité: p.priority,
      Client: p.isClient ? "Oui" : "Non",
      DateImport: new Date(p.importedAt).toLocaleDateString("fr-FR"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prospects");
    XLSX.writeFile(workbook, `ProspectMada_Export_${Date.now()}.xlsx`);
  };

  const exportCSV = () => {
    const exportData = prospects.map((p) => ({
      Nom: p.name,
      Catégorie: p.category,
      Téléphone: p.phone,
      Email: p.email || "",
      Ville: p.city,
      Statut: p.status,
      Priorité: p.priority,
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ProspectMada_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDFReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.text("RAPPORT D'ACTIVITÉ PROSPECTION B2B", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")} - Prospect Mada CRM`, 14, 26);

    const kpis = stats?.kpis || {};
    const tableData = [
      ["Total Prospects", kpis.totalProspects || 0],
      ["Nouveaux Prospects", kpis.newProspects || 0],
      ["Prospects Contactés", kpis.contacted || 0],
      ["Prospects Intéressés", kpis.interested || 0],
      ["Portefeuille Clients Signés", kpis.converted || 0],
      ["Taux de Conversion Globale", `${kpis.conversionRate || 0}%`],
      ["Total Appels Téléphoniques", kpis.totalCalls || 0],
    ];

    autoTable(doc, {
      startY: 35,
      head: [["Indicateur Clé de Performance (KPI)", "Valeur"]],
      body: tableData,
      headStyles: { fillColor: [79, 70, 229] },
    });

    doc.save(`Rapport_Performance_ProspectMada_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
            Centre Export & Reports
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Rapports & Exports de Données</h2>
          <p className="text-xs text-slate-500">
            Exportez l'ensemble de votre base prospects/clients aux formats Excel (.xlsx), CSV ou PDF.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportExcel}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportPDFReport}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Rapport PDF</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Overview */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Base Prospects</h4>
            <span className="text-3xl font-bold text-slate-900">{stats?.kpis?.totalProspects || 0}</span>
            <p className="text-xs text-slate-500 mt-1">Prospects référencés dans l'application</p>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Appels Effectués</h4>
            <span className="text-3xl font-bold text-brand-600">{stats?.kpis?.totalCalls || 0}</span>
            <p className="text-xs text-slate-500 mt-1">Compte-rendus d'appels téléphoniques enregistrés</p>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Taux de Conversion</h4>
            <span className="text-3xl font-bold text-emerald-600">{stats?.kpis?.conversionRate || 0}%</span>
            <p className="text-xs text-slate-500 mt-1">Ratio prospects transformés en clients actifs</p>
          </div>
        </div>
      )}
    </div>
  );
}
