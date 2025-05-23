
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RouteInput from "./RouteInput";
import { ArrowRight, Route, MapPin, DollarSign, Save, RefreshCcw } from "lucide-react";
import { compareRoutes } from "@/utils/routeCalculator";
import RouteCard from "./RouteCard";
import { toast } from "sonner";
import { useRoutePreferences } from "@/hooks/useRoutePreferences";
import FuelTypeSelector from "./FuelTypeSelector";
import CurrencySelector from "./CurrencySelector";

const RouteCalculator = () => {
  const [vehicleType, setVehicleType] = useState<"car" | "motorcycle">("car");
  const [fuelEfficiency, setFuelEfficiency] = useState<string>("8.5");
  const [fuelCost, setFuelCost] = useState<string>("2.91");
  const [tollRouteDistance, setTollRouteDistance] = useState<string>("30");
  const [tollFreeRouteDistance, setTollFreeRouteDistance] = useState<string>("45");
  const [tollCost, setTollCost] = useState<string>("5.00");
  const [currency, setCurrency] = useState<string>("AED");
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  
  const [comparison, setComparison] = useState<{
    tollRouteCost: number;
    tollFreeRouteCost: number;
    difference: number;
    isTollRouteCheaper: boolean;
    savings: number;
  } | null>(null);

  const { loadPreferences, savePreferences, isLoading, isSaving } = useRoutePreferences();

  // Load saved preferences on initial render
  useEffect(() => {
    const fetchPreferences = async () => {
      setLoadingPreferences(true);
      const prefs = await loadPreferences();
      if (prefs) {
        setVehicleType(prefs.vehicle_type);
        setFuelEfficiency(prefs.fuel_efficiency);
        setFuelCost(prefs.fuel_cost);
        setTollRouteDistance(prefs.toll_route_distance);
        setTollFreeRouteDistance(prefs.toll_free_route_distance);
        setTollCost(prefs.toll_cost);
        if (prefs.currency) {
          setCurrency(prefs.currency);
        }
      }
      setLoadingPreferences(false);
    };

    fetchPreferences();
  }, []);

  // Calculate results in real-time as values change
  useEffect(() => {
    calculateComparison();
  }, [fuelEfficiency, fuelCost, tollRouteDistance, tollFreeRouteDistance, tollCost]);

  const calculateComparison = () => {
    // Input validation
    const fields = [
      { name: "Fuel efficiency", value: fuelEfficiency },
      { name: "Fuel cost", value: fuelCost },
      { name: "Toll route distance", value: tollRouteDistance },
      { name: "Toll-free route distance", value: tollFreeRouteDistance },
      { name: "Toll cost", value: tollCost },
    ];

    const emptyFields = fields.filter(field => !field.value || parseFloat(field.value) <= 0);
    
    if (emptyFields.length > 0) {
      // Don't show toast errors during real-time calculation
      // Only set comparison to null if validation fails
      setComparison(null);
      return;
    }
    
    try {
      const result = compareRoutes(
        parseFloat(tollRouteDistance),
        parseFloat(tollFreeRouteDistance),
        parseFloat(fuelEfficiency),
        parseFloat(fuelCost),
        parseFloat(tollCost)
      );
      
      setComparison(result);
    } catch (error) {
      console.error("Calculation error:", error);
      setComparison(null);
    }
  };

  const handleSavePreferences = async () => {
    // Validate all fields before saving
    if (
      !fuelEfficiency || 
      !fuelCost || 
      !tollRouteDistance || 
      !tollFreeRouteDistance || 
      !tollCost
    ) {
      toast.error("Please fill in all fields before saving");
      return;
    }

    const preferences = {
      vehicle_type: vehicleType,
      fuel_efficiency: fuelEfficiency,
      fuel_cost: fuelCost,
      toll_route_distance: tollRouteDistance,
      toll_free_route_distance: tollFreeRouteDistance,
      toll_cost: tollCost,
      currency: currency
    };

    await savePreferences(preferences);
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Route Cost Calculator</CardTitle>
          <CardDescription>Compare toll vs. toll-free routes to find the most cost-effective option</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <CurrencySelector value={currency} onChange={setCurrency} />
          
          <div className="flex justify-between items-center">
            <Tabs defaultValue={vehicleType} onValueChange={(value) => setVehicleType(value as "car" | "motorcycle")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="car">Car</TabsTrigger>
                <TabsTrigger value="motorcycle">Motorcycle</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSavePreferences}
                disabled={isSaving}
              >
                <Save size={16} className="mr-1" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
          
          {loadingPreferences ? (
            <div className="py-4 text-center text-muted-foreground">Loading your preferences...</div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <RouteInput
                  id="fuel-efficiency"
                  label="Fuel Efficiency"
                  value={fuelEfficiency}
                  onChange={setFuelEfficiency}
                  rightAddon="km/L"
                />
                
                <div className="space-y-1">
                  <RouteInput
                    id="fuel-cost"
                    label="Fuel Cost"
                    value={fuelCost}
                    onChange={setFuelCost}
                    leftIcon={<DollarSign size={16} />}
                    rightAddon={currency + "/L"}
                  />
                  <FuelTypeSelector value={fuelCost} onChange={setFuelCost} />
                </div>
              </div>
              
              <RouteInput
                id="toll-route-distance"
                label="Toll Route Distance"
                value={tollRouteDistance}
                onChange={setTollRouteDistance}
                leftIcon={<Route size={16} />}
                rightAddon="km"
              />
              
              <RouteInput
                id="toll-free-route-distance"
                label="Toll-Free Route Distance"
                value={tollFreeRouteDistance}
                onChange={setTollFreeRouteDistance}
                leftIcon={<ArrowRight size={16} />}
                rightAddon="km"
              />
              
              <RouteInput
                id="toll-cost"
                label="Toll Cost (one way)"
                value={tollCost}
                onChange={setTollCost}
                leftIcon={<DollarSign size={16} />}
                rightAddon={currency}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {comparison && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center">Results</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <RouteCard
              title="Toll Route"
              distance={parseFloat(tollRouteDistance)}
              cost={comparison.tollRouteCost}
              isRecommended={comparison.isTollRouteCheaper}
              isTollRoute={true}
              tollCost={parseFloat(tollCost)}
              currency={currency}
            />
            
            <RouteCard
              title="Toll-Free Route"
              distance={parseFloat(tollFreeRouteDistance)}
              cost={comparison.tollFreeRouteCost}
              isRecommended={!comparison.isTollRouteCheaper}
              isTollRoute={false}
              currency={currency}
            />
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">
                <span className="font-medium">You save </span>
                <span className="font-bold text-lg">{currency} {comparison.savings.toFixed(2)}</span>
                <span className="font-medium"> by taking the </span>
                <span className="font-bold">
                  {comparison.isTollRouteCheaper ? "toll route" : "toll-free route"}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RouteCalculator;
