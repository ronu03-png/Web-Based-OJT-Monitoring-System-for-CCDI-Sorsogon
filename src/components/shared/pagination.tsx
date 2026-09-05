import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}

export function Pagination({ page, totalPages, basePath, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const createHref = (targetPage: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    if (targetPage > 1) {
      params.set("page", String(targetPage));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" disabled={!hasPrev}>
          <Link href={createHref(page - 1)} aria-disabled={!hasPrev}>
            <ChevronLeft className="size-4" />
            Previous
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" disabled={!hasNext}>
          <Link href={createHref(page + 1)} aria-disabled={!hasNext}>
            Next
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
