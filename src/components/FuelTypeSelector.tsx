
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface FuelTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

type FuelType = {
  name: string;
  price: string;
};

const FuelTypeSelector = ({ value, onChange }: FuelTypeSelectorProps) => {
  // Dubai fuel prices as of May 2023 from Gulf News
  // Source: https://gulfnews.com/gold-forex/historical-fuel-rates
  const fuelTypes: FuelType[] = [
    { name: "Special 95", price: "2.91" },
    { name: "Super 98", price: "3.02" },
    { name: "Diesel", price: "3.00" },
  ];

  const handleFuelTypeSelect = (price: string) => {
    onChange(price);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {fuelTypes.map((fuelType) => (
        <Button
          key={fuelType.name}
          type="button"
          variant={value === fuelType.price ? "default" : "outline"}
          size="sm"
          onClick={() => handleFuelTypeSelect(fuelType.price)}
          className="flex-1"
        >
          {fuelType.name}
        </Button>
      ))}
    </div>
  );
};

export default FuelTypeSelector;
