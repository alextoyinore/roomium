import Link from 'next/link';
import { Video } from 'lucide-react'; // Using Video icon as a generic media icon

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };
  return (
    <Link href="/dashboard" className="flex items-center gap-2 group">
      <Video className={`text-primary group-hover:text-accent transition-colors duration-200 ${size === "lg" ? "h-8 w-8" : "h-6 w-6"}`} />
      <span className={`font-headline font-semibold text-foreground group-hover:text-accent transition-colors duration-200 ${sizeClasses[size]}`}>
        Roomium
      </span>
    </Link>
  );
}
