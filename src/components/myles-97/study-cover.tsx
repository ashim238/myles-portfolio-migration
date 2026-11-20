import Image from "next/image";
import type { ProgramDefinition } from "@/lib/myles-97/programs";
import { Myles97Icon } from "./icons";

export function StudyCover({ program }: { program: ProgramDefinition }) {
  const source = program.coverImage ?? program.previewImage?.src;
  return (
    <span className="myles97-program-cover study-cover">
      {source ? (
        <Image src={source} alt={program.coverImage ? program.coverAlt ?? "" : program.previewImage?.alt ?? ""}
          fill sizes="(max-width: 760px) 92vw, 480px" />
      ) : <Myles97Icon name="document" variant="color" size={48} aria-hidden="true" />}
    </span>
  );
}
