'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRecruitingData() {
  const { data: dashboard, error: dashboardError } = useSWR(
    '/api/recruiting/integrated-dashboard',
    fetcher,
  );
  const { data: scholarships, error: scholarshipsError } = useSWR(
    '/api/recruiting/scholarships?sport=Basketball',
    fetcher,
  );
  const { data: matches, error: matchesError } = useSWR(
    '/api/recruiting/matches?sport=Basketball',
    fetcher,
  );
  const { data: contacts, error: contactsError } = useSWR('/api/recruiting/contacts', fetcher);

  return {
    dashboard,
    scholarships,
    matches,
    contacts,
    isLoading: !dashboard && !dashboardError,
    error: dashboardError || scholarshipsError || matchesError || contactsError,
  };
}
