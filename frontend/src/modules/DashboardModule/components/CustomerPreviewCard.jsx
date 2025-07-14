import { Statistic, Progress, Divider, Row, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

export default function CustomerPreviewCard({
  isLoading = false,
  totalRevenue = 0,
  revenueAchievedPercent = 0,
  newCustomer = 0,
}) {
  const translate = useLanguage();

  return (
    <Row className="gutter-row">
      <div className="whiteBox shadow" style={{ height: 400 }}>
        <div
          className="pad20"
          style={{
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <h3 style={{ color: '#333', marginBottom: 40, marginTop: 15, fontSize: 'large' }}>
            {translate('Revenue Target Progress')}
          </h3>

          {isLoading ? (
            <Spin />
          ) : (
            <div
              style={{
                display: 'grid',
                justifyContent: 'center',
              }}
            >
              <Progress type="dashboard" percent={revenueAchievedPercent} size={148} />
              {/* <p>{translate('Revenue Target Progress')}</p> */}
              <Divider />
              <Statistic
                title={translate('Total Revenue Achieved')}
                value={totalRevenue}
                precision={2}
                valueStyle={{ color: '#333' }}
                prefix="₹"
              />
            </div>
          )}
        </div>
      </div>
    </Row>
  );
}
