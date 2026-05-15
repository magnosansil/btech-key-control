import { RoomStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function RoomStatusBadge({
  status,
  holderName,
}: {
  status: RoomStatus;
  holderName?: string | null;
}) {
  const livre = status === "LIVRE";
  return (
    <div className="flex flex-col gap-1">
      <Badge
        className={cn(
          "w-fit text-base px-3 py-1",
          livre
            ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-100"
            : "bg-amber-100 text-amber-900 hover:bg-amber-100",
        )}
      >
        {livre ? "Livre" : "Ocupada"}
      </Badge>
      {!livre && holderName && (
        <p className="text-sm text-muted-foreground">
          Com: <span className="font-medium text-foreground">{holderName}</span>
        </p>
      )}
    </div>
  );
}
