import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Scorecard, Course } from '../lib/supabase';
import { Check, ChevronLeft } from 'lucide-react';
import debounce from 'lodash.debounce';

export function LiveRound() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [holeScores, setHoleScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    fetchRoundData();
  }, [id]);

  const fetchRoundData = async () => {
    if (!id) return;
    
    const { data: scoreData, error: scoreErr } = await supabase
      .from('scorecards')
      .select('*, courses(*)')
      .eq('id', id)
      .single();

    if (!scoreErr && scoreData) {
      setScorecard(scoreData);
      setCourse(scoreData.courses as Course);
      setHoleScores(scoreData.hole_scores || {});
    }
    setLoading(false);
  };

  // Debounced save function to avoid hitting DB on every keystroke
  const debouncedSave = useCallback(
    debounce(async (newScores: Record<string, number>, scorecardId: string) => {
      setSavingStatus('saving');
      
      const totalScore = Object.values(newScores).reduce((sum, score) => sum + (score || 0), 0);
      
      await supabase
        .from('scorecards')
        .update({ 
          hole_scores: newScores,
          total_score: totalScore
        })
        .eq('id', scorecardId);
        
      setSavingStatus('saved');
      
      setTimeout(() => setSavingStatus('idle'), 2000);
    }, 1000),
    []
  );

  const handleScoreChange = (hole: number, score: string) => {
    const val = parseInt(score);
    const newScores = { ...holeScores };
    
    if (isNaN(val)) {
      delete newScores[hole.toString()];
    } else {
      newScores[hole.toString()] = val;
    }
    
    setHoleScores(newScores);
    
    if (scorecard) {
      setSavingStatus('saving');
      debouncedSave(newScores, scorecard.id);
    }
  };

  const handleFinishRound = () => {
    navigate('/');
  };

  if (loading) return <div className="container main-content"><p>Loading round...</p></div>;
  if (!scorecard || !course) return <div className="container main-content"><p>Round not found.</p></div>;

  const holesCount = course.holes_count || 18;
  const parScores = course.par_scores || Array(holesCount).fill(4);
  const handicaps = course.handicaps || Array(holesCount).fill(0).map((_, i) => i + 1);

  const currentTotal = Object.values(holeScores).reduce((sum, score) => sum + (score || 0), 0);
  const currentPar = parScores.reduce((sum, par) => sum + par, 0);

  return (
    <div className="container main-content" style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button 
            onClick={() => navigate('/courses')} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '0.5rem', padding: 0 }}
          >
            <ChevronLeft size={16} /> Back
          </button>
          <h1 style={{ marginBottom: '0.25rem' }}>{course.name}</h1>
          <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Par {currentPar}</span>
            <span style={{ 
              backgroundColor: savingStatus === 'saved' ? '#dcfce7' : savingStatus === 'saving' ? '#fef3c7' : 'transparent', 
              color: savingStatus === 'saved' ? '#166534' : savingStatus === 'saving' ? '#92400e' : 'var(--text-muted)',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              transition: 'var(--transition)'
            }}>
              {savingStatus === 'saving' ? 'Saving...' : savingStatus === 'saved' ? 'Saved' : 'Auto-saves as you type'}
            </span>
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Score</p>
          <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--primary)' }}>{currentTotal}</h2>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--background)' }}>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', textAlign: 'left', position: 'sticky', left: 0, backgroundColor: 'var(--background)', zIndex: 2 }}>Hole</th>
                {Array.from({ length: holesCount }).map((_, i) => (
                  <th key={i} style={{ padding: '1rem 0.5rem', borderBottom: '1px solid var(--border)', minWidth: '60px' }}>{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }}>Par</td>
                {parScores.slice(0, holesCount).map((par, i) => (
                  <td key={i} style={{ padding: '0.75rem 0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>{par}</td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }}>Handicap</td>
                {handicaps.slice(0, holesCount).map((hcp, i) => (
                  <td key={i} style={{ padding: '0.75rem 0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{hcp}</td>
                ))}
              </tr>
              <tr style={{ backgroundColor: '#f0fdf4' }}>
                <td style={{ padding: '1rem', borderRight: '1px solid var(--border)', textAlign: 'left', fontWeight: 700, color: 'var(--text-main)', position: 'sticky', left: 0, backgroundColor: '#f0fdf4', zIndex: 1 }}>Score</td>
                {Array.from({ length: holesCount }).map((_, i) => (
                  <td key={i} style={{ padding: '0.5rem' }}>
                    <input 
                      type="number" 
                      min="1"
                      max="20"
                      value={holeScores[(i + 1).toString()] || ''}
                      onChange={(e) => handleScoreChange(i + 1, e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        textAlign: 'center', 
                        border: '1px solid var(--border)', 
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        color: 'var(--primary)'
                      }}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={handleFinishRound}>
          <Check size={18} /> Finish Round
        </button>
      </div>
    </div>
  );
}
