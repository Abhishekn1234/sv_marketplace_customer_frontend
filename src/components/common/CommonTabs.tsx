
import type { TabType } from "@/features/Profile/domain/entities/tabtype";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

interface CommonTabsProps {
  tabs: { label: React.ReactNode; value: TabType; content: React.ReactNode }[];
  defaultValue?: TabType;
  className?: string;
}

export default function CommonTabs({ tabs, defaultValue, className }: CommonTabsProps) {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.value} className={className}>
      {/* Tab buttons */}
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tab content */}
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
