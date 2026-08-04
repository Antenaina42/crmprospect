"use client";

import React, { useEffect, useState } from "react";
import { FileText, Plus, Download, Send, CheckCircle2, RefreshCw, X, Building2, User } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DevisPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal creation state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProspectId, setSelectedProspectId] = useState("");
  const [items, setItems] = useState([
    { description: "Licence Prospect Mada CRM - Formule Business", quantity: 1, unitPrice: 1500000 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quotes");
      const data = await res.json();
      setQuotes(data || []);

      const pRes = await fetch("/api/prospects?isClient=false");
      const pData = await pRes.json();
      setProspects(pData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const addItemRow = () => {
    setItems([...items, { description: "Service / Prestation complémentaire", quantity: 1, unitPrice: 200000 }]);
  };

  const updateItem = (index: number, field: string, val: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = val;
    setItems(updated);
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  };

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProspectId) return;
    setSubmitting(true);

    try {
      const subtotal = calculateSubtotal();
      const vat = subtotal * 0.2;
      const total = subtotal + vat;

      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectId: selectedProspectId,
          items,
          totalAmount: total,
          validDays: 15,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        fetchQuotes();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const generatePDF = (quote: any) => {
    const doc = new jsPDF();

    // Header Branding
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text("PROSPECT MADA CRM", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Solutions SaaS de Prospection B2B", 14, 26);
    doc.text("Antananarivo, Madagascar | Email: contact@prospectmada.mg", 14, 31);

    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text(`DEVIS N° ${quote.quoteNumber}`, 140, 20);
    doc.setFontSize(10);
    doc.text(`Date : ${new Date(quote.createdAt).toLocaleDateString("fr-FR")}`, 140, 26);
    doc.text(`Valide jusqu'au : ${new Date(quote.validUntil).toLocaleDateString("fr-FR")}`, 140, 31);

    // Client info box
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 40, 182, 25, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("CLIENT / DESTINATAIRE :", 18, 48);
    doc.setFont("helvetica", "normal");
    doc.text(`${quote.prospect?.name}`, 18, 54);
    doc.text(`Adresse : ${quote.prospect?.city || "Antananarivo"}, Madagascar | Tel: ${quote.prospect?.phone || "N/A"}`, 18, 60);

    // Table items
    const parsedItems = JSON.parse(quote.itemsJson || "[]");
    const tableData = parsedItems.map((it: any) => [
      it.description,
      it.quantity,
      `${it.unitPrice.toLocaleString("fr-FR")} MGA`,
      `${(it.quantity * it.unitPrice).toLocaleString("fr-FR")} MGA`,
    ]);

    autoTable(doc, {
      startY: 72,
      head: [["Désignation de la prestation", "Qté", "Prix Unitaire (MGA)", "Total HT (MGA)"]],
      body: tableData,
      headStyles: { fillColor: [79, 70, 229] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 120;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL TTC (TVA 20% incluse) : ${quote.totalAmount.toLocaleString("fr-FR")} MGA`, 110, finalY + 15);

    doc.save(`${quote.quoteNumber}_ProspectMada.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
            Gestion Financière B2B
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Devis & Propositions Commerciations</h2>
          <p className="text-xs text-slate-500">
            Établissez des devis en Ariary (MGA), générez les PDF et suivez les confirmations.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Devis PDF</span>
        </button>
      </div>

      {/* Quotes List Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
        </div>
      ) : quotes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">Aucun devis créé</p>
          <p className="text-xs text-slate-500">Cliquez sur "+ Créer un Devis PDF" pour émettre votre première proposition.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3.5 px-4">N° Devis</th>
                <th className="py-3.5 px-4">Prospect / Client</th>
                <th className="py-3.5 px-4">Montant Total (MGA)</th>
                <th className="py-3.5 px-4">Date Émission</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-brand-600">{q.quoteNumber}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{q.prospect?.name}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {q.totalAmount.toLocaleString("fr-FR")} MGA
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(q.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700">
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => generatePDF(q)}
                      className="px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-lg font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Create Devis */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-modal">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Nouveau Devis Commercial</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Prospect Destinataire</label>
                <select
                  required
                  value={selectedProspectId}
                  onChange={(e) => setSelectedProspectId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                >
                  <option value="">Sélectionner un prospect...</option>
                  {prospects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700">Lignes de Prestation</label>
                  <button type="button" onClick={addItemRow} className="text-xs text-brand-600 font-bold hover:underline">
                    + Ajouter Ligne
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {items.map((it, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                      <input
                        type="text"
                        placeholder="Description prestation"
                        value={it.description}
                        onChange={(e) => updateItem(idx, "description", e.target.value)}
                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Qté"
                          value={it.quantity}
                          onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value || "1"))}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Prix Unitaire MGA"
                          value={it.unitPrice}
                          onChange={(e) => updateItem(idx, "unitPrice", parseFloat(e.target.value || "0"))}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl text-xs flex justify-between font-bold text-indigo-900">
                <span>Total Estimé (TVA 20% incluse) :</span>
                <span>{(calculateSubtotal() * 1.2).toLocaleString("fr-FR")} MGA</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/20"
              >
                {submitting ? "Génération..." : "Créer le Devis"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
