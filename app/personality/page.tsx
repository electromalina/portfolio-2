import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import AlbumShowcase from "@/components/personality/AlbumShowcase";
import BrandsSection from "@/components/personality/BrandsSection";
import { ALBUMS, MUSIC_SECTION } from "@/lib/albums";
import { BRANDS, BRANDS_SECTION } from "@/lib/personality";

export const metadata: Metadata = {
  title: "Personality",
  description: "The records and brands behind Danylo Kalynovskyi's work.",
};

export default function PersonalityPage() {
  return (
    <PageShell current="personality" eyebrow="03 · off the clock" title="personality">
      {/* full-width ink band, outside the max-width container */}
      <AlbumShowcase albums={ALBUMS} {...MUSIC_SECTION} />

      <BrandsSection brands={BRANDS} {...BRANDS_SECTION} />
    </PageShell>
  );
}
