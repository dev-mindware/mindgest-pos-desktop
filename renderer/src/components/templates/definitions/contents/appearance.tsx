"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
  Label,
  Separator,
} from "@/components"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { SelectGroup } from "@radix-ui/react-select"

export function Appearance() {
  const { setTheme, theme } = useTheme()
  const [primaryColor, setPrimaryColor] = useState("#9956F6")
  const [font, setFont] = useState("Outfit")

  const themes = [
    { name: "Light", value: "light", img: "/themes/light.png" },
    { name: "Dark", value: "dark", img: "/themes/dark.png" },
    { name: "System", value: "system", img: "/themes/system.png" },
  ]

  useEffect(() => {
    const savedColor = localStorage.getItem("primary-color")
    const savedFont = localStorage.getItem("font-family")

    if (savedColor) {
      document.documentElement.style.setProperty("--primary", savedColor)
      setPrimaryColor(savedColor)
    }

    if (savedFont) {
      document.documentElement.style.setProperty("--font-family", savedFont)
      setFont(savedFont)
    }
  }, [])

  // Atualizar cor
  const handlePrimaryColorChange = (hex: string) => {
    document.documentElement.style.setProperty("--primary", hex)
    localStorage.setItem("primary-color", hex)
    setPrimaryColor(hex)
  }

  const handleFontChange = (fontName: string) => {
    const fontValue = `'${fontName}', sans-serif`
    document.documentElement.style.setProperty("--font-family", fontValue)
    localStorage.setItem("font-family", fontValue)
    setFont(fontName)
  }

  const restoreDefaults = () => {
    const defaultColor = "#9956F6"
    const defaultFont = "'Outfit', sans-serif"
    const defaultFontName = "Outfit"
    const defaultTheme = "system"

    document.documentElement.style.setProperty("--primary", defaultColor)
    document.documentElement.style.setProperty("--font-family", defaultFont)

    localStorage.removeItem("primary-color")
    localStorage.removeItem("font-family")
    localStorage.removeItem("mindware-theme")

    setPrimaryColor(defaultColor)
    setFont(defaultFontName)
    setTheme(defaultTheme)
  }

  const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) return null;


  return (
    <div className="space-y-6" suppressHydrationWarning>
      <div>
        <h2 className="text-2xl text-center md:text-start">Aparência</h2>
        <p className="text-center text-muted-foreground md:text-start">
          Personalize o MindGest para se adaptar ao teu negócio.
        </p>
      </div>
        <Separator/>
      <div className="grid items-end grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label className="text-lg">Cor Primária</Label>
          <p className="mb-2 text-sm text-muted-foreground">
            Coloque a cor oficial da sua empresa
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => handlePrimaryColorChange(e.target.value)}
              className="w-10 h-10 rounded-xl"
            />
            <Input
              value={primaryColor}
              onChange={(e) => handlePrimaryColorChange(e.target.value)}
              className="w-[120px]"
            />
          </div>
        </div>
        <div>
          <Label className="text-lg">Tipo de Letra</Label>
          <p className="mb-2 text-sm text-muted-foreground">
            Selecione a fonte que mais te agrada
          </p>
          <Select value={font} onValueChange={handleFontChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue defaultValue="Outfit"/>
            </SelectTrigger>
            <SelectContent>
            <SelectGroup>
              <SelectItem value="Outfit">Outfit</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Poppins">Poppins</SelectItem>
              <SelectItem value="Plus Jakarta Sans">Jakarta</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator/>
      <div>
        <Label className="text-lg">Tema</Label>
        <p className="mb-4 text-sm text-muted-foreground">
          Escolha o tema padrão para o seu negócio
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {themes.map(({ name, value, img }) => (
            <Card
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "cursor-pointer border-2 transition-all",
                theme === value
                  ? "border-primary ring-2 ring-primary"
                  : "border-muted"
              )}
            >
              <CardHeader>
                <CardTitle>{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={img}
                  alt={`Tema ${name}`}
                  width={300}
                  height={200}
                  className="border rounded-md shadow-sm"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    <Separator/>
      <div className="pt-4">
        <Button variant="outline" onClick={restoreDefaults}>
          Restaurar Padrão
        </Button>
      </div>
    </div>
  )
}
