import React, { useState } from 'react'
import { supabase } from "../lib/supabaseClient.js";

export default function Leaderboard() {
    const [threshold, setThreshold] = useState('');
    const [netIds, setNetIds] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const numericThreshold = Number(threshold);
        if (!Number.isFinite(numericThreshold) || numericThreshold <= 0) {
            setError('Please enter a valid positive number for the threshold.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('summed_points')
                .select('first_name, last_name, netid, total_points')
                .gte('total_points', numericThreshold);

            if (error) throw error;
            setNetIds(data);
        } catch (err) {
            setError(`Error fetching data. Please try again. ${err.message}`);
            setNetIds([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Find Students Above a Point Threshold</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="threshold">Please enter point threshold:</label>
                <input
                    type="number"
                    id="threshold"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    placeholder="Enter threshold points"
                    min="0"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Get Students Above Threshold'}
                </button>
            </form>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className="result" style={{ marginTop: '20px' }}>
                {netIds.length > 0 ? (
                    <ul>
                        {netIds.map((student) => (
                            <li key={student.netid}>{student.first_name} {student.last_name} | NetID: {student.netid} </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p>No students found above the threshold.</p>
                )}
            </div>
        </div>
    );
}
