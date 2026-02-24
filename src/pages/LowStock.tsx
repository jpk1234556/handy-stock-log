import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";

const LowStock = () => {
  const { data: items = [] } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("items").select("*, categories(name)").order("quantity");
      if (error) throw error;
      return data;
    },
  });

  const lowStock = items.filter((i) => i.quantity <= i.min_stock_level);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />
        <h1 className="text-2xl font-bold tracking-tight">Low Stock Items</h1>
        <Badge variant="outline" className="ml-2">{lowStock.length}</Badge>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Min Level</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStock.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">All items are sufficiently stocked! 🎉</TableCell></TableRow>
            ) : (
              lowStock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.sku || "—"}</TableCell>
                  <TableCell>{(item.categories as any)?.name || "—"}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.min_stock_level}</TableCell>
                  <TableCell>
                    <Badge variant={item.quantity === 0 ? "destructive" : "outline"} className={item.quantity > 0 ? "border-[hsl(var(--warning))] text-[hsl(var(--warning))]" : ""}>
                      {item.quantity === 0 ? "Out of Stock" : "Low Stock"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LowStock;
