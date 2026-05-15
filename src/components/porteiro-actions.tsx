"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deliverKeyAction, receiveKeyAction } from "@/actions/keys";
import { Button } from "@/components/ui/button";

export function DeliverKeyButton({
  reservationId,
  onDone,
}: {
  reservationId: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <Button
      size="lg"
      disabled={pending}
      className="mt-3 h-14 w-full text-lg font-semibold bg-emerald-700 hover:bg-emerald-800"
      onClick={() =>
        start(async () => {
          const res = await deliverKeyAction(reservationId);
          if (res?.error) {
            toast.error(res.error);
            return;
          }
          toast.success("Chave entregue!");
          onDone?.();
          router.refresh();
        })
      }
    >
      {pending ? "Entregando…" : "Entregar chave"}
    </Button>
  );
}

export function ReceiveKeyButton({
  roomId,
  onDone,
}: {
  roomId: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <Button
      size="lg"
      disabled={pending}
      className="mt-3 h-14 w-full text-lg font-semibold bg-emerald-700 hover:bg-emerald-800"
      onClick={() =>
        start(async () => {
          const res = await receiveKeyAction(roomId);
          if (res?.error) {
            toast.error(res.error);
            return;
          }
          toast.success("Chave recebida!");
          onDone?.();
          router.refresh();
        })
      }
    >
      {pending ? "Recebendo…" : "Receber chave"}
    </Button>
  );
}
