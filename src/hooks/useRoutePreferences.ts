
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RoutePreference {
  id?: string;
  vehicle_type: "car" | "motorcycle";
  fuel_efficiency: string;
  fuel_cost: string;
  toll_route_distance: string;
  toll_free_route_distance: string;
  toll_cost: string;
}

export const useRoutePreferences = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadPreferences = async (): Promise<RoutePreference | null> => {
    setIsLoading(true);
    try {
      // For now, we'll just get the latest preference (no authentication yet)
      const { data, error } = await supabase
        .from("route_preferences")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error loading preferences:", error);
        return null;
      }

      return data.length > 0 ? data[0] as RoutePreference : null;
    } catch (error) {
      console.error("Failed to load preferences:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (preferences: RoutePreference): Promise<boolean> => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from("route_preferences").insert([preferences]);

      if (error) {
        console.error("Error saving preferences:", error);
        toast.error("Failed to save your preferences");
        return false;
      }

      toast.success("Your preferences have been saved");
      return true;
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to save your preferences");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    loadPreferences,
    savePreferences,
    isLoading,
    isSaving,
  };
};
