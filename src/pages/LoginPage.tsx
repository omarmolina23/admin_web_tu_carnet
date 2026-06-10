import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/hooks/useUser";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SignLayout from "@/components/layouts/SignLayout";

const formSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // tu hook useLogin espera { email, password }
    login(values);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <SignLayout orientation="right">
      <Card className="w-[400px] max-w-[calc(100vw-2rem)] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Iniciar sesión</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Correo electrónico
                      <span className="text-red-500 ml-0.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ejemplo@correo.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <div className="min-h-[1.1rem]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contraseña
                      <span className="text-red-500 ml-0.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <div className="min-h-[1.1rem]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              {/* Mostrar contraseña + Olvidaste tu contraseña */}
              <div className="flex justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showpasswd"
                    checked={showPassword}
                    onCheckedChange={toggleShowPassword}
                  />
                  <label
                    htmlFor="showpasswd"
                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mostrar contraseña
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer bg-[#BC0017] hover:bg-[#990013] text-white"
                disabled={isPending}
              >
                {isPending ? "Ingresando..." : "Ingresar"}
              </Button>

              {/* Logo debajo del botón */}
              <div className="flex justify-center mt-4">
                <img
                  src="/logo_tu_carnet.svg"
                  alt="Logo Tu Carnet UFPS"
                  className="w-20 h-20"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </SignLayout>
  );
}
