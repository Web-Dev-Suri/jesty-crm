import DashboardModule from '@/modules/DashboardModule';
import { useSelector } from 'react-redux';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

export default function Dashboard() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
  const userName = currentAdmin?.name || '';
  const greeting = `${getGreeting()}${userName ? ' ' + userName : ''}`;
  return (
    <>
      <h2 style={{marginBottom: 24, fontWeight: 600}}>{greeting}</h2>
      <DashboardModule />
    </>
  );
}
