import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/components/ui";

const colors = [
  {
    bgColor: "bg-blue-50",
    pulseColor: "bg-blue-100",
    title: "Total Levantado",
  },
  {
    bgColor: "bg-primary-50",
    pulseColor: "bg-primary-100",
    title: "Comissões Totais",
  },
  {
    bgColor: "bg-amber-50",
    pulseColor: "bg-amber-100",
    title: "Venda Total",
  },
  {
    bgColor: "bg-green-50",
    pulseColor: "bg-green-100",
    title: "Referidos Activos",
  },
];

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {colors.map((color, index) => (
        <Card
          key={index}
          className="overflow-hidden border-0 shadow-md transition-all duration-300 relative"
        >
          <div className={`h-1 w-full ${color.bgColor}`}></div>
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">
              {color.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${color.bgColor}`}>
              <Skeleton
                className={`h-5 w-5 rounded-full ${color.pulseColor}`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-9 w-28 mb-2 bg-gray-300" />
            <Skeleton className="h-4 w-40 bg-gray-200" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}