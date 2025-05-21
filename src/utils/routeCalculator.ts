
/**
 * Calculate the total cost for a toll route
 */
export function calculateTollRouteCost(
  distance: number,
  fuelEfficiency: number,
  fuelCost: number,
  tollCost: number
): number {
  // Calculate fuel cost for the route
  const fuelAmount = distance / fuelEfficiency;
  const fuelCostTotal = fuelAmount * fuelCost;
  
  // Add toll cost
  return fuelCostTotal + tollCost;
}

/**
 * Calculate the total cost for a toll-free route
 */
export function calculateTollFreeRouteCost(
  distance: number,
  fuelEfficiency: number,
  fuelCost: number
): number {
  // Calculate fuel cost for the route
  const fuelAmount = distance / fuelEfficiency;
  return fuelAmount * fuelCost;
}

/**
 * Compare routes and determine which is cheaper
 */
export function compareRoutes(
  tollRouteDistance: number,
  tollFreeRouteDistance: number,
  fuelEfficiency: number,
  fuelCost: number,
  tollCost: number
) {
  const tollRouteCost = calculateTollRouteCost(
    tollRouteDistance,
    fuelEfficiency,
    fuelCost,
    tollCost
  );
  
  const tollFreeRouteCost = calculateTollFreeRouteCost(
    tollFreeRouteDistance,
    fuelEfficiency,
    fuelCost
  );
  
  const difference = Math.abs(tollRouteCost - tollFreeRouteCost);
  
  return {
    tollRouteCost,
    tollFreeRouteCost,
    difference,
    isTollRouteCheaper: tollRouteCost < tollFreeRouteCost,
    savings: difference
  };
}
