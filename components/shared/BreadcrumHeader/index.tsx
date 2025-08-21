import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AccountHeaderProps {
  title: string;
  breadcrumbs?: Array<{
    label: string;
    href: string;
  }>;
  className?: string;
  headTitle?: boolean;
}

export function BreadcrumHeader({
  title,
  breadcrumbs = [],
  className = "",
  headTitle = true,
}: AccountHeaderProps) {
  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Breadcrumb navigation */}
      {breadcrumbs.length > 0 && (
        <nav className="flex flex-wrap items-center text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center">
              {index > 0 && <ChevronLeft className="mx-2 h-4 w-4" />}
              <Link
                href={crumb.href}
                className="hover:text-foreground transition-colors text-18 whitespace-nowrap"
              >
                {crumb.label}
              </Link>
              {index === breadcrumbs.length - 1 && (
                <>
                  <ChevronLeft className="mx-2 h-4 w-4" />
                  <span className="whitespace-nowrap text-foreground text-20">
                    {title}
                  </span>
                </>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Main heading */}
      {headTitle && (
        <h1 className="font-bold tracking-tight text-44 mt-4">{title}</h1>
      )}
    </div>
  );
}
