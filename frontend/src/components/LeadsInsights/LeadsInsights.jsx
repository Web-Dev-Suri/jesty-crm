import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentItem, selectListItems } from '@/redux/crud/selectors';
import { crud } from '@/redux/crud/actions';
import { Button, Modal, Timeline, Input, DatePicker, Dropdown, Menu, Divider, Select, Tag, Tooltip } from 'antd';
import { LeftOutlined, RightOutlined, EditOutlined, DeleteOutlined, PlusOutlined, CalendarOutlined, WhatsAppOutlined, PhoneOutlined, MailOutlined, MoreOutlined } from '@ant-design/icons';

export default function LeadsInsights({
  onEdit,
  onDelete,
}) {
  const { result: client } = useSelector(selectCurrentItem);
  const clientList = useSelector(selectListItems)?.items || [];
  const dispatch = useDispatch();

  // Find current index for prev/next
  const currentIndex = clientList.findIndex(c => c._id === client?._id);

  // State for modals
  const [followupModal, setFollowupModal] = useState(false);
  const [notesModal, setNotesModal] = useState(false);
  const [allNotesModal, setAllNotesModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [followupDate, setFollowupDate] = useState(null);
  const [noteHeading, setNoteHeading] = useState('');
  const [noteBody, setNoteBody] = useState('');
  // Edit fields
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [showStatusSelect, setShowStatusSelect] = useState(false);
  const [editRevenue, setEditRevenue] = useState(client?.revenue || 0); // Revenue state

  // Handle adding a note (persist to backend)
  const handleAddNote = async () => {
    if (!noteHeading.trim()) return; // Only heading is required
    const newNote = {
      heading: noteHeading,
      body: noteBody,
      createdAt: new Date().toISOString(),
    };
    const updatedClient = {
      ...client,
      notes: [...(client.notes || []), newNote],
    };
    await dispatch(crud.update({
      entity: 'client',
      id: client._id,
      jsonData: updatedClient
    }));
    setNoteHeading('');
    setNoteBody('');
    setNotesModal(false);
  };

  // Handle adding a followup (persist to backend)
  const handleAddFollowup = async () => {
    if (!followupDate) return;
    const newFollowup = {
      date: followupDate.toISOString(),
      createdAt: new Date().toISOString(), // This is when the activity is logged
    };
    const updatedClient = {
      ...client,
      followups: [...(client.followups || []), newFollowup],
    };
    await dispatch(crud.update({
      entity: 'client',
      id: client._id,
      jsonData: updatedClient,
    }));
    setFollowupDate(null);
    setFollowupModal(false);
  };

  // Find the next scheduled followup in the future
  const nextFollowup = (client?.followups || [])
    .map(f => new Date(f.date))
    .filter(date => date > new Date())
    .sort((a, b) => a - b)[0];

  // Timeline events: single chronological array
  const timelineItems = [
    {
      type: 'lead',
      label: 'Lead Arrived',
      createdAt: client?.created,
    },
    ...(client?.followups || []).map(f => ({
      type: 'followup',
      label: 'Followup Scheduled',
      createdAt: f.createdAt || f.date,
      scheduledFor: f.date,
    })),
    ...(client?.notes || []).map(note => ({
      type: 'note',
      label: `Note made "${note.heading}"`,
      createdAt: note.createdAt,
    })),
  ]
    .filter(item => !!item.createdAt)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Edit modal handlers
  const openEditModal = () => {
    setEditName(client?.name || '');
    setEditPhone(client?.phone || '');
    setEditEmail(client?.email || '');
    setEditRevenue(client?.revenue || 0); // Set revenue
    setEditModal(true);
  };
  const handleEditSave = async () => {
    await dispatch(crud.update({
      entity: 'client',
      id: client._id,
      jsonData: {
        ...client,
        name: editName,
        phone: editPhone,
        email: editEmail,
        revenue: Number(editRevenue) || 0, // Include revenue
      }
    }));
    setEditModal(false);
  };

  // Dropdown menu for ellipsis
  const menu = (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={openEditModal}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={onDelete}>
        Delete
      </Menu.Item>
    </Menu>
  );

  // Prev/Next handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      dispatch(crud.currentItem({ data: clientList[currentIndex - 1] }));
    }
  };
  const handleNext = () => {
    if (currentIndex !== -1 && currentIndex < clientList.length - 1) {
      dispatch(crud.currentItem({ data: clientList[currentIndex + 1] }));
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Button icon={<LeftOutlined />} onClick={handlePrev} style={{ marginRight: 8 }} disabled={currentIndex <= 0} />
          <Button icon={<RightOutlined />} onClick={handleNext} disabled={currentIndex === -1 || currentIndex >= clientList.length - 1} />
        </div>
        <Dropdown overlay={menu} trigger={['click']}>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', border: '1px solid #d9d9d9', borderRadius: 4, padding: '6px 16px', fontWeight: 600, fontSize: 18, userSelect: 'none' }}>
            <span style={{ marginRight: 16 }}>Options</span>
            <span style={{ display: 'inline-block', fontSize: 22, letterSpacing: '2px', transform: 'rotate(90deg)' }}>⋮</span>
          </div>
        </Dropdown>
      </div>

      {/* 2. Client Name */}
      <h2
        style={{
          marginBottom: 16,
          fontSize: 40,
          color: '#22304a',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          lineHeight: 1.2,
        }}
      >
        {client?.name}
      </h2>

      {/* 3. Followup and Notes Buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <Button
          icon={<CalendarOutlined />}
          onClick={() => setFollowupModal(true)}
          style={
            nextFollowup
              ? {
                  background: '#fff1f0',
                  color: '#cf1322',
                  border: '1px solid #ffa39e',
                  fontWeight: 600,
                }
              : undefined
          }
        >
          {nextFollowup
            ? `Followup scheduled for ${nextFollowup.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${nextFollowup.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
            : 'Schedule Followup'}
        </Button>
        <Button
          icon={<PlusOutlined />}
          onClick={() => setNotesModal(true)}
        >
          Add Note
        </Button>

        {/* WhatsApp Button (only if phone exists) */}
        {client?.phone && (
          <Button
            icon={<WhatsAppOutlined />}
            style={{
              background: '#25D366',
              color: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
            href={`https://wa.me/+91${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Hi I recieved a query from you')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Whatsapp
          </Button>
        )}

        {/* Phone Button (only if phone exists) */}
        {client?.phone && (
          <Button
            icon={<PhoneOutlined />}
            style={{
              background: '#1890ff',
              color: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
            href={`tel:${client.phone}`}
          >
            Phone
          </Button>
        )}

        {/* Email Button (only if email exists) */}
        {client?.email && (
          <Button
            icon={<MailOutlined />}
            style={{
              background: '#ea4335',
              color: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
            href={`mailto:${client.email}`}
          >
            Email
          </Button>
        )}
      </div>

      {/* 5 & 6. Two-column layout with grey boxes and headings */}
      <div style={{ display: 'flex', gap: 32 }}>
        {/* Left: Client Info */}
        <div
          style={{
            flex: 6,
            background: '#f5f6fa',
            borderRadius: 8,
            padding: 24,
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            minHeight: 300,
            maxHeight: 400,
            overflowY: 'auto'
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            Client Info
          </h3>
          <Divider style={{ margin: '16px 0 16px 0' }} />
          <div style={{ display: 'flex', gap: 32 }}>
            {/* Left column: labels and values */}
            <div style={{ flex: 1 }}>
              {/* STATUS FIRST */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#555', letterSpacing: 0.5, marginBottom: 2 }}>
                  STATUS
                </div>
                <div>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={e => {
                      e.stopPropagation();
                      setShowStatusSelect(true);
                    }}
                    tabIndex={0}
                    role="button"
                  >
                    {!showStatusSelect ? (
                      <Tag color="blue" style={{ fontSize: 14, padding: '2px 12px' }}>
                        {client?.status}
                      </Tag>
                    ) : (
                      <Select
                        size="small"
                        value={client?.status}
                        style={{ minWidth: 140 }}
                        onChange={async value => {
                          await dispatch(
                            crud.update({
                              entity: 'client',
                              id: client._id,
                              jsonData: { ...client, status: value },
                            })
                          );
                          setShowStatusSelect(false);
                        }}
                        onBlur={() => setShowStatusSelect(false)}
                        autoFocus
                        options={[
                          { value: 'New Lead', label: 'New Lead' },
                          { value: 'Contacted', label: 'Contacted' },
                          { value: 'Did not pick', label: 'Did not pick' },
                          { value: 'Consultation Scheduled', label: 'Consultation Scheduled' },
                          { value: 'DND', label: 'DND' },
                        ]}
                      />
                    )}
                  </span>
                </div>
              </div>
              {/* MOBILE NUMBER */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#555', letterSpacing: 0.5, marginBottom: 2 }}>
                  MOBILE NUMBER
                </div>
                <div style={{ fontSize: 16, color: '#22304a', minHeight: 24 }}>
                  {client?.phone ? client.phone : <span style={{ color: '#888' }}>-</span>}
                </div>
              </div>
              {/* EMAIL ADDRESS */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#555', letterSpacing: 0.5, marginBottom: 2 }}>
                  EMAIL ADDRESS
                </div>
                <div style={{ fontSize: 16, color: '#22304a', minHeight: 24 }}>
                  {client?.email || <span style={{ color: '#888' }}>-</span>}
                </div>
              </div>
              {/* REVENUE */}
              <div style={{ marginBottom: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#555', letterSpacing: 0.5, marginBottom: 2 }}>
                  REVENUE
                </div>
                <div style={{ fontSize: 16, color: '#22304a', minHeight: 24 }}>
                  ₹{client?.revenue ?? 0}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Timeline */}
        <div style={{
          flex: 4,
          background: '#f5f6fa',
          borderRadius: 8,
          padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          minHeight: 300,
          maxHeight: 400,
          overflowY: 'auto',
          position: 'relative',
          paddingTop: 24,      // Add this
          paddingBottom: 24    // Add this
        }}>
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              background: '#f5f6fa',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ marginTop: 0 }}>Timeline</h3>
              <a
                style={{
                  marginLeft: 8,
                  fontSize: 11,
                  color: '#1890ff',
                  cursor: 'pointer',
                }}
                onClick={() => setAllNotesModal(true)}
                tabIndex={0}
                role="button"
              >
                View Client Notes
              </a>
            </div>
            <Divider style={{ margin: '8px 0 16px 0' }} />
          </div>
          <Timeline>
            {timelineItems.map((item, idx) => (
              <Timeline.Item
                key={idx}
                color={item.type === 'followup' ? '#fa8c16' : undefined}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    {item.label}
                    {item.type === 'followup' && item.scheduledFor && (
                      <div
                        style={{
                          fontSize: 11,
                          color: '#aaa',
                          marginTop: 2,
                          marginLeft: 2,
                          fontWeight: 400,
                        }}
                      >
                        for {new Date(item.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(item.scheduledFor).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </div>
                    )}
                  </span>
                  <span style={{ fontSize: 12, color: '#888' }}>
                    {item.createdAt
                      ? `${new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                      : ''}
                  </span>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </div>

      {/* Followup Modal */}
      <Modal
        title="Schedule Followup"
        open={followupModal}
        onCancel={() => setFollowupModal(false)}
        onOk={handleAddFollowup}
        okText="Schedule"
      >
        <DatePicker
          showTime
          value={followupDate}
          onChange={setFollowupDate}
          style={{ width: '100%' }}
          format="YYYY-MM-DD HH:mm"
        />
        {followupDate && (
          <div style={{ marginTop: 16 }}>
            Selected: {followupDate.format('YYYY-MM-DD HH:mm')}
          </div>
        )}
      </Modal>

      {/* Notes Modal */}
      <Modal
        title="Add Note"
        open={notesModal}
        onCancel={() => setNotesModal(false)}
        onOk={handleAddNote}
        okText="Add Note"
      >
        <Input
          placeholder="Note Heading"
          value={noteHeading}
          onChange={e => setNoteHeading(e.target.value)}
          style={{ marginBottom: 8 }}
          required
        />
        <Input.TextArea
          placeholder="Note Body (optional)"
          value={noteBody}
          onChange={e => setNoteBody(e.target.value)}
          rows={4}
        />
        <div style={{ marginTop: 16 }}>
          <b>Previous Notes:</b>
          <div style={{ maxHeight: 150, overflowY: 'auto', marginTop: 8 }}>
            {(client?.notes || []).length === 0 ? (
              <div style={{ color: '#888' }}>No notes yet.</div>
            ) : (
              [...client.notes]
                .reverse()
                .map((note, idx) => (
                  <div key={idx} style={{ marginBottom: 12, padding: 8, background: '#fafafa', borderRadius: 4 }}>
                    <div style={{ fontWeight: 'bold' }}>{note.heading}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      {note.createdAt ? new Date(note.createdAt).toLocaleString() : ''}
                    </div>
                    <div>{note.body}</div>
                  </div>
                )))
            }
          </div>
        </div>
      </Modal>

      {/* All Client Notes Modal */}
      <Modal
        title="All Client Notes"
        open={allNotesModal}
        onCancel={() => setAllNotesModal(false)}
        footer={null}
        width={500}
      >
        <div style={{ maxHeight: 350, overflowY: 'auto', marginTop: 8 }}>
          {(client?.notes || []).length === 0 ? (
            <div style={{ color: '#888' }}>No notes yet.</div>
          ) : (
            [...client.notes]
              .reverse()
              .map((note, idx) => (
                <div key={idx} style={{ marginBottom: 12, padding: 8, background: '#fafafa', borderRadius: 4 }}>
                  <div style={{ fontWeight: 'bold' }}>{note.heading}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>
                    {note.createdAt ? new Date(note.createdAt).toLocaleString() : ''}
                  </div>
                  <div>{note.body}</div>
                </div>
              ))
          )}
        </div>
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        title="Edit Client"
        open={editModal}
        onCancel={() => setEditModal(false)}
        onOk={handleEditSave}
        okText="Save"
      >
        <Input
          placeholder="Name"
          value={editName}
          onChange={e => setEditName(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Phone"
          value={editPhone}
          onChange={e => setEditPhone(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Email"
          value={editEmail}
          onChange={e => setEditEmail(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Revenue"
          type="number"
          value={editRevenue}
          onChange={e => setEditRevenue(e.target.value)}
          style={{ marginBottom: 8 }}
          min={0}
        />
      </Modal>
    </div>
  );
}''