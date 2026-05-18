import { Badge } from "@/components/ui/badge";

type PageHeaderProps = {
  title: string;
  description: string;
  badge?: string;
  children?: React.ReactNode;
};

export function PageHeader({
  title,
  description,
  badge,
  children
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {badge ? (
          <Badge variant="secondary" className="mb-3">
            {badge}
          </Badge>
        ) : null}
        <h1 className="text-2xl font-bold tracking-normal md:text-3xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">
          {description}
        </p>
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}
