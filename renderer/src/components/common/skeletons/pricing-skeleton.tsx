import { Card, CardContent, CardHeader, CardFooter } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";

export function PricingSkeleton() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-[600px] mx-auto" />
        </div>

        {/* Plans Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2].map((index) => {
            const isPopular = index === 1;

            return (
              <Card
                key={index}
                className={`relative border-border rounded-lg shadow-lg ${
                  isPopular
                    ? "border-2 border-primary-500 bg-primary-300/5 shadow-2xl scale-105"
                    : "border border-border bg-card"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Skeleton className="h-7 w-32 rounded-full" />
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  {/* Plan name */}
                  <Skeleton className="h-7 w-32 mx-auto mb-4" />

                  {/* Price */}
                  <Skeleton className="h-12 w-40 mx-auto mb-2" />
                </CardHeader>

                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Skeleton className="h-5 w-5 rounded-sm mt-0.5 flex-shrink-0" />
                        <Skeleton
                          className="h-4 flex-1"
                          style={{ width: `${Math.random() * 30 + 60}%` }}
                        />
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-6">
                  <Skeleton className="h-10 w-full rounded-md" />
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Additional Information Skeleton */}
        <div className="mt-16 text-center">
          <Skeleton className="h-8 w-80 mx-auto mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex flex-col items-center">
                <Skeleton className="h-16 w-16 rounded-full mb-3" />
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-52" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
