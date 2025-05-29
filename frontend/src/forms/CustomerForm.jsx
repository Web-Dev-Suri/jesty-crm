import { Form, Input, Select } from 'antd';
import { validatePhoneNumber } from '@/utils/helpers';
import useLanguage from '@/locale/useLanguage';

export default function CustomerForm({ isUpdateForm = false, userOptions = [] }) {
  const translate = useLanguage();
  const validateEmptyString = (_, value) => {
    if (value && value.trim() === '') {
      return Promise.reject(new Error('Field cannot be empty'));
    }
    return Promise.resolve();
  };

  return (
    <>
      <Form.Item
        label={translate('Name')}
        name="name"
        rules={[
          { required: true },
          { validator: validateEmptyString },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label={translate('Phone')}
        rules={[
          { required: false },
          { validator: validateEmptyString },
          { pattern: validatePhoneNumber, message: 'Please enter a valid phone number' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="status"
        label={translate('Status')}
        rules={[{ required: false }]}
      >
        <Select
          options={[
            { label: 'New Lead', value: 'New Lead' },
            { label: 'Contacted', value: 'Contacted' },
            { label: 'Did not pick', value: 'Did not pick' },
            { label: 'Consultation Scheduled', value: 'Consultation Scheduled' },
            { label: 'DND', value: 'DND' },
          ]}
          allowClear
        />
      </Form.Item>

      <Form.Item
        name="source"
        label={translate('Source')}
        rules={[{ required: false }]}
      >
        <Select
          options={[
            { label: 'Website', value: 'Website' },
            { label: 'Google Form', value: 'Google Form' },
            { label: 'Meta Campaign A', value: 'Meta Campaign A' },
            { label: 'Meta Campaign B', value: 'Meta Campaign B' },
          ]}
          allowClear
        />
      </Form.Item>

      <Form.Item
        label={translate('Assigned User')}
        name="assigned"
        rules={[{ required: false }]}
      >
        <Select
          placeholder={translate('Select user')}
          options={userOptions}
          allowClear
        />
      </Form.Item>
    </>
  );
}
