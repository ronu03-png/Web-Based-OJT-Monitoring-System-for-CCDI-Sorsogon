import Image from "next/image";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="grid min-h-screen w-full bg-background lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm">
            <Image
              src="/assets/ccdi-logo.png"
              alt="CCDI Sorsogon logo"
              width={40}
              height={40}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-sm leading-tight font-semibold">CCDI Sorsogon</p>
            <p className="text-xs text-sidebar-foreground/70">OJT Monitoring System</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <h1 className="text-3xl leading-tight font-semibold">
            Monitor. Track. Evaluate. Complete.
          </h1>
          <p className="text-sidebar-foreground/70">
            One centralized platform for students, advisers, company supervisors,
            coordinators, and administrators to manage the entire On-the-Job
            Training program from application to completion.
          </p>
        </div>

        <p className="relative z-10 text-xs text-sidebar-foreground/50">
          © {year} Computer Communication Development Institute &ndash; Sorsogon
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
