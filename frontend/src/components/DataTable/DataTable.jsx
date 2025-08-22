import { useCallback, useEffect, useState } from 'react';

import moment from 'moment';


import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  RedoOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { Dropdown, Table, Button, Input, DatePicker, Select } from 'antd';
const { RangePicker } = DatePicker;
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { dataForTable } from '@/utils/dataStructure';
import { useMoney, useDate } from '@/settings';

import { generate as uniqueId } from 'shortid';

import { useCrudContext } from '@/context/crud';

import { erp } from '@/redux/erp/actions';

import { Tag } from 'antd';
import 'antd/dist/reset.css';
 

// Utility to assign a color based on a string (user name or id)
const userColors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];
function getColorForUser(nameOrId) {
  if (!nameOrId) return 'default';
  let hash = 0;
  for (let i = 0; i < nameOrId.length; i++) {
    hash = nameOrId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return userColors[Math.abs(hash) % userColors.length];
}

const tagStyle = {
  minWidth: '80%', 
  height: '30px',
  textAlign: 'center',
  alignContent: 'center',
  borderRadius: '10px',
  padding: '0 8px',  
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 500,
};


// Specific color mapping for Source
const sourceColors = {
  Website: 'green',
  'Google Form': 'gold',
  'Meta Campaign A': 'blue',
  'Meta Campaign B': 'blue',
};

// Specific color mapping for Status
const statusColors = {
  'New Lead': 'orange',
  Contacted: 'yellow',
  'Did not pick': 'blue',
  'Consultation Scheduled': 'green',
  DND: 'red',
};

function AddNewItem({ config, onAdd }) {
  const { ADD_NEW_ENTITY } = config;
  return (
    <Button onClick={onAdd} type="primary">
      {ADD_NEW_ENTITY}
    </Button>
  );
}

export default function DataTable(props) {
  const list = useSelector(selectListItems);
  const { config, extra = [] } = props;
  const { entity, dataTableColumns, DATATABLE_TITLE, fields, searchConfig } = config;
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, readBox, editBox, advancedBox } = crudContextAction;
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const { dateFormat } = useDate();

  const items = [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
    },
    ...extra,
    {
      type: 'divider',
    },

    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
    },
  ];

  const handleRead = (record) => {
    dispatch(crud.currentItem({ data: record }));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };
  function handleEdit(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  }
  function handleDelete(record) {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  }

  function handleUpdatePassword(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    advancedBox.open();
    panel.open();
    collapsedBox.open();
  }

  let dispatchColumns = [];
  if (fields) {
    dispatchColumns = [...dataForTable({ fields, translate, moneyFormatter, dateFormat })];

    // Inject custom render for source
    const sourceColIdx = dispatchColumns.findIndex((col) => col.dataIndex === 'source');
    if (sourceColIdx !== -1) {
      dispatchColumns[sourceColIdx] = {
        ...dispatchColumns[sourceColIdx],
        render: (value) =>
          value ? <Tag color={sourceColors[value] || 'default'} style={tagStyle}>{value}</Tag> : '-',
      };
    }

    // Inject custom render for status
    const statusColIdx = dispatchColumns.findIndex((col) => {
  if (Array.isArray(col.dataIndex)) {
    return col.dataIndex[0] === 'status';
  }
  return col.dataIndex === 'status';
});

if (statusColIdx !== -1) {
  dispatchColumns[statusColIdx] = {
    ...dispatchColumns[statusColIdx],
    render: (value) =>
      value ? <Tag color={statusColors[value] || 'default'} style={tagStyle}>{value}</Tag> : '-',
  };
}

    // Assigned User column
    const hasAssigned = dispatchColumns.some((col) => col.dataIndex === 'assigned');
    if (!hasAssigned) {
      dispatchColumns.push({
        title: translate('Assigned User'),
        dataIndex: ['assigned', 'name'],
        key: 'assigned',
        render: (value, record) => {
          const assignedName =
            record.assigned && record.assigned.name
              ? record.assigned.name
              : record.assigned && typeof record.assigned === 'string'
              ? record.assigned
              : '-';
          if (assignedName && assignedName !== '-') {
            return (
              <Tag color={getColorForUser(assignedName)} style={tagStyle}>{assignedName}</Tag>
            );
          }
          return '-';
        },
      });
    }
  } else {
    dispatchColumns = [...dataTableColumns];
  }

  // FIX: Use a new variable instead of reassigning dataTableColumns
  const finalColumns = [
    ...dispatchColumns,
    {
      title: translate('Created At'),
      dataIndex: 'created',
      key: 'created',
      render: (createdAt) => (createdAt ? moment(createdAt).fromNow() : '-'),
    },
    {
      title: '',
      key: 'action',
      fixed: 'right',
      onCell: () => ({
        onClick: (e) => {
          e.stopPropagation();
        },
      }),
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;
                case 'delete':
                  handleDelete(record);
                  break;
                case 'updatePassword':
                  handleUpdatePassword(record);
                  break;
                default:
                  break;
              }
            },
          }}
          trigger={['click']}
        >
          <span
            style={{ cursor: 'pointer', fontSize: '24px' }}
          >
            <EllipsisOutlined />
          </span>
        </Dropdown>
      ),
    },
  ];

  const dataSource = list.result?.items || [];
  const pagination = list.result?.pagination || {};
  const listIsLoading = list.isLoading;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback(
  (pagination) => {
    const options = {
      page: pagination?.current || 1,
      items: pagination?.pageSize || list.result?.pagination?.pageSize || 10,
      sortBy: 'created',
      sortValue: 'desc',
    };
    dispatch(crud.list({ entity, options }));
  },
  [entity, dispatch, list.result?.pagination?.pageSize]
);


  const filterTable = (e) => {
    const value = e.target.value;
    const options = {
      q: value,
      fields: searchConfig?.searchFields || '',
      page: 1,
      items: pagination?.pageSize || 10,
      sortBy: 'created',
      sortValue: 'desc',
    };
    dispatch(crud.list({ entity, options }));
  };

  const dispatcher = (pageArg) => {
  const options = {
    page: pageArg || pagination?.current || 1,
    items: pagination?.pageSize || 10,
    sortBy: 'created',
    sortValue: 'desc',
  };
  dispatch(crud.list({ entity, options }));
};


  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    // polling for near real-time updates without altering backend
    const intervalId = setInterval(() => {
      dispatcher(pagination?.current || 1);
    }, 15000);
    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, [pagination?.current, pagination?.pageSize]);

  // Filter state and options
  const [dateRange, setDateRange] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const { userOptions = [], statusOptions = [] } = props.filterOptions || {};
  // console.log('userOptions', userOptions);
  // console.log('statusOptions', statusOptions);

  // Filtering logic
  const handleFilter = () => {
    const params = {
      page: 1,
      items: pagination?.pageSize || 10,
      sortBy: 'created',
      sortValue: 'desc',
    };
    if (Array.isArray(dateRange) && dateRange.length === 2) {
      params.created_gte = dateRange[0].startOf('day').toISOString();
      params.created_lte = dateRange[1].endOf('day').toISOString();
    }
    if (selectedAgents && selectedAgents.length) params.assigned = selectedAgents.join(',');
    if (selectedStatus && selectedStatus.length) params.status = selectedStatus.join(',');
    dispatch(crud.list({ entity: config.entity, options: params }));
  };

  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line
  }, [dateRange, selectedAgents, selectedStatus]);

  // Handler for Add Client button - open SidePanel Create form
  const handleAddClient = () => {
    dispatch(crud.currentItem({ data: {} }));
    dispatch(crud.currentAction({ actionType: 'create', data: {} }));
    panel.open();
    collapsedBox.open();
  };

  return (
    <>
      <PageHeader
        // onBack={() => window.history.back()}
        // backIcon={<ArrowLeftOutlined />}
        // title={DATATABLE_TITLE}
        // ghost={false}
        extra={[
          <Input
            key="search"
            onChange={filterTable}
            placeholder={translate('search')}
            allowClear
            style={{ width: 180 }}
          />,
          <RangePicker
            key="date"
            onChange={val => setDateRange(val || [])}
            value={dateRange}
            style={{ width: 220 }}
          />,
          <Select
            key="agents"
            mode="multiple"
            allowClear
            placeholder="Agent(s)"
            style={{ width: 160 }}
            options={userOptions}
            value={selectedAgents}
            onChange={setSelectedAgents}
          />,
          <Select
            key="status"
            mode="multiple"
            allowClear
            placeholder="Status"
            style={{ width: 160 }}
            options={statusOptions}
            value={selectedStatus}
            onChange={setSelectedStatus}
          />,
          // <Button onClick={handelDataTableLoad} key={`${uniqueId()}`} icon={<RedoOutlined />}>
          //   {translate('Refresh')}
          // </Button>,
          <AddNewItem key={`${uniqueId()}`} config={config} onAdd={handleAddClient} />,
        ]}
        style={{
          padding: '20px 0',
        }}
      />
      <Table
        columns={finalColumns}
        rowKey={(item) => item._id}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        scroll={{ x: true }}
        onRow={(record) => ({
          onClick: () => handleRead(record),
        })}
      />
      
    </>
  );
}
