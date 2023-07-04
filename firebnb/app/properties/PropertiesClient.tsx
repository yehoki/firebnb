'use client';

import { useRouter } from 'next/navigation';
import Container from '../components/Container';
import Heading from '../components/Heading';
import { SafeListing, SafeUser } from '../types';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import ListingCard from '../components/listings/ListingCard';

interface PropertiesClientProps {
  listings: SafeListing[];
  currentUser: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        const req = await fetch(`/api/listings/${id}`, {
          method: 'DELETE',
        });
        toast.success('Listing deleted!');
        router.refresh();
      } catch (err: any) {
        toast.error(err?.response?.data?.error);
      } finally {
        setDeletingId('');
      }
    },
    [router]
  );
  return (
    <Container>
      <Heading title="Properties" subtitle="List of your properties" />
      <div
        className="mt-10 grid grid-cols-1 sm:grid-cols-2
      md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
      gap-8"
      >
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onCancel}
            disabled={deletingId === listing.id}
            actionLabel="Delete property"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default PropertiesClient;
