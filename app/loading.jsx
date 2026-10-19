export default function Loading() {
  return (
    <div className="flex flex-col gap-8 py-10 sm:py-14 animate-pulse">
      <div className="flex flex-col gap-3">
        <div className="h-10 w-2/3 rounded-lg bg-permukaan sm:h-12" />
        <div className="h-5 w-1/2 rounded bg-permukaan" />
        <div className="h-4 w-1/3 rounded bg-permukaan" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="h-6 w-36 rounded bg-permukaan" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar"
            >
              <div className="aspect-square w-full bg-permukaan" />
              <div className="flex flex-col gap-2 p-3">
                <div className="h-3 w-1/3 rounded bg-permukaan" />
                <div className="h-5 w-4/5 rounded bg-permukaan" />
                <div className="mt-2 h-6 w-24 rounded bg-permukaan" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
