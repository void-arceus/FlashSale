import { DollarSign, ShoppingBag, Package, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
    // Mock data for now—easy to replace with API data later!
    const stats = [
        {
            title: "Total Revenue",
            value: "$45,231.89",
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
        },
        {
            title: "Total Orders",
            value: "1,240",
            icon: ShoppingBag,
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            title: "Total Products",
            value: "248",
            icon: Package,
            color: "text-purple-500",
            bg: "bg-purple-50",
        },
        {
            title: "Low Stock Alert",
            value: "12",
            icon: AlertTriangle,
            color: "text-amber-500",
            bg: "bg-amber-50",
        },
    ];

    return (
        <main className="w-full flex items-center justify-center">
            <div className="w-full max-w-6xl px-4 pt-16 space-y-4">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here is an overview of your store's
                        performance.
                    </p>
                </header>

                {/* 4-Column Grid for Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </span>
                                    <div
                                        className={`p-2 rounded-lg ${stat.bg}`}
                                    >
                                        <Icon
                                            className={`h-5 w-5 ${stat.color}`}
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <span className="text-2xl font-bold tracking-tight">
                                        {stat.value}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
