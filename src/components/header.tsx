import Link from 'next/link';
import { PlusCircle, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span className={cn('text-xl font-bold font-headline')}>
            CaterEase
          </span>
        </Link>
        <div className="ml-auto">
          <Button asChild variant="ghost" size="icon">
            <Link href="/add-provider">
              <PlusCircle className="h-6 w-6" />
              <span className="sr-only">Add Provider</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
