"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export function BoxShadowGenerator() {
  const [horizontalOffset, setHorizontalOffset] = useState(5)
  const [verticalOffset, setVerticalOffset] = useState(5)
  const [blur, setBlur] = useState(10)
  const [spread, setSpread] = useState(0)
  const [color, setColor] = useState("#000000")
  const [opacity, setOpacity] = useState(20)
  const [inset, setInset] = useState(false)

  // Calculate the shadow value
  const shadowColor = `rgba(${Number.parseInt(color.slice(1, 3), 16)}, ${Number.parseInt(color.slice(3, 5), 16)}, ${Number.parseInt(color.slice(5, 7), 16)}, ${opacity / 100})`

  const boxShadow = `${inset ? "inset " : ""}${horizontalOffset}px ${verticalOffset}px ${blur}px ${spread}px ${shadowColor}`

  const cssCode = `box-shadow: ${boxShadow};`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Box Shadow Generator</CardTitle>
          <CardDescription>Create and customize CSS box shadows with live preview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Horizontal Offset: {horizontalOffset}px</Label>
              </div>
              <Slider
                value={[horizontalOffset]}
                min={-50}
                max={50}
                step={1}
                onValueChange={(value) => setHorizontalOffset(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Vertical Offset: {verticalOffset}px</Label>
              </div>
              <Slider
                value={[verticalOffset]}
                min={-50}
                max={50}
                step={1}
                onValueChange={(value) => setVerticalOffset(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Blur Radius: {blur}px</Label>
              </div>
              <Slider value={[blur]} min={0} max={100} step={1} onValueChange={(value) => setBlur(value[0])} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Spread Radius: {spread}px</Label>
              </div>
              <Slider value={[spread]} min={-50} max={50} step={1} onValueChange={(value) => setSpread(value[0])} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Shadow Color</Label>
                <div className="flex">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 p-1 h-10"
                  />
                  <Input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="flex-1 ml-2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Opacity: {opacity}%</Label>
                <Slider value={[opacity]} min={0} max={100} step={1} onValueChange={(value) => setOpacity(value[0])} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="inset" checked={inset} onCheckedChange={setInset} />
              <Label htmlFor="inset">Inset Shadow</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-12">
            <div className="h-32 w-32 bg-white rounded-md" style={{ boxShadow }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSS Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="css">
              <TabsList className="mb-4">
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
              </TabsList>
              <TabsContent value="css" className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{cssCode}</code>
                </pre>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy to clipboard</span>
                </Button>
              </TabsContent>
              <TabsContent value="tailwind" className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{"/* Custom Tailwind CSS required */"}</code>
                </pre>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy to clipboard</span>
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
