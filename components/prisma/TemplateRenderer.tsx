"use client";

import type { PropertyData } from "@/lib/prisma-types";
import { BoutiqueTemplate } from "./templates/BoutiqueTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { TropicalTemplate } from "./templates/TropicalTemplate";
import { LuxuryTemplate } from "./templates/LuxuryTemplate";
import { RusticTemplate } from "./templates/RusticTemplate";

type Props = {
  data: PropertyData;
  setData: (d: PropertyData) => void;
  editing: boolean;
};

export function TemplateRenderer({ data, setData, editing }: Props) {
  const props = { data, setData, editing };

  switch (data.templateId) {
    case "minimal":
      return <MinimalTemplate {...props} />;
    case "tropical":
      return <TropicalTemplate {...props} />;
    case "luxury":
      return <LuxuryTemplate {...props} />;
    case "rustic":
      return <RusticTemplate {...props} />;
    case "boutique":
    default:
      return <BoutiqueTemplate {...props} />;
  }
}
