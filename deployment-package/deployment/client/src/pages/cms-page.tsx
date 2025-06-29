import { Redirect } from "wouter";

/**
 * Redirects to the new CMS Manager
 * This component exists to maintain backward compatibility with any existing links
 */
export default function CMSPage() {
  return <Redirect to="/admin/cms-manager" />;
}