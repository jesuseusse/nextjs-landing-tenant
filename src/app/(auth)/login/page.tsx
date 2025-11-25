import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-muted px-6 py-12">
      <AuthForm mode="login" />
    </div>
  );
}
