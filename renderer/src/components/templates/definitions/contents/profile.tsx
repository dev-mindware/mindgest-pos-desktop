"use client";
import { Separator } from "@/components";
import { useAuth } from "@/hooks/auth";
import { PhotoUpload } from "@/components/common/photo-upload";
import { useForm } from "react-hook-form";
import type { File as MyFile } from "@/types";
import { ProfileAvatar } from "./profile/profile-avatar";
import { ProfileForm } from "./profile/profile-form";
import { AccountSecurity } from "./profile/account-security";
import { SupportAccess } from "./profile/support-access";
import { useFileUpload } from "@/hooks/common/use-upload";
import { useEffect } from "react";
import { toast } from "sonner";

interface ProfileFormData {
  companyLogo?: MyFile;
}

export function Profile() {
  const { user } = useAuth();
  const { control, watch } = useForm<ProfileFormData>();

  const { mutate: uploadLogo, isPending: isUploading } = useFileUpload(
    `/companies/${user?.company?.id}/logo`,
    "companies",
    "PUT",
  );

  const companyLogo = watch("companyLogo");

  useEffect(() => {
    if (companyLogo && companyLogo.url) {
      uploadLogo(
        {
          files: { file: companyLogo },
        },
        {
          onSuccess: () =>
            toast.success("Logo da empresa atualizada com sucesso!"),
          onError: (error: any) =>
            toast.error(
              error?.response?.data?.message ||
                "Erro ao atualizar logo da empresa",
            ),
        },
      );
    }
  }, [companyLogo, uploadLogo]);

  const getRoleLabel = (role?: string) => {
    const roleMap: Record<string, string> = {
      OWNER: "Proprietário",
      MANAGER: "Gerente",
      ADMIN: "Administrador",
      CASHIER: "Caixa",
    };
    return roleMap[role || ""] || role;
  };

  return (
    <div className="space-y-6" suppressHydrationWarning>
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie suas informações pessoais e da empresa.
          </p>
        </div>
        {user?.role && (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
            {getRoleLabel(user.role)}
          </span>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4 space-y-6">
          <div className="bg-card rounded-xl border p-6 shadow-sm flex flex-col items-center text-center">
            <h3 className="font-semibold mb-6 w-full text-left">
              Foto de Perfil
            </h3>
            <ProfileAvatar
              currentImage={user?.company?.logo || undefined}
              userName={user?.name}
            />
          </div>

          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Logo da Empresa</h3>
            <div className="flex flex-col items-center">
              {!user?.company?.logo ? (
                <PhotoUpload
                  label="Carregar Logo"
                  name="companyLogo"
                  control={control}
                  accept="image"
                  maxSize={1024 * 1024 * 2}
                  className="w-full"
                  disabled={isUploading}
                />
              ) : (
                <div className="relative group w-full aspect-video bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed overflow-hidden">
                  <img
                    src={user.company.logo}
                    alt="Logo da empresa"
                    className="max-h-full max-w-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PhotoUpload
                      label="Alterar"
                      name="companyLogo"
                      control={control}
                      accept="image"
                      maxSize={1024 * 1024 * 2}
                      className="w-auto"
                      disabled={isUploading}
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Exibido em documentos e faturas.
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 space-y-6">
          <ProfileForm user={user} />
          <AccountSecurity user={user} />
          <SupportAccess />
        </div>
      </div>
    </div>
  );
}

/* "use client";

import { Separator } from "@/components";
import { useAuth } from "@/hooks/auth";
import { PhotoUpload } from "@/components/common/photo-upload";
import { useForm, Controller } from "react-hook-form";
import type { File as MyFile } from "@/types";
import { ProfileAvatar } from "./profile/profile-avatar";
import { ProfileForm } from "./profile/profile-form";
import { AccountSecurity } from "./profile/account-security";
import { SupportAccess } from "./profile/support-access";
import { useFileUpload } from "@/hooks/common/use-upload";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileFormData {
  companyLogo?: MyFile;
}

export function Profile() {
  const { user } = useAuth();
  const { control, watch, setValue } = useForm<ProfileFormData>();
  const [selectedFile, setSelectedFile] = useState<MyFile | null>(null);

  const { mutate: uploadLogo, isPending: isUploading } = useFileUpload(
    `/companies/${user?.company?.id}/logo`,
    "companies",
    "PUT"
  );

  const companyLogo = watch("companyLogo");

  const handleUpload = () => {
    if (!selectedFile) return toast.error("Selecione um arquivo antes de atualizar.");

    uploadLogo(
      { files: { file: selectedFile } },
      {
        onSuccess: () => {
          toast.success("Logo da empresa atualizada com sucesso!");
          setSelectedFile(null);
          setValue("companyLogo", undefined);
        },
        onError: (error: any) =>
          toast.error(error?.response?.data?.message || "Erro ao atualizar logo da empresa"),
      }
    );
  };

  const getRoleLabel = (role?: string) => {
    const roleMap: Record<string, string> = {
      OWNER: "Proprietário",
      MANAGER: "Gerente",
      ADMIN: "Administrador",
      CASHIER: "Caixa",
    };
    return roleMap[role || ""] || role;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl text-center md:text-start">Meu Perfil</h2>
          <p className="text-center text-muted-foreground md:text-start">
            Personalize o seu perfil MindGest quando quiser.
          </p>
        </div>
        {user?.role && <span className="font-medium text-primary">{getRoleLabel(user.role)}</span>}
      </div>

      <div className="flex flex-col justify-between items-center w-full gap-4 md:flex-row">
        <ProfileAvatar currentImage={user?.company?.logo || undefined} userName={user?.name} />

        {!user?.company?.logo ? (
          <div className="flex flex-col items-center gap-2">
            <Controller
              name="companyLogo"
              control={control}
              render={({ field }) => (
                <PhotoUpload
                  label="Logo da Empresa"
                  {...field}
                  accept="image"
                  maxSize={1024 * 1024 * 2}
                  className="max-w-xs"
                  onChange={(file) => {
                    field.onChange(file);
                    setSelectedFile(file || null);
                  }}
                  disabled={isUploading}
                />
              )}
            />
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="mt-2 rounded bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isUploading ? "Enviando..." : "Atualizar Imagem"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <img
              src={user.company.logo}
              alt="Logo da empresa"
              className="max-w-xs rounded-md border border-muted"
            />
            <Controller
              name="companyLogo"
              control={control}
              render={({ field }) => (
                <PhotoUpload
                  label="Trocar Logo"
                  {...field}
                  accept="image"
                  maxSize={1024 * 1024 * 2}
                  className="max-w-xs"
                  onChange={(file) => {
                    field.onChange(file);
                    setSelectedFile(file || null);
                  }}
                  disabled={isUploading}
                />
              )}
            />
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="mt-2 rounded bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isUploading ? "Enviando..." : "Atualizar Imagem"}
            </button>
          </div>
        )}
      </div>

      <ProfileForm user={user} />
      <AccountSecurity user={user} />
      <SupportAccess />
    </div>
  );
}

 */
