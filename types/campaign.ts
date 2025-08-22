export interface CampaignData {
  title: string;
  description: string;
  goal: string;
  country: string;
  postalCode: string;
  category: CampaignCategory;
  recipientType: RecipientType;
  charityIndex: number;
  imagePath: string;
}

export type CampaignCategory =
  | "Education"
  | "Refugee"
  | "Multimedia"
  | "Mosque/Community"
  | "Women"
  | "Emergency Relief"
  | "Health"
  | "Palestine"
  | "Food/Water"
  | "Orphans"
  | "Other";

export type RecipientType = "Yourself" | "Someone else" | "Charity";
