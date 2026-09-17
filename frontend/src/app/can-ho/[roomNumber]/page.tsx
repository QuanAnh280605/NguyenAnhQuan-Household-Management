import { mockApartmentA1205, mockApartmentsList } from '@/lib/mock-data';
import { ApartmentDetailClient } from './detail-client';

interface Props {
  params: Promise<{ roomNumber: string }>;
}

export default async function ApartmentDetailPage({ params }: Props) {
  const { roomNumber } = await params;

  // Lookup apartment or fallback to mockApartmentA1205
  const apartment =
    mockApartmentsList.find((a) => a.roomNumber.toLowerCase() === roomNumber.toLowerCase()) ||
    mockApartmentA1205;

  return <ApartmentDetailClient apartment={apartment} />;
}
