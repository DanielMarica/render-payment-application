import { useOutletContext } from 'react-router-dom';
import type { User } from '../../types/User';

export function useCurrentUser() {
  const { currentUser } = useOutletContext<{ currentUser: User | null }>();
  return currentUser;
}