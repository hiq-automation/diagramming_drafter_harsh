
export const getAppBuilderApiBaseUrl = (): string => {
    const isStudioMode = window.location.href.includes('.goog');
    if (isStudioMode) {
        // Management APIs (RBAC, Auth) in the HumanizeIQ ecosystem usually sit under this segment
        return 'https://www.playtest.humanizeiq.ai/api/ai_studio_manager_api';
    } else {
        // In deployed mode, use a relative path.
        return '/api/ai_studio_manager_api';
    }
};
export const getUserManagementApiBaseUrl = (): string => {
    const isStudioMode = window.location.href.includes('.goog');
    if (isStudioMode) {
        // Management APIs (RBAC, Auth) in the HumanizeIQ ecosystem usually sit under this segment
        return 'https://www.playtest.humanizeiq.ai/api/user_management';
    } else {
        // In deployed mode, use a relative path.
        return '/api/user_management';
    }
};