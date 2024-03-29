'use client';

import { SafeUser, SafeReservation } from '../types';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import Container from '../components/Container';
import Heading from '../components/Heading';
import ListingCard from '../components/listings/ListingCard';

interface ReservationsClientProps {
  currentUser: SafeUser | null;
  reservations: SafeReservation[];
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  currentUser,
  reservations,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback(
    async (id: string) => {
      setDeletingId(id);

      try {
        const req = await fetch(`/api/reservations/${id}`, {
          method: 'DELETE',
        });
        toast.success('Reservation cancelled');
        router.refresh();
      } catch (err) {
        toast.error('Something went wrong');
      } finally {
        setDeletingId('');
      }
    },
    [router]
  );
  return (
    <Container>
      <Heading title="Reservations" subtitle="Bookings on your properties" />
      <div
        className="mt-10 grid grid-cols-1 sm:grid-cols-2
      md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
      gap-8"
      >
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel guest reservation"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default ReservationsClient;
