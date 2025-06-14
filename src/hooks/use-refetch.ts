import { useQueryClient } from "@tanstack/react-query";

export const useRefresh = () => {
    const queryClient = useQueryClient();
    return async () => {
        await queryClient.refetchQueries({
            type: 'active',
        })
    }
}
