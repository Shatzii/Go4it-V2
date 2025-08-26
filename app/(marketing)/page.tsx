// Marketing page - redirect to main page to fix static generation
import { redirect } from 'next/navigation';

export default function MarketingPage() {
  redirect('/');
}