"use client";
import { RegisterFormData } from "@/schemas";
import { useFormContext, Controller } from "react-hook-form";
import { Label, Checkbox } from "@/components/ui";
import { AlertError } from "@/components/common";
import { StepsHeader } from "./steps-header";

export function ThirdStep() {
  const { control } = useFormContext<RegisterFormData>();

  return (
    <div className="max-w-2xl p-2 mx-auto space-y-8">
      <div className="flex flex-col items-center mt-4 gap-2 text-center">
        <StepsHeader title="Termos e Políticas" />
      </div>
      <div className="space-y-6">
        <p>Isso inclui, mas não se limita a:</p>

        <ul className="space-y-4 text-muted-foreground">
          <BulletItem>
            A utilização responsável da plataforma, de acordo com as leis
            vigentes;
          </BulletItem>
          <BulletItem>
            O armazenamento e tratamento dos seus dados pessoais, conforme
            descrito em nossa Política de Privacidade;
          </BulletItem>
          <BulletItem>
            A utilização de cookies e tecnologias semelhantes para melhorar sua
            experiência de navegação;
          </BulletItem>
          <BulletItem>
            A responsabilidade pelas informações fornecidas, que devem ser
            verdadeiras e atualizadas;
          </BulletItem>
          <BulletItem>
            A possibilidade de receber comunicações por e-mail ou outros meios
            digitais com conteúdos informativos, promocionais ou relacionados
            aos serviços contratados;
          </BulletItem>
        </ul>

        <p className="pt-4 text-muted-foreground">
          Se você não concorda com os termos descritos, não continue com o
          cadastro ou uso da plataforma.
        </p>

        <Controller
          name="step3.terms"
          control={control}
          rules={{ required: "Você precisa aceitar os termos para continuar." }}
          render={({ field, fieldState }) => (
            <div className="flex flex-col items-start gap-2 pt-4">
              <div className="space-x-2 flex items-center justify-center">
                <Checkbox
                  id="termos"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="
            bg-white dark:bg-gray-600
            border-gray-300 dark:border-gray-600
            checked:bg-primary dark:checked:bg-primary
            focus:ring-2 focus:ring-primary dark:focus:ring-primary
            transition-colors
          "
                />
                <Label
                  htmlFor="termos"
                  className="text-sm font-normal text-gray-700 dark:text-gray-300"
                >
                  Eu li e concordo com os termos acima.
                </Label>
              </div>
              <div>
                {fieldState.error && (
                  <AlertError errorMessage={fieldState.error?.message} />
                )}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start">
      <span className="mt-1 mr-2 text-muted-foreground">•</span>
      <span>{children}</span>
    </li>
  );
}
