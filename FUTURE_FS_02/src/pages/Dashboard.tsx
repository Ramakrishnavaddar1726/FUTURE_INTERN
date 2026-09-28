import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  TrendingUp,
  CalendarClock,
  Sparkles,
  ArrowRight,
  Plus,
  RefreshCw,
  Clock,
  Building2,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.js';
import { StatsCard } from '../components/StatsCard.js';
import { StatusBadge } from '../components/StatusBadge.js';
import {
  DashboardStats,
  LeadsOverTimePoint,
  LeadSourceStat,
  Lead,
  FollowUp,
  LeadStatus,
} from '../types/crm.js';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onOpenAddLeadModal: () => void;
  onViewLead: (lead: Lead) => void;
}

const STATUS_COLORS = {
  New: '#3b82f6',
  Contacted: '#f59e0b',
  Converted: '#10b981',
};

const SOURCE_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenAddLeadModal,
  onViewLead,
}) => {
  const { showToast } = useToast();

  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    convertedLeads: 0,
    pendingFollowups: 0,
    conversionRate: 0,
  });

  const [timelineData, setTimelineData] = useState<LeadsOverTimePoint[]>([]);
  const [timelineRange, setTimelineRange] = useState<'7d' | '30d'>('30d');
  const [sourceData, setSourceData] = useState<LeadSourceStat[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [pendingFollowUps, setPendingFollowUps] = useState<FollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, timelineRes, sourcesRes, leadsRes, followUpsRes] = await Promise.all([
        api.dashboard.getStats(),
        api.dashboard.getLeadsOverTime(timelineRange),
        api.dashboard.getLeadSources(),
        api.leads.getAll({ page: 1, limit: 5, sortBy: 'newest' }),
        api.followups.getAll({ status: 'Pending' }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (timelineRes.success) setTimelineData(timelineRes.data);
      if (sourcesRes.success) setSourceData(sourcesRes.data);
      if (leadsRes.success) setRecentLeads(leadsRes.data);
      if (followUpsRes.success) setPendingFollowUps(followUpsRes.data.slice(0, 5));
    } catch (err) {
      showToast('Failed to load live dashboard statistics', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timelineRange]);

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await api.leads.updateStatus(leadId, newStatus);
      if (res.success) {
        showToast(`Lead status updated to ${newStatus}`, 'success');
        fetchDashboardData();
      }
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleToggleFollowUp = async (followUpId: string) => {
    try {
      const res = await api.followups.toggleComplete(followUpId);
      if (res.success) {
        showToast('Follow-up status updated', 'success');
        fetchDashboardData();
      }
    } catch (e) {
      showToast('Failed to toggle follow-up', 'error');
    }
  };

  // Prepare status donut chart data
  const statusPieData = [
    { name: 'New', value: stats.newLeads, color: STATUS_COLORS.New },
    { name: 'Contacted', value: stats.contactedLeads, color: STATUS_COLORS.Contacted },
    { name: 'Converted', value: stats.convertedLeads, color: STATUS_COLORS.Converted },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Database Connected
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Real-time Inquiries Synced
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            CRM Operations & Pipeline Analytics
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onOpenAddLeadModal}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Lead Manually
          </button>
        </div>
      </div>

      {/* 5 Summary Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={Users}
          color="indigo"
          subtext="Total inquiries received"
        />

        <StatsCard
          title="New Leads"
          value={stats.newLeads}
          icon={Sparkles}
          color="blue"
          subtext="Awaiting first contact"
        />

        <StatsCard
          title="Contacted"
          value={stats.contactedLeads}
          icon={Clock}
          color="amber"
          subtext="Under active discussion"
        />

        <StatsCard
          title="Converted"
          value={stats.convertedLeads}
          icon={UserCheck}
          color="emerald"
          trendText={`${stats.conversionRate}% Win Rate`}
          trendPositive={true}
          subtext="Won client accounts"
        />

        <StatsCard
          title="Follow-ups"
          value={stats.pendingFollowups}
          icon={CalendarClock}
          color="purple"
          subtext="Pending action items"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Leads Over Time (Area Chart) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Leads Acquisition Timeline</h3>
              <p className="text-xs text-slate-500">Volume of client inquiries logged over time</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTimelineRange('7d')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  timelineRange === '7d'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => setTimelineRange('30d')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  timelineRange === '30d'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Last 30 Days
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadPulseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Leads Created"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#leadPulseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Donut Chart */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Lead Status Pipeline</h3>
            <p className="text-xs text-slate-500">Distribution across sales stages</p>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center">
            {statusPieData.length === 0 ? (
              <p className="text-xs text-slate-400">No leads data available yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Custom Status Legend */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
            <div className="p-2 rounded-xl bg-blue-50/60">
              <span className="block text-[11px] font-bold text-blue-700">New</span>
              <span className="text-base font-extrabold text-blue-900">{stats.newLeads}</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50/60">
              <span className="block text-[11px] font-bold text-amber-700">Contacted</span>
              <span className="text-base font-extrabold text-amber-900">{stats.contactedLeads}</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50/60">
              <span className="block text-[11px] font-bold text-emerald-700">Converted</span>
              <span className="text-base font-extrabold text-emerald-900">{stats.convertedLeads}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Lead Sources & Pending Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lead Sources Bar Chart */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Lead Attribution Sources</h3>
              <p className="text-xs text-slate-500">Breakdown of inquiry intake channels</p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sourceData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  dataKey="source"
                  type="category"
                  tick={{ fontSize: 10, fill: '#475569' }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Leads" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Urgent Follow-ups Widget */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upcoming Follow-up Agenda</h3>
              <p className="text-xs text-slate-500">Scheduled client tasks and outreach reminders</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('followups')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
            >
              All Follow-ups <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-56">
            {pendingFollowUps.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No pending follow-ups scheduled. Good job staying on top of outreach!
              </div>
            ) : (
              pendingFollowUps.map((item) => (
                <div
                  key={item._id}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleFollowUp(item._id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      title="Mark as completed"
                    >
                      <Circle className="w-4 h-4" />
                    </button>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">
                        {item.leadName || 'Client Lead'}
                      </p>
                      <p className="text-slate-500 text-[11px] truncate">{item.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {item.date}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{item.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Inquiries List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Inquiries Received</h3>
            <p className="text-xs text-slate-500">Latest leads captured by the system</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('leads')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            Manage All Leads &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                <th className="pb-2">Name</th>
                <th className="pb-2">Company</th>
                <th className="pb-2">Service</th>
                <th className="pb-2">Source</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 font-bold text-slate-800">
                    <span
                      onClick={() => onViewLead(lead)}
                      className="cursor-pointer hover:text-indigo-600 hover:underline"
                    >
                      {lead.name}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-600">{lead.company}</td>
                  <td className="py-2.5 text-slate-500 truncate max-w-[150px]">{lead.service}</td>
                  <td className="py-2.5 text-slate-500">{lead.source}</td>
                  <td className="py-2.5">
                    <StatusBadge
                      status={lead.status}
                      interactive={true}
                      onStatusChange={(st) => handleStatusChange(lead._id, st)}
                      size="sm"
                    />
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => onViewLead(lead)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Profile &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
