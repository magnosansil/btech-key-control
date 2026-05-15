"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { createReservationAction } from "@/actions/reservations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROOM_TYPE_LABELS } from "@/lib/constants";

type RoomOption = {
  id: string;
  number: string;
  name: string;
  type: keyof typeof ROOM_TYPE_LABELS;
  status: string;
};

export function ReservationForm({ rooms }: { rooms: RoomOption[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [roomId, setRoomId] = useState("");
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <form
      className="flex flex-col gap-5"
      action={(fd) =>
        start(async () => {
          if (!roomId) {
            toast.error("Selecione uma sala.");
            return;
          }
          fd.set("roomId", roomId);
          const res = await createReservationAction(fd);
          if (res?.error) {
            toast.error(res.error);
            return;
          }
          toast.success("Reserva confirmada! Retire na guarita no horário.");
          setRoomId("");
          router.refresh();
          router.push("/painel");
        })
      }
    >
      <input type="hidden" name="roomId" value={roomId} />

      <div className="space-y-2">
        <Label>Sala / laboratório</Label>
        <Select
          value={roomId}
          onValueChange={(v) => setRoomId(v ?? "")}
          required
        >
          <SelectTrigger className="min-h-12 w-full text-base">
            <SelectValue placeholder="Selecione a sala" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((r) => (
              <SelectItem key={r.id} value={r.id} className="text-base py-3">
                {r.number} — {r.name} ({ROOM_TYPE_LABELS[r.type]})
                {r.status === "OCUPADA" ? " · em uso agora" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          name="date"
          type="date"
          required
          min={today}
          defaultValue={today}
          className="min-h-12 text-base"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="startTime">Início</Label>
          <Input
            id="startTime"
            name="startTime"
            type="time"
            required
            defaultValue="08:00"
            className="min-h-12 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">Término</Label>
          <Input
            id="endTime"
            name="endTime"
            type="time"
            required
            defaultValue="10:00"
            className="min-h-12 text-base"
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="min-h-14 w-full text-lg font-semibold bg-emerald-700 hover:bg-emerald-800"
      >
        {pending ? "Reservando…" : "Confirmar reserva"}
      </Button>
    </form>
  );
}
