import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import type { Course } from '../lib/supabase';
import { MapPin, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CourseDirectory() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Score Entry Modal State
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [score, setScore] = useState('');
  const [playedDate, setPlayedDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('county', { ascending: true })
      .order('name', { ascending: true });

    if (!error && data) {
      setCourses(data);
    }
    setLoading(false);
  };

  const handleScoreSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !score) return;
    
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase.from('scorecards').insert({
        user_id: user.id,
        course_id: selectedCourse.id,
        total_score: parseInt(score),
        played_date: playedDate
      });
      
      if (!error) {
        setSelectedCourse(null);
        setScore('');
        navigate('/');
      } else {
        alert('Error submitting score. Please try again.');
      }
    }
    setSubmitting(false);
  };

  // Group courses by county
  const groupedCourses = courses.reduce((acc, course) => {
    if (!acc[course.county]) {
      acc[course.county] = [];
    }
    acc[course.county].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <div className="container main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Golf Courses</h1>
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {Object.entries(groupedCourses).map(([county, countyCourses]) => (
            <div key={county}>
              <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{county}</h2>
              <div className="grid grid-cols-3">
                {countyCourses.map(course => (
                  <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{course.name}</h3>
                      <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', margin: 0, fontSize: '0.875rem' }}>
                        <MapPin size={16} />
                        {course.location}
                      </p>
                    </div>
                    <button 
                      className="btn btn-primary" 
                      style={{ marginTop: '1.5rem', width: '100%' }}
                      onClick={() => setSelectedCourse(course)}
                    >
                      <Plus size={16} />
                      Add Score
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCourse && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
            <button 
              onClick={() => setSelectedCourse(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '0.5rem' }}>Add Round</h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--primary)', fontWeight: 500 }}>{selectedCourse.name}</p>
            
            <form onSubmit={handleScoreSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="date">Date Played</label>
                <input 
                  id="date"
                  type="date" 
                  className="form-input" 
                  value={playedDate}
                  onChange={(e) => setPlayedDate(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', marginBottom: '1rem' }}>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                  onClick={async () => {
                    setSubmitting(true);
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                      const { data, error } = await supabase.from('scorecards').insert({
                        user_id: user.id,
                        course_id: selectedCourse.id,
                        total_score: 0,
                        hole_scores: {},
                        played_date: playedDate
                      }).select().single();
                      
                      if (!error && data) {
                        navigate(`/round/${data.id}`);
                      }
                    }
                    setSubmitting(false);
                  }}
                  disabled={submitting}
                >
                  Play Live (Hole-by-Hole)
                </button>
              </div>

              <div style={{ position: 'relative', textAlign: 'center', margin: '1.5rem 0' }}>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'var(--surface)', padding: '0 0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>OR</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="score">Quick Entry (Total Score)</label>
                <input 
                  id="score"
                  type="number" 
                  className="form-input" 
                  placeholder="e.g. 84"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  min="50" max="200"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-secondary" 
                  style={{ flex: 1 }}
                  disabled={submitting || !score}
                >
                  {submitting ? 'Saving...' : 'Save Total Score'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
