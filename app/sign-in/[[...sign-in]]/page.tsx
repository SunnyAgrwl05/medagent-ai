import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-teal-500/20 blur-[120px]" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-[120px]" />
      <SignIn
        appearance={{
          elements: {
            card: "shadow-2xl rounded-2xl border border-border/60",
          },
        }}
      />
    </main>
  );
}
