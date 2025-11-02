import { useState, useEffect } from 'react';

export interface College {
  id: number;
  schoolName: string;
  division: string;
  conference: string | null;
  state: string | null;
  city: string | null;
  website: string | null;
  coachingStaff: any;
  programs: any;
  isActive: boolean;
}

export function useCollegeSearch() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchColleges = async (filters: {
    search?: string;
    division?: string;
    state?: string;
    sport?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.division) params.append('division', filters.division);
      if (filters.state) params.append('state', filters.state);
      if (filters.sport) params.append('sport', filters.sport);

      const response = await fetch(`/api/recruiting/colleges?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setColleges(data.schools);
      } else {
        setError(data.error || 'Failed to fetch colleges');
      }
    } catch (err) {
      setError('An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  return { colleges, loading, error, searchColleges };
}

export function useRecruitingData(userId: number) {
  const [contacts, setContacts] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [offers, setOffers] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const [contactsRes, commsRes, offersRes, timelineRes] = await Promise.all([
          fetch(`/api/recruiting/contacts?userId=${userId}`),
          fetch(`/api/recruiting/communications?userId=${userId}`),
          fetch(`/api/recruiting/offers?userId=${userId}`),
          fetch(`/api/recruiting/timeline?userId=${userId}`),
        ]);

        const [contactsData, commsData, offersData, timelineData] = await Promise.all([
          contactsRes.json(),
          commsRes.json(),
          offersRes.json(),
          timelineRes.json(),
        ]);

        if (contactsData.success) setContacts(contactsData.contacts);
        if (commsData.success) setCommunications(commsData.communications);
        if (offersData.success) setOffers(offersData.offers);
        if (timelineData.success) setTimeline(timelineData.events);
      } catch (error) {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const refetch = () => {
    setLoading(true);
    // Re-trigger useEffect by component remount or manual call
  };

  return { contacts, communications, offers, timeline, loading, refetch };
}
