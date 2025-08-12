// src/pages/Integrations.jsx
import React, { useState } from 'react';
import { Button, Card, Upload, message, Modal, Input } from 'antd';
import { GlobalOutlined, FileExcelOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import facebookIcon from '@/style/images/facebook-icon.png';
import shopifyIcon from '@/style/images/shopify.png';
import wordpressIcon from '@/style/images/wordpress.png';

// Dummy connection status for demonstration
const connectionStatus = {
  website: true,
  facebook: true,
  bulk: false,
  shopify: false,
  wordpress: false,
};

const statusCircle = (connected) => (
  <span
    style={{
      display: 'inline-block',
      width: 12,
      height: 12,
      borderRadius: '50%',
      marginRight: 6,
      background: connected ? '#52c41a' : '#ccc',
      verticalAlign: 'middle',
    }}
  />
);

const statusPill = (connected) => (
  <span
    style={{
      background: '#eceef3',
      padding: '10px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      fontWeight: 500,
      color: connected ? '#52c41a' : '#888',
      minWidth: 100,
      justifyContent: 'center',
    }}
  >
    {statusCircle(connected)}
    {connected ? 'Connected' : 'Disconnected'}
  </span>
);

const Integrations = () => {
    const [step, setStep] = useState('select');
    const [formData, setFormData] = useState({
        websiteUrl: '',
        formId: '',
    });
    const [submitted, setSubmitted] = useState(false);

    // Bulk Import/Export state
    const [bulkVisible, setBulkVisible] = useState(false);
    const [search, setSearch] = useState('');

    // Move integrationList here so it can use setStep and setBulkVisible
    const integrationList = [
      {
        key: 'website',
        icon: <GlobalOutlined style={{ fontSize: 40, color: '#1890ff', marginBottom: 20 }} />,
        title: 'Fetch Leads from Website',
        description: 'Connect your website forms to automatically capture leads into your CRM.',
        status: connectionStatus.website,
        onConnect: () => setStep('form'),
      },
      {
        key: 'facebook',
        icon: <img src={facebookIcon} alt="Facebook" style={{ width: 40, marginBottom: 20 }} />,
        title: 'Capture Leads from Facebook',
        description: 'Connect your Facebook page to sync leads from Facebook Lead Ads.',
        status: connectionStatus.facebook,
        onConnect: () => setStep('facebook'),
      },
      {
        key: 'bulk',
        icon: <FileExcelOutlined style={{ fontSize: 40, color: '#52c41a', marginBottom: 20 }} />,
        title: 'Bulk Import/Export',
        description: 'Import or export your client data in bulk to a csv which you can import in excel or sheets.',
        status: connectionStatus.bulk,
        onConnect: () => setBulkVisible(true),
      },
      {
        key: 'shopify',
        icon: <img src={shopifyIcon} alt="Shopify" style={{ width: 40, marginBottom: 20 }} />,
        title: 'Capture Leads from Shopify',
        description: 'Connect your Shopify store through our custom webhook to sync customer leads automatically.',
        status: connectionStatus.shopify,
        onConnect: () => setStep('form'),
      },
      {
        key: 'wordpress',
        icon: <img src={wordpressIcon} alt="WordPress" style={{ width: 40, marginBottom: 20 }} />,
        title: 'Capture Leads from WordPress',
        description: 'Connect your WordPress site to capture and sync leads directly.',
        status: connectionStatus.wordpress,
        onConnect: () => setStep('form'),
      },
    ];

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const handleFacebookConnect = () => {
        const authData = JSON.parse(localStorage.getItem('auth'));

        if (!authData?.current?.token) {
            console.error('No JWT token found.');
            return;
        }

        const token = authData.current.token;

        // Open popup
        const popup = window.open(
            `${import.meta.env.VITE_BACKEND_SERVER}api/facebook/auth?token=${token}`,
            'fbLogin',
            'width=600,height=700'
        );

        // Listen for message from popup
        const messageListener = (event) => {
            if (event.data === 'facebook-connected') {
                console.log('✅ Facebook connected successfully!');

                // Optionally, refresh your auth data or UI here
                window.location.reload(); // Optional: refresh the page to fetch updated user info

                // Clean up listener
                window.removeEventListener('message', messageListener);
            }
        };

        window.addEventListener('message', messageListener);
    };

    const scriptSnippet = `
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("${formData.formId || '#my-lead-form'}");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(form);
        fetch("https://a983-122-162-150-234.ngrok-free.app/api/leads/website", {
          method: "POST",
          body: JSON.stringify(Object.fromEntries(data)),
          headers: { "Content-Type": "application/json" },
        })
        .then(res => res.json())
        .then(console.log)
        .catch(console.error);
      });
    }
  });
</script>`.trim();

    // Bulk Export handler (example: download template or data)
    const handleDownload = () => {
        // Replace with your actual API endpoint for export
        window.open(`${import.meta.env.VITE_BACKEND_SERVER}api/client/export`, '_blank');
    };

    // Bulk Import handler
    const handleUpload = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            setBulkVisible(false);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const filteredIntegrations = integrationList.filter(
      item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6" style={{maxWidth: '1000px', margin: '20px auto'}}>Integrations</h2>
            <div style={{ maxWidth: '700px', margin: '0 auto 20px auto' }}>
              <Input
                placeholder="Search integrations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                allowClear
                style={{ marginBottom: 20, height: '50px', borderRadius: '10px' }}
              />
            </div>
            {step === 'select' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                  {filteredIntegrations.map(item => (
                    <Card bordered style={{flex: '1', minWidth: '450px', borderRadius: '10px' }} key={item.key}>
                      <div className="flex items-center">
                        {item.icon}
                        <h3 className="text-lg font-semibold mb-0">{item.title}</h3>
                      </div>
                      <p style={{ margin: '8px 0 16px 0', color: '#555' }}>
                        {item.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                          type="primary"
                          onClick={item.onConnect}
                          style={{
                            borderRadius: '10px',
                            height: 'auto',
                            padding: '5px 10px',
                            background: item.status ? '#001528' : undefined,
                            borderColor: item.status ? '#001528' : undefined,
                          }}
                        >
                          {item.status ? 'Configure' : 'Connect'}
                        </Button>
                        {statusPill(item.status)}
                      </div>
                    </Card>
                  ))}
                </div>
            )}

            {/* Bulk Import/Export Modal */}
            <Modal
                title="Bulk Import/Export"
                open={bulkVisible}
                onCancel={() => setBulkVisible(false)}
                footer={null}
                centered
            >
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                    <Button
                        icon={<DownloadOutlined />}
                        type="primary"
                        onClick={handleDownload}
                    >
                        Download CSV
                    </Button>
                    <Upload
                        name="file"
                        accept=".xlsx,.xls"
                        action={`${import.meta.env.VITE_BACKEND_SERVER}api/client/import`}
                        showUploadList={false}
                        onChange={handleUpload}
                    >
                        <Button icon={<UploadOutlined />}>Upload CSV</Button>
                    </Upload>
                </div>
            </Modal>

            {step === 'form' && (
                <Card style={{ maxWidth: 600, margin: '0 auto' }} bordered>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Website URL</label>
                            <input
                                type="url"
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="https://example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Form ID or Selector</label>
                            <input
                                type="text"
                                name="formId"
                                value={formData.formId}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="#lead-form"
                                required
                            />
                        </div>
                        <Button type="primary" htmlType="submit">Generate Script</Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => { setStep('select'); setSubmitted(false); }}>Back</Button>
                    </form>

                    {submitted && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold">Embed This Script:</h3>
                            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                                {scriptSnippet}
                            </pre>
                            <p className="text-sm mt-2 text-gray-600">
                                ✅ Paste this script just before your website's closing <code>&lt;/body&gt;</code> tag.<br />
                                ✅ Make sure your form has the selector: <code>{formData.formId}</code><br />
                                ✅ The form should have inputs with <code>name</code> attributes like <code>name</code>, <code>email</code>, <code>phone</code>, etc.
                            </p>
                        </div>
                    )}
                </Card>
            )}

            {step === 'facebook' && (
                <Card style={{ maxWidth: 600, margin: '0 auto' }} bordered>
                    <p>
                        Connect your Facebook page to automatically capture leads from Facebook Lead Ads.
                    </p>
                    <Button
                        type="primary"
                        onClick={handleFacebookConnect}
                    >
                        Connect Facebook
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={() => setStep('select')}>
                        Back
                    </Button>
                </Card>
            )}
        </div>
    );
};

export default Integrations;