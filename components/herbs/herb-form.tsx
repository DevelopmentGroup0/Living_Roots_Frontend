"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Leaf, Sprout, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { apiClient } from "@/lib/api-client" // Ajusta la ruta
// Importaciones de UI (Shadcn)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Importamos el esquema y el tipo
import { herbSchema, HerbValues } from "./validation-sh"

export function HerbForm() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<HerbValues>({
    resolver: zodResolver(herbSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      urlImagen: "",
  
    },
  })

// ... dentro de tu componente
const { data: session } = useSession()

  const onSubmit = async (data: HerbValues) => {
console.log(data);
console.log("Token de sesión:", session?.accessToken);

  
  try {
    // Usamos el apiClient.post
    // Pasamos: endpoint, data y el token de la sesión
    await apiClient.post(
      "/herbs/", 
      data, 
      session?.accessToken // El token que inyectamos en la sesión
    )

    setSubmitStatus("success")
    reset() 
  } catch (error) {
    console.error("Error al guardar:", error)
    setSubmitStatus("error")
  }
  
}

  return (
    <Card className="w-full max-w-lg border-2 border-primary/20 shadow-lg">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Registrar Planta</CardTitle>
            <CardDescription>Agrega una nueva hierba a tu herbario</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la planta</Label>
            <Input
              id="nombre"
              placeholder="Ej: Manzanilla..."
              {...register("nombre")}
              className={errors.nombre ? "border-destructive" : ""}
            />
            {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Propiedades y beneficios..."
              {...register("descripcion")}
              className={`min-h-24 ${errors.descripcion ? "border-destructive" : ""}`}
            />
            {errors.descripcion && <p className="text-sm text-destructive">{errors.descripcion.message}</p>}
          </div>

          {/* URL Imagen */}
          <div className="space-y-2">
            <Label htmlFor="urlImagen">URL de la imagen</Label>
            <Input
              id="urlImagen"
              {...register("urlImagen")}
              className={errors.urlImagen ? "border-destructive" : ""}
            />
            {errors.urlImagen && <p className="text-sm text-destructive">{errors.urlImagen.message}</p>}
          </div>

          {/* Tipo de Uso (Radio Group) */}


          {/* Mensajes de Estado */}
          {submitStatus === "success" && (
            <div className="p-3 text-sm rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium">
              ¡Planta registrada con éxito!
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-3 text-sm rounded-lg bg-destructive/10 border border-destructive/30 text-destructive font-medium">
              Error al conectar con el servidor.
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
            {isSubmitting ? (
              <>Verificando... <Loader2 className="h-4 w-4 animate-spin" /></>
            ) : (
              <><Leaf className="h-4 w-4" /> Registrar Planta</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}