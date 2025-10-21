import { Loader2 } from "lucide-react";

export function Spinner({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner className="h-16 w-16" />
    </div>
  );
}
