
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface RouteInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
  step?: string;
  leftIcon?: React.ReactNode;
  rightAddon?: string;
  className?: string;
}

const RouteInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "number", 
  min = "0", 
  step = "0.1",
  leftIcon,
  rightAddon,
  className
}: RouteInputProps) => {
  return (
    <div className={cn("space-y-1", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            leftIcon && "pl-10",
            rightAddon && "pr-16"
          )}
        />
        {rightAddon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
            {rightAddon}
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteInput;
