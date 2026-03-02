import Link from "next/link";
import Image from "next/image";
import { Experience } from "@/types";
import { formatPrice, CATEGORY_LABELS } from "@/lib/utils";

interface ExperienceCardProps {
  experience: Experience;
  priority?: boolean;
}

export default function ExperienceCard({ experience, priority = false }: ExperienceCardProps) {
  const coverImage = experience.images?.find((img) => img.is_cover) ?? experience.images?.[0];
  const categoryLabel = CATEGORY_LABELS[experience.category]?.nav ?? experience.category;

  return (
    <Link href={`/experiences/${experience.slug}`} className="group block">
      <div className="relative aspect-[4/5] mb-5 overflow-hidden bg-beige">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.alt || experience.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-beige-dark flex items-center justify-center">
            <span className="font-serif text-dark-muted/30 text-sm italic">Photograph coming</span>
          </div>
        )}
        <div className="absolute bottom-4 left-4">
          <span className="bg-cream/90 backdrop-blur-sm font-sans text-xs tracking-widest uppercase px-3 py-1.5 text-dark">
            {categoryLabel}
          </span>
        </div>
      </div>
      <p className="font-sans text-xs tracking-widest uppercase text-dark-muted mb-2">{experience.zone}</p>
      <h3 className="font-serif text-xl leading-snug text-dark group-hover:text-olive transition-colors mb-3">{experience.title}</h3>
      <p className="font-sans text-sm font-light text-dark-muted">From {formatPrice(experience.price_from)} per person</p>
    </Link>
  );
}