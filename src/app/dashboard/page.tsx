"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  PhoneCall,
  Flame,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Building2,
  MapPin,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  PieChart as PieIcon,
  BarChart2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE", "#E0E7FF"];

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error("Failed to load dashboard stats", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const kpis = stats?.kpis || {};

  const kpiCards = [
    {
      title: "Total Prospects",
      value: kpis.totalProspects || 0,
      change: "+14% ce mois",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Nouveaux Prospects",
      value: kpis.newProspects || 0,
      change: "À qualifier",
      icon: UserPlus,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Prospects Contactés",
      value: kpis.contacted || 0,
      change: "En cours",
      icon: PhoneCall,
      color: "from-violet-500 to-purple-600",
      textColor: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      title: "Prospects Intéressés",
      value: kpis.interested || 0,
      change: "Haute priorité",
      icon: Flame,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Portefeuille Clients",
      value: kpis.clientsCount || 0,
      change: "Convertis",
      icon: CheckCircle2,
      color: "from-green-600 to-emerald-700",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Taux de Conversion",
      value: `${kpis.conversionRate || 0}%`,
      change: "Objectif: 25%",
      icon: TrendingUp,
      color: "from-indigo-600 to-brand-700",
      textColor: "text-brand-600",
      bgColor: "bg-brand-50",
    },
    {
      title: "Appels Réalisés",
      value: kpis.totalCalls || 0,
      change: "Historique total",
      icon: PhoneCall,
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Rendez-vous Fixés",
      value: kpis.totalAppointments || 0,
      change: "Missions terrain",
      icon: Calendar,
      color: "from-rose-500 to-pink-600",
      textColor: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-400/30">
              Vue Synthétique SaaS
            </span>
            <span className="text-xs text-slate-400">Marché Madagascar</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Performance Commerciale B2B</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Suivi en temps réel de l'acquisition de prospects Google Places, des appels commerciaux et de la conversion en clients.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="self-start md:self-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-medium text-white flex items-center gap-2 backdrop-blur-md transition-all active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualiser les Données</span>
        </button>
      </div>

      {/* KPI 8 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{card.title}</span>
                <div className={`p-2 rounded-xl ${card.bgColor} ${card.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</span>
                <span className="text-[11px] font-medium text-slate-400">{card.change}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recharts Graphical Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Acquisition Trend Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Évolution Mensuelle Prospection & Conversion</h3>
              <p className="text-xs text-slate-500">Volume de nouveaux prospects vs conversions clients</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />
                <span className="text-slate-600">Prospects</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Clients</span>
              </div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyTrends || []}>
                <defs>
                  <linearGradient id="colorProspects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "0.75rem",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="prospects"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorProspects)"
                />
                <Area
                  type="monotone"
                  dataKey="clients"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorClients)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution by Category Donut Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-card">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Répartition par Secteur / Catégorie</h3>
            <p className="text-xs text-slate-500">Distribution B2B des prospects</p>
          </div>
          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.categoryStats || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {(stats?.categoryStats || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "0.75rem",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {(stats?.categoryStats || []).slice(0, 4).map((cat: any, idx: number) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-slate-700 font-medium truncate max-w-[140px]">
                    {cat.name}
                  </span>
                </div>
                <span className="font-semibold text-slate-900">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown by City in Madagascar & Commercial Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City Breakdown Bar Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Prospects par Ville de Madagascar</h3>
              <p className="text-xs text-slate-500">Antananarivo, Majunga, Tamatave, Antsirabe, etc.</p>
            </div>
            <MapPin className="w-4 h-4 text-brand-600" />
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.cityStats || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "0.75rem",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commercial Team Activity Table */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Activité de l'Équipe Commerciale</h3>
                <p className="text-xs text-slate-500">Portefeuille attribué, appels & rendez-vous</p>
              </div>
              <Building2 className="w-4 h-4 text-brand-600" />
            </div>

            <div className="divide-y divide-slate-100">
              {(stats?.commercialStats || []).map((comm: any) => (
                <div key={comm.name} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center border border-brand-200">
                      {comm.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{comm.name}</p>
                      <p className="text-[11px] text-slate-500">{comm.prospects} Prospects en portefeuille</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="text-right">
                      <span className="block text-slate-900">{comm.calls}</span>
                      <span className="block text-[10px] font-normal text-slate-400">Appels</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-brand-600">{comm.appointments}</span>
                      <span className="block text-[10px] font-normal text-slate-400">RDV</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Objectif hebdomadaire équipe</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              85% Atteint
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
