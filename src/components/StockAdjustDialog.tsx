import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Props {
  item: { id: string; name: string; quantity: number };
  onClose: () => void;
}

const StockAdjustDialog = ({ item, onClose }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [change, setChange] = useState(0);
  const [notes, setNotes] = useState("");

  const { data: history = [] } = useQuery({
    queryKey: ["stock-history", item.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_history")
        .select("*, profiles(full_name, email)")
        .eq("item_id", item.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (change === 0) throw new Error("Quantity change cannot be zero");
      const newQty = item.quantity + change;
      if (newQty < 0) throw new Error("Quantity cannot go below zero");

      const { error: histError } = await supabase.from("stock_history").insert({
        item_id: item.id,
        user_id: user!.id,
        quantity_change: change,
        previous_quantity: item.quantity,
        new_quantity: newQty,
        notes: notes || null,
      });
      if (histError) throw histError;

      const { error: itemError } = await supabase.from("items").update({ quantity: newQty }).eq("id", item.id);
      if (itemError) throw itemError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["stock-history", item.id] });
      queryClient.invalidateQueries({ queryKey: ["recent-history"] });
      setChange(0);
      setNotes("");
      toast({ title: "Stock updated" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Adjust Stock — {item.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Current quantity: <span className="font-bold text-foreground">{item.quantity}</span></p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Change (+/-)</Label>
              <Input type="number" value={change} onChange={(e) => setChange(parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>New Quantity</Label>
              <Input disabled value={Math.max(0, item.quantity + change)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Received shipment" rows={2} />
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || change === 0} className="w-full">
            {mutation.isPending ? "Saving..." : "Update Stock"}
          </Button>

          {history.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">History</h4>
              <div className="max-h-48 space-y-2 overflow-auto">
                {history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between rounded border p-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">{h.notes || "Adjusted"}</p>
                      <p className="text-xs text-muted-foreground">
                        {(h.profiles as any)?.full_name || (h.profiles as any)?.email || "Unknown"} · {new Date(h.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={h.quantity_change > 0 ? "default" : "destructive"}>
                      {h.quantity_change > 0 ? "+" : ""}{h.quantity_change}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StockAdjustDialog;
