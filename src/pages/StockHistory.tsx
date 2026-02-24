import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History } from "lucide-react";

const StockHistory = () => {
  const { data: history = [] } = useQuery({
    queryKey: ["all-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_history")
        .select("*, items(name), profiles(full_name, email)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Stock History</h1>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">New Qty</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No stock changes recorded yet.</TableCell></TableRow>
            ) : (
              history.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="text-muted-foreground">{new Date(h.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{(h.items as any)?.name || "Deleted"}</TableCell>
                  <TableCell className="text-muted-foreground">{(h.profiles as any)?.full_name || (h.profiles as any)?.email || "Unknown"}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={h.quantity_change > 0 ? "default" : "destructive"}>
                      {h.quantity_change > 0 ? "+" : ""}{h.quantity_change}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{h.new_quantity}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{h.notes || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockHistory;
