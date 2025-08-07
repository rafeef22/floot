import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminSettings } from "../endpoints/admin/settings_GET.schema";
import { postAdminSettingsUpdate, InputType as UpdateSettingsInput } from "../endpoints/admin/settings/update_POST.schema";

export const settingsQueryKeys = {
  all: ["settings"] as const,
};

export const useSettings = () => {
  return useQuery({
    queryKey: settingsQueryKeys.all,
    queryFn: getAdminSettings,
  });
};

export const useUpdateSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedSettings: UpdateSettingsInput) => postAdminSettingsUpdate(updatedSettings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all });
        },
    });
};