import { create } from 'zustand';
import { useRouter } from 'next/navigation';
import { MouseEvent, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { SafeUser } from '../types';

import useLoginModal from './useLoginModal';

interface IUseFavourite {
  listingId: string;
  currentUser: SafeUser | null;
}

const useFavourite = ({ listingId, currentUser }: IUseFavourite) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavourited = useMemo(() => {
    const list = currentUser?.favouriteIds || [];

    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavourite = useCallback(
    async (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!currentUser) {
        return loginModal.onOpen();
      }

      try {
        let req;
        if (hasFavourited) {
          req = () =>
            fetch(`/api/favourites/${listingId}`, {
              method: 'DELETE',
            });
        } else {
          req = () =>
            fetch(`/api/favourites/${listingId}`, {
              method: 'POST',
            });
        }
        await req();
        router.refresh();
        toast.success('Success');
      } catch (err) {
        toast.error('Something went wrong');
      }
    },
    [currentUser, hasFavourited, loginModal, router, listingId]
  );

  return {
    hasFavourited,
    toggleFavourite,
  };
};

export default useFavourite;
