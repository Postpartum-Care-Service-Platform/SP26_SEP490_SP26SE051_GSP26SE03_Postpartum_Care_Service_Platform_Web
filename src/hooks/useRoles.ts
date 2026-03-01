import { useEffect, useState } from 'react';

import roleService from '@/services/role.service';
import type { Role } from '@/types/role';

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await roleService.getAllRoles();
        setRoles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch roles');
        console.error('Error fetching roles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { roles, loading, error };
}

