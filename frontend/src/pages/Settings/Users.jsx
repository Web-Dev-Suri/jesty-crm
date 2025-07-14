import React, { useState, useEffect } from 'react';
import { Button, Table, message, Form, Modal, Popconfirm } from 'antd';
import axios from 'axios';
import AdminForm from '@/forms/AdminForm';
import request from '@/request/request';

export default function AssignUser() {
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}admin/list`, { params: { role: 'user' } })
    setUsers(res.data.result || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async (values) => {
    if (editingUser) {
      // Edit user
      await request.update({ entity: 'user', id: editingUser._id, jsonData: values });
      message.success('User updated');
    } else {
      // Add user
      await request.create({ entity: 'user', jsonData: values });
      message.success('User created');
    }
    setVisible(false);
    setEditingUser(null);
    form.resetFields();
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setVisible(true);
    form.setFieldsValue(user);
  };

  const handleDelete = async (user) => {
    await request.delete({ entity: 'user', id: user._id });
    message.success('User deleted');
    fetchUsers();
  };

  const handleCancel = () => {
    setVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
          setEditingUser(null);
          form.resetFields();
        }}
        style={{ marginBottom: 16 }}
      >
        Add User
      </Button>
      <Table
        dataSource={users}
        rowKey="_id"
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Created', dataIndex: 'created', render: v => new Date(v).toLocaleString() },
          {
            title: 'Actions',
            render: (_, record) => (
              <>
                <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                <Popconfirm
                  title="Are you sure to delete this user?"
                  onConfirm={() => handleDelete(record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>Delete</Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />
      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <AdminForm isUpdateForm={!!editingUser} />
          <Button type="primary" htmlType="submit" block>
            {editingUser ? "Update User" : "Create User"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};