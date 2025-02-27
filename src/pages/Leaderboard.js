import React, { useState } from 'react'
import { supabase } from "../lib/supabaseClient.js";

export default function Leaderboard() {
    const [threshold, setThreshold] = useState(''); // State for input value
    const [netIds, setNetIds] = useState([]); // State to store results
    const [error, setError] = useState(null); // State to store error messages
    const [loading, setLoading] = useState(false); // Loading state to show a spinner
    let semester = "sp25";

    
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setLoading(true); // Set loading state to true

        if (isNaN(threshold) || threshold <= 0) {
            setError('Please enter a valid positive number for the threshold.');
            setLoading(false);
            return;
        }

        try {
            const numericThreshold = Number(threshold); // Turn the threshold string to a number
            const { data: pointsTracking, error: pointsTrackingError } = await supabase
                .from('summed_points')
                .select('first_name, last_name, netid, total_points')
                .gte('total_points', numericThreshold); // Filter by threshold

            if (pointsTrackingError) {
                console.error('Error in points_tracking query:', pointsTrackingError);
                throw pointsTrackingError;
            }
            // Store the result (net_ids) in state
            setNetIds(pointsTracking);
            setError(null); // Clear any previous errors
        } catch (err) {
            // If an error occurs, store it in the error state
            setError(`Error fetching data. Please try again. ${err.message}`);
            setNetIds([]); // Clear previous results on error
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    return (
        <div>
            <h1>Find Students Above a Point Threshold</h1>

            {/* Form to input point threshold */}
            <form onSubmit={handleSubmit}>
                <label htmlFor="threshold">Please enter point threshold:</label>
                <input
                    type="number"
                    id="threshold"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)} // Update threshold state
                    placeholder="Enter threshold points"
                    min="0"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Get Students Above Threshold'}
                </button>
            </form>

            {/* Show error message if there's an error */}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {/* Display result */}
            <div className="result" style={{ marginTop: '20px' }}>
                {netIds.length > 0 ? (
                    <ul>
                        {netIds.map((student, index) => (
                            <li key={index}>{student.first_name} {student.last_name} | NetID: {student.netid} </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p>No students found above the threshold.</p>
                )}
            </div>
        </div>
    );
}