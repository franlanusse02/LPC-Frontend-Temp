"use client";

import { Trash2 } from "lucide-react";
import { MediosPagoDict } from "@/models/enums/MedioPago";
import { FormField } from "@/components/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PaymentLine {
  medioPago: string;
  monto: string;
}

interface PaymentLineRowProps {
  line: PaymentLine;
  index: number;
  onUpdate: (index: number, field: keyof PaymentLine, value: string) => void;
  onRemove: (index: number) => void;
  selectedLines: string[];
  setSelectedLines: (lines: string[]) => void;
}

export function PaymentLineRow({
  line,
  index,
  onUpdate,
  onRemove,
  selectedLines,
  setSelectedLines,
}: PaymentLineRowProps) {
  const handleUpdate = (
    index: number,
    field: keyof PaymentLine,
    value: string,
  ) => {
    const oldValue = line[field];
    const updatedSelected = selectedLines
      .filter((v) => v !== oldValue)
      .concat(value);

    onUpdate(index, field, value);
    setSelectedLines(updatedSelected);
  };

  const handleRemove = (index: number) => {
    const oldValue = line.medioPago;
    const updatedSelected = selectedLines.filter((v) => v !== oldValue);
    setSelectedLines(updatedSelected);
    onRemove(index);
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end">
      <div className="flex-1">
        <FormField label="Medio de Pago">
          <Select
            value={line.medioPago}
            onValueChange={(value) => handleUpdate(index, "medioPago", value)}
          >
            <SelectTrigger className="w-full bg-card">
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {(() => {
                const availableKeys = Object.keys(MediosPagoDict).filter(
                  (key) =>
                    !selectedLines.includes(
                      MediosPagoDict[key as keyof typeof MediosPagoDict],
                    ) ||
                    MediosPagoDict[key as keyof typeof MediosPagoDict] ===
                      line.medioPago,
                );

                if (availableKeys.length === 0) {
                  return (
                    <SelectItem disabled value="disabled">
                      No hay más medios de pago disponibles
                    </SelectItem>
                  );
                }

                return availableKeys.map((key) => (
                  <SelectItem
                    key={key}
                    value={MediosPagoDict[key as keyof typeof MediosPagoDict]}
                  >
                    {key}
                  </SelectItem>
                ));
              })()}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="flex-1">
        <FormField label="Monto">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={line.monto}
            onChange={(e) => onUpdate(index, "monto", e.target.value)}
            className="bg-card"
            placeholder="0.00"
          />
        </FormField>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => handleRemove(index)}
        aria-label="Eliminar línea"
        className="h-9 w-9 shrink-0 self-start border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground md:self-auto"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
