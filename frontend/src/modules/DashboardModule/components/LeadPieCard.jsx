import { Card } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function LeadPieCard({
  total = 0,
  data = [],
  title = 'All Leads',
  subtitle = 'Status of all leads in the system',
  buttonText = 'View All Leads',
  onButtonClick,
  colors = {}, // new prop
  labels = [], // new prop
}) {
  return (
    <Card
      style={{
        minHeight: 320,
        textAlign: 'center',
        borderRadius: 10 ,
      }}
      bodyStyle={{ padding: 20 }}
    >
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{title}</div>
      <div style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>{subtitle}</div>

      <div style={{ width: 160, height: 160, margin: '0 auto', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={75}
              paddingAngle={3}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, idx) => (
                <Cell
                  key={entry.name}
                  fill={colors[entry.name] || colors[idx] || '#8884d8'}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            {total}
          </div>
          <div style={{ color: '#888', fontSize: 13 }}>Total Leads</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, gap: 5, flexWrap: 'wrap' }}>
        {labels.map((item, idx) => (
          <div key={item.label || item} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: item.color || colors[item.label || item] || colors[idx] || '#8884d8',
              marginRight: 4,
            }} />
            <span style={{ fontSize: 13 }}>{item.label || item}</span>
          </div>
        ))}
      </div>

      <button
        style={{
          marginTop: 24,
          border: '1px solid #1890ff',
          borderRadius: 20,
          padding: '6px 20px',
          background: '#fff',
          color: '#1890ff',
          fontWeight: 500,
          cursor: 'pointer',
        }}
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </Card>
  );
}
