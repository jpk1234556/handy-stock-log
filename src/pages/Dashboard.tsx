import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BoxIcon, AlertTriangle, TrendingDown, Plus, Package } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { data: items = [] } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("items").select("*, categories(name)");
      if (error) throw error;
      return data;
    },
  });

  const { data: recentHistory = [] } = useQuery({
    queryKey: ["recent-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_history")
        .select("*, items(name)")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const lowStockItems = items.filter((i) => i.quantity <= i.min_stock_level && i.quantity > 0);
  const outOfStockItems = items.filter((i) => i.quantity === 0);

  const stats = [
    { label: "Total Products", value: totalItems, icon: BoxIcon, color: "text-primary" },
    { label: "Total Units", value: totalQuantity, icon: Package, color: "text-primary" },
    { label: "Low Stock", value: lowStockItems.length, icon: AlertTriangle, color: "text-[hsl(var(--warning))]" },
    { label: "Out of Stock", value: outOfStockItems.length, icon: TrendingDown, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your inventory</p>
        </div>
        <Link to="/inventory">
          <Button><Plus className="mr-2 h-4 w-4" />Add Item</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />
              Items Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.sku}</p>
                  </div>
                  <Badge variant="outline" className="border-[hsl(var(--warning))] text-[hsl(var(--warning))]">
                    {item.quantity} / {item.min_stock_level} min
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentHistory.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{(h.items as any)?.name}</p>
                    <p className="text-sm text-muted-foreground">{h.notes || "Stock adjusted"}</p>
                  </div>
                  <Badge variant={h.quantity_change > 0 ? "default" : "destructive"}>
                    {h.quantity_change > 0 ? "+" : ""}{h.quantity_change}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
