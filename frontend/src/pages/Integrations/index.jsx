// src/pages/Integrations.jsx
import React, { useState } from 'react';
import { Button, Card } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import facebookIcon from '@/style/images/facebook-icon.png';

const Integrations = () => {
    const [step, setStep] = useState('select');
    const [formData, setFormData] = useState({
        websiteUrl: '',
        formId: '',
    });
    const [submitted, setSubmitted] = useState(false);

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
        window.location.href = `${import.meta.env.VITE_API_URL}/facebook/auth`;
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

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Integrations</h2>

            {step === 'select' && (
                <>
                    {/* Website Integration Card */}
                    <Card
                        className="mb-8"
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
                        className="mb-8"
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
                </>
            )}

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
