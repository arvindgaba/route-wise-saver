
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RouteInput from "./RouteInput";
import { ArrowRight, Route, MapPin, DollarSign } from "lucide-react";
import { compareRoutes } from "@/utils/routeCalculator";
import RouteCard from "./RouteCard";
import { toast } from "sonner";

const RouteCalculator = () => {
  const [vehicleType, setVehicleType] = useState<"car" | "motorcycle">("car");
  const [fuelEfficiency, setFuelEfficiency] = useState<string>("10");
  const [fuelCost, setFuelCost] = useState<string>("1.50");
  const [tollRouteDistance, setTollRouteDistance] = useState<string>("30");
  const [tollFreeRouteDistance, setTollFreeRouteDistance] = useState<string>("45");
  const [tollCost, setTollCost] = useState<string>("5.00");
  
  const [comparison, setComparison] = useState<{
    tollRouteCost: number;
    tollFreeRouteCost: number;
    difference: number;
    isTollRouteCheaper: boolean;
    savings: number;
  } | null>(null);

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
      toast.error(`Please enter valid values for: ${emptyFields.map(f => f.name).join(", ")}`);
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
      
      toast.success("Route comparison calculated successfully!");
    } catch (error) {
      console.error("Calculation error:", error);
      toast.error("Error calculating routes. Please check your inputs.");
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Route Cost Calculator</CardTitle>
          <CardDescription>Compare toll vs. toll-free routes to find the most cost-effective option</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs defaultValue="car" onValueChange={(value) => setVehicleType(value as "car" | "motorcycle")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="car">Car</TabsTrigger>
              <TabsTrigger value="motorcycle">Motorcycle</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <RouteInput
                id="fuel-efficiency"
                label="Fuel Efficiency"
                value={fuelEfficiency}
                onChange={setFuelEfficiency}
                rightAddon="km/L"
              />
              
              <RouteInput
                id="fuel-cost"
                label="Fuel Cost"
                value={fuelCost}
                onChange={setFuelCost}
                leftIcon={<DollarSign size={16} />}
                rightAddon="per L"
              />
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
            />
            
            <Button 
              onClick={calculateComparison} 
              className="w-full mt-2"
              size="lg"
            >
              Calculate Best Route
            </Button>
          </div>
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
            />
            
            <RouteCard
              title="Toll-Free Route"
              distance={parseFloat(tollFreeRouteDistance)}
              cost={comparison.tollFreeRouteCost}
              isRecommended={!comparison.isTollRouteCheaper}
              isTollRoute={false}
            />
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">
                <span className="font-medium">You save </span>
                <span className="font-bold text-lg">${comparison.savings.toFixed(2)}</span>
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
