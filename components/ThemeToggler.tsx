"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggler() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
      
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
      
      </DropdownMenuContent>
    </DropdownMenu>
  )
}




        // <TabsContent value="Integrations">
        //   <Card className="p-0 max-w-sm w-full shadow-none border-none">
        //     <MagicCard
        //       gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        //       className="p-0"
        //     >
        //       <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
        //         <CardTitle>{}</CardTitle>
        //         <CardDescription>
        //           Connect Notion, Docs, and Zapier. Invoicepedia pulls data from
        //           your tools to build accurate invoices instantly..
        //         </CardDescription>
        //       </CardHeader>

        //       <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
        //         <Button className="w-full">Connect Tools</Button>
        //       </CardFooter>
        //     </MagicCard>
        //   </Card>
        // </TabsContent>
        // <TabsContent value="Automation">
        //   <Card className="p-0 max-w-sm w-full shadow-none border-none">
        //     <MagicCard
        //       gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        //       className="p-0"
        //     >
        //       <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
        //         <CardTitle>Auto Invoicing</CardTitle>
        //         <CardDescription>
        //           Set it once, forget the rest. Automate invoice creation from
        //           tasks, forms, or workflows—no manual work.
        //         </CardDescription>
        //       </CardHeader>

        //       <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
        //         <Button className="w-full">Generate Invoice</Button>
        //       </CardFooter>
        //     </MagicCard>
        //   </Card>
        // </TabsContent>
        // <TabsContent value="Insights">
        //   <Card className="p-0 max-w-sm w-full shadow-none border-none">
        //     <MagicCard
        //       gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        //       className="p-0"
        //     >
        //       <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
        //         <CardTitle>Billing Insights</CardTitle>
        //         <CardDescription>
        //           See what's billed, what's missed, and what needs attention.
        //           Stay on top of your earnings in real time.
        //         </CardDescription>
        //       </CardHeader>

        //       <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
        //         <Button className="w-full">Start Billing Smarter</Button>
        //       </CardFooter>
        //     </MagicCard>
        //   </Card>
        // </TabsContent>
        // <TabsContent value="Audit">
        //   <Card className="p-0 max-w-sm w-full shadow-none border-none">
        //     <MagicCard
        //       gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        //       className="p-0"
        //     >
        //       <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
        //         <CardTitle>Clear Audit Trail</CardTitle>
        //         <CardDescription>
        //           Every line item is traceable. Know exactly where each charge
        //           came from—down to the note or task.
        //         </CardDescription>
        //       </CardHeader>

        //       <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
        //         <Button className="w-full">Try with Your Data</Button>
        //       </CardFooter>
        //     </MagicCard>
        //   </Card>
        // </TabsContent>