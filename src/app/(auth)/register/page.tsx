import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-muted px-6 py-12">
      <AuthForm mode="register" />
    </div>
  );
}
