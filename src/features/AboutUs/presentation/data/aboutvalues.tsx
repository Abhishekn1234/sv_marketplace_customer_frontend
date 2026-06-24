import {
  CustomerIcon,
  QualityIcon,
  SafetyIcon,
  SustainabilityIcon,
  TransparencyIcon,
  TrustIcon,
} from "@/components/icons";

export const getAboutValues = (t: any) => [
  {
    title: t.aboutpage.values.items.trust.title,
    description: t.aboutpage.values.items.trust.desc,
    icon: <TrustIcon />,
  },
  {
    title: t.aboutpage.values.items.quality.title,
    description: t.aboutpage.values.items.quality.desc,
    icon: <QualityIcon />,
  },
  {
    title: t.aboutpage.values.items.customer.title,
    description: t.aboutpage.values.items.customer.desc,
    icon: <CustomerIcon />,
  },
  {
    title: t.aboutpage.values.items.safety.title,
    description: t.aboutpage.values.items.safety.desc,
    icon: <SafetyIcon />,
  },
  {
    title: t.aboutpage.values.items.transparency.title,
    description: t.aboutpage.values.items.transparency.desc,
    icon: <TransparencyIcon />,
  },
  {
    title: t.aboutpage.values.items.sustainability.title,
    description: t.aboutpage.values.items.sustainability.desc,
    icon: <SustainabilityIcon />,
  },
];