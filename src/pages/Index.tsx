
import { ScrollArea } from "@/components/ui/scroll-area";
import RouteCalculator from "@/components/RouteCalculator";

const Index = () => {
  return (
    <ScrollArea className="h-screen">
      <div className="container py-6 md:py-10">
        <header className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Route Cost Calculator</h1>
          <p className="text-muted-foreground">Compare toll vs. toll-free routes to save money</p>
        </header>
        
        <RouteCalculator />
        
        <footer className="mt-10 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} RouteCalc - Find your most economical route</p>
        </footer>
      </div>
    </ScrollArea>
  );
};

export default Index;
