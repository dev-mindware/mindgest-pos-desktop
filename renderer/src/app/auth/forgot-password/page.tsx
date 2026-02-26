import { HeroImageSide, RecoveryPassword } from "@/components";

export default function ForgotPassPage() {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      <div className="hidden lg:block">
        <HeroImageSide source="/ForgotPassword.svg" />
      </div>

      <div className="flex items-center justify-center bg-background p-6 md:p-10">
        <div className="w-full max-w-sm">
          <RecoveryPassword />
        </div>
      </div>
    </div>
  );
}
