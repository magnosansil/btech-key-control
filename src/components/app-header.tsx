import Link from "next/link";
import { KeyRound } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { FontSizeToggle } from "@/components/font-size-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import type { SessionUser } from "@/lib/session";

export function AppHeader({
  user,
  title,
}: {
  user?: SessionUser | null;
  title?: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
            <KeyRound className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight">{APP_NAME}</p>
            {title && (
              <p className="truncate text-sm text-muted-foreground">{title}</p>
            )}
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <FontSizeToggle />
          {user ? (
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="lg" className="min-h-11">
                Sair
              </Button>
            </form>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "min-h-11")}
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
