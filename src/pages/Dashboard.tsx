import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Scorecard } from '../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Trophy, Plus, Trash2, Edit2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [scorecards, setScorecards] = useState<Scorecard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('scorecards')
      .select(`
        *,
        courses (
          name,
          location
        )
      `)
      .eq('user_id', user.id)
      .order('played_date', { ascending: true });

    if (!error && data) {
      setScorecards(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this round?')) return;
    
    const { error } = await supabase
      .from('scorecards')
      .delete()
      .eq('id', id);
      
    if (!error) {
      setScorecards(scorecards.filter(s => s.id !== id));
    } else {
      alert('Failed to delete round.');
    }
  };

  const chartData = scorecards.map(s => ({
    date: format(parseISO(s.played_date), 'MMM d, yy'),
    score: s.total_score,
    courseName: s.courses?.name
  }));

  const bestScore = scorecards.length > 0 
    ? Math.min(...scorecards.map(s => s.total_score))
    : null;

  return (
    <div className="container main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Performance Dashboard</h1>
        <Link to="/courses" className="btn btn-primary">
          <Plus size={16} /> Add Round
        </Link>
      </div>

      {loading ? (
        <p>Loading your data...</p>
      ) : scorecards.length === 0 ? (
        <div className="empty-state">
          <Activity />
          <h3>No rounds played yet</h3>
          <p>Head over to the Courses section to add your first score!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: 'var(--radius-full)' }}>
                <Activity size={24} />
              </div>
              <div>
                <p style={{ margin: 0 }}>Total Rounds</p>
                <h2 style={{ margin: 0 }}>{scorecards.length}</h2>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '1rem', borderRadius: 'var(--radius-full)' }}>
                <Trophy size={24} />
              </div>
              <div>
                <p style={{ margin: 0 }}>Best Score</p>
                <h2 style={{ margin: 0 }}>{bestScore}</h2>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Score History</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)' }}
                    labelStyle={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.25rem' }}
                    itemStyle={{ color: 'var(--primary)', fontWeight: 500 }}
                    formatter={(value) => [`${value} strokes`, `Score`]}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.courseName || label}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="var(--primary)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--primary)', r: 4 }}
                    activeDot={{ r: 6, fill: 'var(--secondary)', stroke: 'white', strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Recent Rounds</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Date</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Course</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Score</th>
                    <th style={{ padding: '0.75rem 0', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...scorecards].reverse().map((round) => (
                    <tr key={round.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 0' }}>{format(parseISO(round.played_date), 'MMM d, yyyy')}</td>
                      <td style={{ padding: '1rem 0', fontWeight: 500, color: 'var(--text-main)' }}>{round.courses?.name}</td>
                      <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--primary)' }}>{round.total_score}</td>
                      <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                        <Link 
                          to={`/round/${round.id}`} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.5rem', marginRight: '0.5rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Resume / Edit Round"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(round.id)}
                          className="btn"
                          style={{ padding: '0.5rem', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete Round"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
