import React, { useEffect, useState } from 'react';
import { Card, Avatar, List, Button, Spin, message, Switch } from 'antd';

const FacebookDashboard = ({ onBack }) => {
  const [fbData, setFbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const loadSettings = () => {
    const authData = JSON.parse(localStorage.getItem('auth'));
    return fetch(`${import.meta.env.VITE_BACKEND_SERVER}api/facebook/settings`, {
      headers: { Authorization: `Bearer ${authData?.current?.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setFbData(data);
        if (data?.connected && Array.isArray(data.pages) && data.pages.length) {
          // Preserve selection if still present
          setSelectedPage((prev) => {
            if (!prev) return data.pages[0];
            const found = data.pages.find((p) => p.id === prev.id);
            return found || data.pages[0];
          });
        }
      });
  };

  useEffect(() => {
    setLoading(true);
    loadSettings()
      .catch(() => message.error('Failed to load Facebook integration.'))
      .finally(() => setLoading(false));
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

  if (!fbData || !fbData.connected) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Card>
          <h3 style={{ margin: 0 }}>Facebook is not connected</h3>
          <p style={{ color: '#888' }}>Please connect your Facebook account from the Integrations page.</p>
          <Button onClick={onBack}>Back to Integrations</Button>
        </Card>
      </div>
    );
  }

  const pages = Array.isArray(fbData.pages) ? fbData.pages : [];

  const toggleForm = async (formId, enabled) => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const res = await fetch(`${import.meta.env.VITE_BACKEND_SERVER}api/facebook/toggle-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData?.current?.token}`,
        },
        body: JSON.stringify({ formId, enabled }),
      });
      if (!res.ok) throw new Error('Toggle failed');
      // Optimistic update then refresh
      setFbData((prev) => ({
        ...prev,
        pages: (prev.pages || []).map((page) =>
          !selectedPage || page.id !== selectedPage.id
            ? page
            : { ...page, forms: (page.forms || []).map((f) => (f.id === formId ? { ...f, enabled } : f)) }
        ),
      }));
      // Re-fetch to ensure consistency
      loadSettings();
      message.success(`Form ${enabled ? 'enabled' : 'disabled'}`);
    } catch (e) {
      message.error('Failed to update form setting');
    }
  };

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
        dataSource={pages}
        renderItem={(page) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => setSelectedPage(page)}>
                View Forms
              </Button>,
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
        <Card style={{ marginTop: 24 }}>
          <h3 style={{ marginTop: 0 }}>{selectedPage.name} - Lead Forms</h3>
          <List
            dataSource={selectedPage.forms}
            locale={{ emptyText: 'No Lead Forms found on this page' }}
            renderItem={(form) => (
              <List.Item
                actions={[
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#888' }}>{form.enabled ? 'Enabled' : 'Disabled'}</span>
                    <Switch
                      checked={!!form.enabled}
                      onChange={(checked) => toggleForm(form.id, checked)}
                    />
                  </div>,
                ]}
              >
                <List.Item.Meta title={form.name} description={`Form ID: ${form.id}`} />
              </List.Item>
            )}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button onClick={() => setSelectedPage(null)}>Back to Pages</Button>
            <Button onClick={() => loadSettings()}>Refresh</Button>
          </div>
        </Card>
      )}
      <Button style={{ marginTop: 32 }} onClick={onBack}>Back to Integrations</Button>
    </div>
  );
};

export default FacebookDashboard;