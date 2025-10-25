import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase';
import YearCard from '../components/YearCard';

function Home() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notes')
          .select('year');

        if (error) throw error;

        const uniqueYears = [...new Set(data.map(note => note.year))];
        setYears(uniqueYears);

      } catch (err) {
        console.error(err);
        setError('Failed to fetch notes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  return (
    <div className="page-wrapper">
      <h1>Available Years</h1>
      <div className="card-grid">
        {years.length > 0 ? (
          years.map(year => (
            <YearCard key={year} year={year} />
          ))
        ) : (
          <p>No notes have been uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
