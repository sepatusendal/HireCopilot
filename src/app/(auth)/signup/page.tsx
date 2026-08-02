import Link from "next/link";
import { SignupForm } from "@/features/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">Let&apos;s build your AI career profile.</p>
      </div>
      <SignupForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
