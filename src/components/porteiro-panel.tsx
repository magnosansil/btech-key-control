"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DeliverKeyButton,
  ReceiveKeyButton,
} from "@/components/porteiro-actions";
import { SearchableList, type ListItem } from "@/components/searchable-list";

export function PorteiroPanel({
  toDeliver,
  toReceive,
}: {
  toDeliver: ListItem[];
  toReceive: ListItem[];
}) {
  const [deliverId, setDeliverId] = useState<string>();
  const [receiveId, setReceiveId] = useState<string>();

  return (
    <Tabs defaultValue="entregar" className="w-full">
      <TabsList className="grid h-14 w-full grid-cols-2">
        <TabsTrigger value="entregar" className="text-base font-semibold">
          Entregar ({toDeliver.length})
        </TabsTrigger>
        <TabsTrigger value="receber" className="text-base font-semibold">
          Receber ({toReceive.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="entregar" className="mt-6">
        <SearchableList
          items={toDeliver}
          placeholder="Buscar reserva…"
          emptyMessage="Nenhuma chave para entregar agora."
          selectedId={deliverId}
          onSelect={setDeliverId}
          renderAction={(id) => (
            <DeliverKeyButton
              reservationId={id}
              onDone={() => setDeliverId(undefined)}
            />
          )}
        />
      </TabsContent>

      <TabsContent value="receber" className="mt-6">
        <SearchableList
          items={toReceive}
          placeholder="Buscar quem está com a chave…"
          emptyMessage="Nenhuma chave em uso no momento."
          selectedId={receiveId}
          onSelect={setReceiveId}
          renderAction={(id) => (
            <ReceiveKeyButton roomId={id} onDone={() => setReceiveId(undefined)} />
          )}
        />
      </TabsContent>
    </Tabs>
  );
}
