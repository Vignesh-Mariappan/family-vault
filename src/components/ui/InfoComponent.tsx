import { Info } from "lucide-react";
import { Card, CardContent } from "./card";

interface InfoComponentProps {
    title?: string;
    description?: string;
  }
  
  export const InfoComponent: React.FC<InfoComponentProps> = ({
    title = 'No Items Found',
    description = 'There are no items to display at the moment.',
  }) => {
    return (
      <Card className="w-full max-w-sm text-center bg-transparent p-6 flex flex-col items-center justify-center">
        <CardContent className="flex flex-col items-center gap-4">
          <Info className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    );
  };