import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MagicCard } from "./magicui/magic-card";
import { useTheme } from "next-themes";
import Link from "next/link";
export default function TabCard() {
  const { theme } = useTheme();

  const TabContentData = [
    {
      id: 1,
      title: "Smart Integrations",
      value: "Integrations",
      description:
        "Connect Notion, Docs, and Zapier. Invoicepedia pulls data from your tools to build accurate invoices instantly..",
      btnTitle: "Connect Tools",
    },
    {
      id: 2,
      title: "Auto Invoicing",
      value: "Automation",
      description:
        "Set it once, forget the rest. Automate invoice creation from tasks, forms, or workflows—no manual work.",
      btnTitle: "Generate Invoice",
    },
    {
      id: 3,
      title: "Billing Insights",
      value: "Insights",
      description:
        " See what's billed, what's missed, and what needs attention. Stay on top of your earnings in real time.",
      btnTitle: "Start Billing Smarter",
    },
    {
      id: 4,
      title: "Clear Audit Trail",
      value: "Audit",
      description:
        "  Every line item is traceable. Know exactly where each charge came from—down to the note or task.",
      btnTitle: "Try with Your Data",
    },
  ];

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="Automation">
        <TabsList className="  ">
          <TabsTrigger value="Integrations">🌐 Integrations</TabsTrigger>
          <TabsTrigger value="Automation">⚡ Automation</TabsTrigger>
          <TabsTrigger value="Insights">🧠 Insights</TabsTrigger>
          <TabsTrigger value="Audit">🔍 Audit</TabsTrigger>
        </TabsList>
        {TabContentData.map((item, index) => {
          return (
            <TabsContent className="mt-6" key={item.id} value={item.value}>
  <Card className="p-0 max-w-sm w-full shadow-none border-none">
    <MagicCard
      gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
      className="p-0 rounded-xl h-full"
    >
      <div className="flex flex-col h-full min-h-[240px]">
     
        <div className="p-6 space-y-3 flex-grow">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="p-6 pt-0">
          <Link href="/dashboard" passHref>
            <Button className="w-full text-base py-2.5 font-medium transition-transform hover:scale-[1.03] cursor-pointer hover:shadow-md">
              {item.btnTitle}
            </Button>
          </Link>
        </div>
      </div>
    </MagicCard>
  </Card>
</TabsContent>

          );
        })}
      </Tabs>
    </div>
  );
}
