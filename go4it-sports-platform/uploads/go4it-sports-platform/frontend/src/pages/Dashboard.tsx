import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchAnalytics } from '../utils/api';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = React.useState(null);

    React.useEffect(() => {
        const getAnalytics = async () => {
            const data = await fetchAnalytics();
            setAnalytics(data);
        };

        getAnalytics();
    }, []);

    return (
        <div className="dashboard">
            <h1 className="text-2xl font-bold">Welcome to Your Dashboard, {user?.name}!</h1>
            {analytics ? (
                <div className="analytics">
                    {/* Render analytics data here */}
                    <h2 className="text-xl">Your Analytics</h2>
                    {/* Example of displaying analytics */}
                    <pre>{JSON.stringify(analytics, null, 2)}</pre>
                </div>
            ) : (
                <p>Loading analytics...</p>
            )}
        </div>
    );
};

export default Dashboard;