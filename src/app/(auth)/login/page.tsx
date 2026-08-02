import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Your AI recruiter kept working while you were away.</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link href="/signup" className="font-bold text-foreground underline underline-offset-4">
          Sign up
        </Link>
      </p>
    </div>
  );
}
