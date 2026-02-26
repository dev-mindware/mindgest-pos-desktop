import { Separator } from "@/components/ui";

interface TitleListProps {
  title?: string;
  suTitle?: string;
  separator?: boolean;
  children?: React.ReactNode;
}

export function TitleList({
  title,
  suTitle,
  separator,
  children,
}: TitleListProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        {title && (
          <h2 className="text-2xl text-start md:text-start">{title}</h2>
        )}
        {suTitle && (
          <p className="text-start text-muted-foreground sm:text-start">
            {suTitle}
          </p>
        )}
      </div>
      {separator && <Separator />}
      {children && children}
    </div>
  );
}
