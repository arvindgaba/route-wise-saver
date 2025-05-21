
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Route, MapPin, CurrencyDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteCardProps {
  title: string;
  distance: number;
  cost: number;
  isRecommended?: boolean;
  isTollRoute?: boolean;
  tollCost?: number;
  className?: string;
}

const RouteCard = ({
  title,
  distance,
  cost,
  isRecommended = false,
  isTollRoute = false,
  tollCost = 0,
  className,
}: RouteCardProps) => {
  const routeColor = isTollRoute ? "route-toll" : "route-free";
  const lightRouteColor = isTollRoute ? "route-toll-light" : "route-free-light";
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      isRecommended && "ring-2 ring-offset-2",
      isRecommended && isTollRoute ? "ring-route-toll" : "ring-route-free",
      className
    )}>
      <div className={cn(
        "h-2 w-full bg-gradient-to-r",
        isTollRoute ? "from-route-toll to-route-toll-light" : "from-route-free to-route-free-light"
      )} />
      
      <CardHeader className={cn(
        "flex flex-row items-center justify-between py-4",
        isRecommended && isTollRoute ? "bg-route-toll-light" : "bg-route-free-light"
      )}>
        <CardTitle className="text-lg flex items-center gap-2">
          {isTollRoute ? (
            <Route size={20} />
          ) : (
            <ArrowRight size={20} />
          )}
          {title}
        </CardTitle>
        {isRecommended && (
          <span className="bg-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
            Recommended
          </span>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>Distance</span>
          </div>
          <span className="font-medium">{distance} km</span>
        </div>
        
        {isTollRoute && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <CurrencyDollarSign size={16} />
              <span>Toll Cost</span>
            </div>
            <span className="font-medium">${tollCost.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-base pt-2 border-t">
          <div className="flex items-center gap-2">
            <CurrencyDollarSign size={18} />
            <span className="font-medium">Total Cost</span>
          </div>
          <span className="font-bold text-lg">${cost.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteCard;
