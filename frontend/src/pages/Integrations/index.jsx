// src/pages/Integrations.jsx
import React, { useState } from 'react';
import { Button, Card, Upload, message, Modal } from 'antd';
import { GlobalOutlined, FileExcelOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import facebookIcon from '@/style/images/facebook-icon.png';

const Integrations = () => {
    const [step, setStep] = useState('select');
    const [formData, setFormData] = useState({
        websiteUrl: '',
        formId: '',
    });
    const [submitted, setSubmitted] = useState(false);

    // Bulk Import/Export state
    const [bulkVisible, setBulkVisible] = useState(false);

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

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Integrations</h2>

            {step === 'select' && (
                <div>
                    {/* Website Integration Card */}
                    <Card
                        className="mb-6"
                        style={{
                            maxWidth: 800,
                            margin: '20px auto',
                            padding: '24px',
                        }}
                        bordered
                        bodyStyle={{ width: '100%', padding: 0 }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <GlobalOutlined style={{ fontSize: 40, color: '#1890ff', marginRight: 20 }} />
                                <h3 className="text-lg font-semibold mb-0" style={{ margin: 0 }}>
                                    Fetch Leads from Website
                                </h3>
                            </div>
                            <Button type="primary" onClick={() => setStep('form')}>
                                Connect
                            </Button>
                        </div>
                    </Card>

                    {/* Facebook Integration Card */}
                    <Card
                        className="mb-6"
                        style={{
                            maxWidth: 800,
                            margin: '0 auto',
                            padding: '24px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        bordered
                        bodyStyle={{ width: '100%', padding: 0 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={facebookIcon} alt="Facebook" style={{ width: 40, marginRight: 20 }} />
                                <h3 className="text-lg font-semibold mb-0" style={{ margin: 0 }}>
                                    Capture Leads from Facebook
                                </h3>
                            </div>
                            <Button type="primary" onClick={() => setStep('facebook')}>
                                Connect
                            </Button>
                        </div>
                    </Card>

                    {/* Bulk Import/Export Card */}
                    <Card
                        className="mb-6"
                        style={{
                            maxWidth: 800,
                            margin: '20px auto',
                            padding: '24px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        bordered
                        bodyStyle={{ width: '100%', padding: 0 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FileExcelOutlined style={{ fontSize: 40, color: '#52c41a', marginRight: 20 }} />
                                <h3 className="text-lg font-semibold mb-0" style={{ margin: 0 }}>
                                    Bulk Import/Export
                                </h3>
                            </div>
                            <Button type="primary" onClick={() => setBulkVisible(true)}>
                                Connect
                            </Button>
                        </div>
                    </Card>
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
                                ✅ Paste this script just before your website’s closing <code>&lt;/body&gt;</code> tag.<br />
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
