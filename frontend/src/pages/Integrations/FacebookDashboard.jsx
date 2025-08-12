import React, { useEffect, useState } from 'react';
import { Card, Avatar, List, Button, Spin, message } from 'antd';

const FacebookDashboard = ({ onBack }) => {
  const [fbData, setFbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('auth'));
    fetch(`${import.meta.env.VITE_BACKEND_SERVER}api/facebook/settings`, {
      headers: { Authorization: `Bearer ${authData?.current?.token}` }
    })
      .then(res => res.json())
      .then(data => {
        setFbData(data);
        setLoading(false);
      })
      .catch(() => {
        message.error('Failed to load Facebook integration.');
        setLoading(false);
      });
  }, []);

  const handleDisconnect = () => {
    setDisconnecting(true);
    const authData = JSON.parse(localStorage.getItem('auth'));
    fetch(`${import.meta.env.VITE_BACKEND_SERVER}api/facebook/disconnect`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authData?.current?.token}` }
    })
      .then(res => res.json())
      .then(() => {
        message.success('Disconnected from Facebook.');
        setFbData(null);
        setDisconnecting(false);
        onBack();
      })
      .catch(() => {
        message.error('Failed to disconnect.');
        setDisconnecting(false);
      });
  };

  if (loading) return <Spin style={{ margin: '100px auto', display: 'block' }} />;

  if (!fbData?.connected) {
    return (
      <Card style={{ maxWidth: 600, margin: '0 auto' }}>
        <p>No Facebook account connected.</p>
        <Button type="primary" onClick={onBack}>Back</Button>
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Avatar src={fbData.fbUserPic} size={64} />
          <div>
            <h2 style={{ marginBottom: 4 }}>{fbData.fbUserName}</h2>
            <p style={{ marginBottom: 0, color: '#888' }}>User ID: {fbData.fbUserId}</p>
            <Button danger loading={disconnecting} style={{ marginTop: 10 }} onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        </div>
      </Card>
      <h3 style={{ marginTop: 32 }}>Connected Pages</h3>
      <List
        itemLayout="horizontal"
        dataSource={fbData.pages}
        renderItem={page => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => setSelectedPage(page)}>View Forms</Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={page.picture} />}
              title={page.name}
              description={`Page ID: ${page.id}`}
            />
          </List.Item>
        )}
      />
      {selectedPage && (
        <Card style={{ marginTop: 32 }}>
          <h3>{selectedPage.name} - Lead Forms</h3>
          <List
            dataSource={selectedPage.forms}
            renderItem={form => (
              <List.Item>
                <List.Item.Meta
                  title={form.name}
                  description={`Form ID: ${form.id}`}
                />
              </List.Item>
            )}
          />
          <Button style={{ marginTop: 16 }} onClick={() => setSelectedPage(null)}>Back to Pages</Button>
        </Card>
      )}
      <Button style={{ marginTop: 32 }} onClick={onBack}>Back to Integrations</Button>
    </div>
  );
};

export default FacebookDashboard;