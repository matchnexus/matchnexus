type StatsCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

export function StatsCard({ label, value, hint }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}