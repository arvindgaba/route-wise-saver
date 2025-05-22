
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
  currency?: string;
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

      if (data.length > 0) {
        // Convert numeric database values to strings for the UI
        return {
          id: data[0].id,
          vehicle_type: data[0].vehicle_type as "car" | "motorcycle",
          fuel_efficiency: data[0].fuel_efficiency.toString(),
          fuel_cost: data[0].fuel_cost.toString(),
          toll_route_distance: data[0].toll_route_distance.toString(),
          toll_free_route_distance: data[0].toll_free_route_distance.toString(),
          toll_cost: data[0].toll_cost.toString(),
          currency: data[0].currency || "AED"
        };
      }
      return null;
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
      // Convert string values to numeric for database storage
      const dbPreferences = {
        vehicle_type: preferences.vehicle_type,
        fuel_efficiency: parseFloat(preferences.fuel_efficiency),
        fuel_cost: parseFloat(preferences.fuel_cost),
        toll_route_distance: parseFloat(preferences.toll_route_distance),
        toll_free_route_distance: parseFloat(preferences.toll_free_route_distance),
        toll_cost: parseFloat(preferences.toll_cost),
        currency: preferences.currency || "AED"
      };

      const { error } = await supabase.from("route_preferences").insert([dbPreferences]);

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
