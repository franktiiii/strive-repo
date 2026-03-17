"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Strive branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Strive</h1>
          <p className="text-white/50 text-sm mt-1">
            Always Strive & Prosper
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
