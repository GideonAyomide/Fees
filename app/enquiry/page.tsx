import type { Metadata } from 'next';
import { EnquiryForm } from '@/components/enquiry-form';

export const metadata: Metadata = {
  title: 'Ask the School',
  description: 'Submit fee and policy enquiries directly to Crown Heights Academy records.',
};

export default function EnquiryPage() {
  return <EnquiryForm />;
}
