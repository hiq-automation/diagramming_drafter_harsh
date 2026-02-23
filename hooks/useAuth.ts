
import { useAuthContext } from '../contexts/AuthContext';

// Export as useAuth to maintain backward compatibility
export const useAuth = () => {
    return useAuthContext();
};
