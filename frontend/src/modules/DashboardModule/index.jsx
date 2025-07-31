import { useEffect, useState } from 'react';

import { Tag, Row, Col } from 'antd';
import useLanguage from '@/locale/useLanguage';

import { useMoney } from '@/settings';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import useOnFetch from '@/hooks/useOnFetch';

import LeadsLineChart from './components/LeadsLineChart';
import PreviewCard from './components/PreviewCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';
import LeadPieCard from './components/LeadPieCard';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

export default function DashboardModule() {
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);
  const currentAdmin = useSelector(selectCurrentAdmin);

  // Remove greeting logic and display from here

  const getStatsData = async ({ entity, currency }) => {
    return await request.summary({
      entity,
      options: { currency },
    });
  };

  const {
    result: invoiceResult,
    isLoading: invoiceLoading,
    onFetch: fetchInvoicesStats,
  } = useOnFetch();

  const { result: quoteResult, isLoading: quoteLoading, onFetch: fetchQuotesStats } = useOnFetch();

  const {
    result: paymentResult,
    isLoading: paymentLoading,
    onFetch: fetchPayemntsStats,
  } = useOnFetch();

  const { result: clientResult, isLoading: clientLoading } = useFetch(() =>
    request.summary({ entity: 'client' })
  );

  const [leadPieData, setLeadPieData] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [leadLoading, setLeadLoading] = useState(true);

  const [assignedPieData, setAssignedPieData] = useState([]);
  const [totalAssigned, setTotalAssigned] = useState(0);


  const revenueTarget = 1000000;
  const revenueAchievedPercent = clientResult?.totalRevenue
    ? Math.round((clientResult.totalRevenue / revenueTarget) * 100)
    : 0;

  // Remove greeting logic and display from here


  useEffect(() => {
    async function fetchLeadStatus() {
      setLeadLoading(true);
      const res = await request.get({ entity: '/lead-status-summary' });
      if (res.success) {
        setLeadPieData(res.result.data);
        setTotalLeads(res.result.total);
      }
      setLeadLoading(false);
    }
    fetchLeadStatus();
  }, []);

  useEffect(() => {
    async function fetchAssignedSummary() {
      const res = await request.get({ entity: '/lead-assigned-summary' });
      if (res.success) {
        setAssignedPieData(res.result.data);
        setTotalAssigned(res.result.total);
      }
    }
    fetchAssignedSummary();
  }, []);

  useEffect(() => {
    const currency = money_format_settings.default_currency_code || null;

    if (currency) {
      fetchInvoicesStats(getStatsData({ entity: 'invoice', currency }));
      fetchQuotesStats(getStatsData({ entity: 'quote', currency }));
      fetchPayemntsStats(getStatsData({ entity: 'payment', currency }));
    }
  }, [money_format_settings.default_currency_code]);

  const dataTableColumns = [
    {
      title: translate('number'),
      dataIndex: 'number',
    },
    {
      title: translate('Client'),
      dataIndex: ['client', 'name'],
    },

    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
    },
  ];

  const entityData = [
    {
      result: invoiceResult,
      isLoading: invoiceLoading,
      entity: 'invoice',
      title: translate('Invoices'),
    },
    {
      result: quoteResult,
      isLoading: quoteLoading,
      entity: 'quote',
      title: translate('quote'),
    },
  ];

  const statisticCards = entityData.map((data, index) => {
    const { result, entity, isLoading, title } = data;

    return (
      <PreviewCard
        key={index}
        title={title}
        isLoading={isLoading}
        entity={entity}
        statistics={
          !isLoading &&
          result?.performance?.map((item) => ({
            tag: item?.status,
            color: 'blue',
            value: item?.percentage,
          }))
        }
      />
    );
  });

  const STATUS_COLORS = {
    'New Lead': '#00C49F',
    'Contacted': '#0088FE',
    'Consultation Scheduled': '#FF8042',
  };
  const STATUS_LABELS = [
    { label: 'New Lead', color: '#00C49F' },
    { label: 'Contacted', color: '#0088FE' },
    { label: 'Consultation Scheduled', color: '#FF8042' },
  ];

  // For assigned users, generate colors dynamically:
  const assignedColors = {};
  assignedPieData.forEach((item, idx) => {
    // Use a color palette or fallback to a default
    const palette = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FF6699', '#00B8D9'];
    assignedColors[item.name] = palette[idx % palette.length];
  });
  const assignedLabels = assignedPieData.map(item => ({
    label: item.name,
    color: assignedColors[item.name],
  }));

  const [leadsChartData, setLeadsChartData] = useState([]);
  const [leadsChartLoading, setLeadsChartLoading] = useState(false);
  const [leadsChartRange, setLeadsChartRange] = useState('week'); // 'week' | 'month' | 'year'

  // Helper to get date range
  function getDateRange(range) {
    const end = new Date();
    let start = new Date();
    if (range === 'week') {
      start.setDate(end.getDate() - 6);
    } else if (range === 'month') {
      start.setMonth(end.getMonth() - 1);
      start.setDate(start.getDate() + 1);
    } else if (range === 'year') {
      start.setFullYear(end.getFullYear() - 1);
      start.setDate(start.getDate() + 1);
    }
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    };
  }

  // Fetch leads per day for chart
  useEffect(() => {
    async function fetchLeadsChart() {
      setLeadsChartLoading(true);
      try {
        const res = await request.get({ entity: `/lead-created-per-day` });
        if (res.success && Array.isArray(res.result)) {
          setLeadsChartData(res.result.map(item => ({ date: item._id, count: item.count })));
        } else {
          setLeadsChartData([]);
        }
      } catch {
        setLeadsChartData([]);
      }
      setLeadsChartLoading(false);
    }
    fetchLeadsChart();
  }, [leadsChartRange]);


  if (money_format_settings) {
    return (
      <>
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12} md={12} lg={6}>
            <LeadPieCard
              data={leadPieData}
              total={totalLeads}
              title="Leads Overview"
              subtitle="Status of all leads in the system"
              buttonText="View All Leads"
              onButtonClick={() => {/* your handler */ }}
              colors={STATUS_COLORS}
              labels={STATUS_LABELS}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <LeadPieCard
              data={assignedPieData}
              total={totalAssigned}
              title="Leads by Assigned User"
              subtitle="Leads by assigned user"
              buttonText="View All Leads"
              onButtonClick={() => {/* your handler */ }}
              colors={assignedColors}
              labels={assignedLabels}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <LeadPieCard
              data={leadPieData}
              total={totalLeads}
              title="Leads Overview"
              subtitle="Status of all leads in the system"
              buttonText="View All Leads"
              onButtonClick={() => {/* your handler */ }}
              colors={STATUS_COLORS}
              labels={STATUS_LABELS}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <LeadPieCard
              data={assignedPieData}
              total={totalAssigned}
              title="Leads by Assigned User"
              subtitle="Leads by assigned user"
              buttonText="View All Leads"
              onButtonClick={() => {/* your handler */ }}
              colors={assignedColors}
              labels={assignedLabels}
            />
          </Col>
        </Row>
        <div className="space30"></div>
        <Row gutter={[32, 32]}>
          <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }}>
            <div className="whiteBox shadow" style={{ height: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 20px' }}>
                <h3 style={{ color: '#22075e', marginBottom: 0 }}>
                  {translate('Leads Over Past 30 Days')}
                </h3>
                {/* <div>
                  <select
                    value={leadsChartRange}
                    onChange={e => setLeadsChartRange(e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #d9d9d9' }}
                  >
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="year">Past Year</option>
                  </select>
                </div> */}
              </div>
              <LeadsLineChart data={leadsChartData} loading={leadsChartLoading} />
            </div>
          </Col>
          <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
            <CustomerPreviewCard
              isLoading={clientLoading}
              totalRevenue={clientResult?.totalRevenue}
              revenueAchievedPercent={revenueAchievedPercent}
              newCustomer={clientResult?.new}
            />
          </Col>
        </Row>

      </>
    );
  } else {
    return <></>;
  }
}
