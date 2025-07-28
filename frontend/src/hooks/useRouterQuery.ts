import { useLocation } from 'react-router-dom';

export function useRouteQuery(key: string): string | null {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  return params.get(key);
}
