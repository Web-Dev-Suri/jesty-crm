import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function LeadsLineChart({ data, loading }) {
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    if (!loading && data.length > 0) {
      // Start with all counts at 0 (line at bottom)
      const zeroData = data.map(item => ({
        ...item,
        formattedDate: new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        count: 0
      }));

      setDisplayData(zeroData);

      // Animate to real data after a short delay
      const timeout = setTimeout(() => {
        const actualData = data.map(item => ({
          ...item,
          formattedDate: new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        }));
        setDisplayData(actualData);
      }, 100); // Delay to trigger animation

      return () => clearTimeout(timeout);
    }
  }, [data, loading]);

  if (loading) {
    return (
      <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={340}>
      <LineChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="formattedDate" />
        <YAxis allowDecimals={false} label={{ value: 'Leads', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#007bff"
          strokeWidth={2}
          dot={{ r: 4 }}
          isAnimationActive={true}
          animationDuration={1500}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
