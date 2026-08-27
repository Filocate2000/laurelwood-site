import Image from "next/image";
import { Fragment } from "react";
import { FloatFigure } from "@/components/FloatFigure";
import { photo, type Photo } from "@/lib/photos";

// The 1969 Laurel Canyon Freeway study-zone map in its canon plate, with the
// CA-170 / TO / CA-90 shield row directly beneath the caption INSIDE the plate,
// so the map and the shields float together as one unit. Shared verbatim by
// west-laurelwood and east-laurelwood so the two can never drift; the only
// per-page difference is the caption text (and the map asset, if it ever
// differs: the "Open full size" link points at map.src either way).
const SHIELD_IDS = ["ca-170-shield", "ca-90-shield"];

export function FreewayMapFigure({ map, caption }: { map: Photo; caption: string }) {
  return (
    <FloatFigure
      photo={map}
      float="right"
      width="md:w-[44%]"
      href={map.src}
      caption={caption}
    >
      <div className="mt-3 flex items-center justify-center gap-8">
        {SHIELD_IDS.map((id, i) => {
          const s = photo(id);
          return s ? (
            <Fragment key={id}>
              {i > 0 && (
                <span className="text-sm uppercase tracking-widest text-navy-950/75">
                  TO
                </span>
              )}
              <Image
                src={s.src}
                alt={s.alt}
                width={s.width}
                height={s.height}
                className="h-16 w-auto md:h-24"
              />
            </Fragment>
          ) : null;
        })}
      </div>
    </FloatFigure>
  );
}
