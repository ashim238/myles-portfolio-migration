import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as resumeVerifier from "../../../../scripts/verify-resume-pdf.mjs";
import {
  inspectStructure,
  verifyFileSize,
  verifyHeadingAssociations,
  verifyLinkAssociations,
  verifyRoleSemantics,
} from "../../../../scripts/verify-resume-pdf.mjs";

const expectedHeadings = new Map([
  ["Fresh Greens", 1],
  ["UnderstandingFAFSA", 1],
  ["Navi", 1],
  ["Creative Strategy Assistant", 1],
  ["Creative Strategist Intern", 2],
  ["MFA, Design & Technology", 1],
  ["BA, Media Studies", 1],
]);

function writeTaggedHeadingFixture(path: string) {
  const content = "/H3 <</MCID 0>> BDC BT /F1 12 Tf 72 750 Td (Product Designer) Tj ET EMC";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R /StructTreeRoot 7 0 R /MarkInfo << /Marked true >> /Lang (en) >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R /StructParents 0 >>",
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< >>",
    "<< /Type /StructTreeRoot /K [8 0 R] /ParentTree 9 0 R >>",
    "<< /Type /StructElem /S /H3 /P 7 0 R /Pg 3 0 R /K 0 >>",
    "<< /Nums [0 [8 0 R]] >>",
  ];
  let pdf = "%PDF-1.7\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  writeFileSync(path, pdf, "binary");
}

describe("resume PDF heading associations", () => {
  it("extracts the text attached to an H3 structure element", () => {
    const directory = mkdtempSync(join(tmpdir(), "resume-structure-test-"));
    const fixture = join(directory, "tagged-heading.pdf");
    try {
      writeTaggedHeadingFixture(fixture);
      expect(inspectStructure(fixture).h3Texts).toEqual(["Product Designer"]);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("accepts every expected title when it is attached to an H3 tag", () => {
    const h3Texts = [
      "Fresh Greens",
      "UnderstandingFAFSA",
      "Navi",
      "Creative Strategy Assistant",
      "Creative Strategist Intern",
      "Creative Strategist Intern",
      "MFA, Design & Technology",
      "BA, Media Studies",
    ];

    expect(() => verifyHeadingAssociations(h3Texts, expectedHeadings)).not.toThrow();
  });

  it("rejects a title that appears only under NonStruct even when H3 count is unchanged", () => {
    const h3Texts = [
      "Fresh Greens",
      "UnderstandingFAFSA",
      "Navi",
      "Creative Strategy Assistant",
      "Creative Strategist Intern",
      "Creative Strategist Intern",
      "MFA, Design & Technology",
      "Wrong heading with the same global H3 count",
    ];

    expect(() => verifyHeadingAssociations(h3Texts, expectedHeadings)).toThrow(
      "BA, Media Studies",
    );
  });

  it("rejects a role title attached to the wrong number of H3 tags", () => {
    const h3Texts = [
      "Fresh Greens",
      "UnderstandingFAFSA",
      "Navi",
      "Creative Strategy Assistant",
      "Creative Strategist Intern",
      "MFA, Design & Technology",
      "BA, Media Studies",
    ];

    expect(() => verifyHeadingAssociations(h3Texts, expectedHeadings)).toThrow(
      "Creative Strategist Intern",
    );
  });

  it("requires the actual document and section titles to carry H1 and H2 roles", () => {
    expect(() =>
      verifyHeadingAssociations(["Myles Ashitey"], new Map([["Myles Ashitey", 1]]), "H1"),
    ).not.toThrow();
    expect(() =>
      verifyHeadingAssociations(
        ["Professional Summary", "Independent Work", "Work Experience", "Education", "Skills"],
        new Map([
          ["Professional Summary", 1],
          ["Independent Work", 1],
          ["Work Experience", 1],
          ["Education", 1],
          ["Skills", 1],
        ]),
        "H2",
      ),
    ).not.toThrow();
    expect(() =>
      verifyHeadingAssociations(["Wrong name"], new Map([["Myles Ashitey", 1]]), "H1"),
    ).toThrow("Myles Ashitey");
  });
});

describe("resume PDF link associations", () => {
  it("requires each expected annotation URI and visible label inside the same Link role", () => {
    const expected = [
      { text: "mylesashitey@gmail.com", uri: "mailto:mylesashitey@gmail.com" },
      { text: "LinkedIn", uri: "https://linkedin.com/in/myles-ashitey" },
      { text: "mylesdesignsthings.com", uri: "https://www.mylesdesignsthings.com" },
      { text: "Fresh Greens", uri: "https://www.mylesdesignsthings.com/work/fresh-greens" },
      {
        text: "UnderstandingFAFSA",
        uri: "https://www.mylesdesignsthings.com/work/understandingfafsa",
      },
      { text: "Navi", uri: "https://www.mylesdesignsthings.com/work/navi" },
    ];
    const associated = expected.map(({ text, uri }) => ({
      text,
      uris: [uri],
      hasObjectReference: true,
    }));

    expect(() => verifyLinkAssociations(associated, expected)).not.toThrow();
    expect(() =>
      verifyLinkAssociations(
        [{ text: "LinkedIn", uris: [], hasObjectReference: false }],
        [{ text: "LinkedIn", uri: "https://linkedin.com/in/myles-ashitey" }],
      ),
    ).toThrow("LinkedIn");
  });

  it("accepts one trailing slash but rejects a longer HTTP path prefix match", () => {
    const expected = [
      { text: "Navi", uri: "https://www.mylesdesignsthings.com/work/navi" },
    ];

    expect(() =>
      verifyLinkAssociations(
        [
          {
            text: "Navi",
            uris: ["https://www.mylesdesignsthings.com/work/navi/"],
            hasObjectReference: true,
          },
        ],
        expected,
      ),
    ).not.toThrow();
    expect(() =>
      verifyLinkAssociations(
        [
          {
            text: "Navi",
            uris: ["https://www.mylesdesignsthings.com/work/navi-old"],
            hasObjectReference: true,
          },
        ],
        expected,
      ),
    ).toThrow("Navi");
  });

  it("keeps mailto associations exact", () => {
    expect(() =>
      verifyLinkAssociations(
        [
          {
            text: "Email",
            uris: ["mailto:designer@example.com.evil"],
            hasObjectReference: true,
          },
        ],
        [{ text: "Email", uri: "mailto:designer@example.com" }],
      ),
    ).toThrow("Email");
  });
});

describe("resume PDF file-size limit", () => {
  it("accepts an artifact at or below the one MiB ceiling", () => {
    const directory = mkdtempSync(join(tmpdir(), "resume-size-test-"));
    const fixture = join(directory, "under-limit.pdf");
    try {
      writeFileSync(fixture, Buffer.alloc(1024));
      expect(() => verifyFileSize(fixture, 1024 * 1024)).not.toThrow();
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("rejects an artifact above the one MiB ceiling", () => {
    const directory = mkdtempSync(join(tmpdir(), "resume-size-test-"));
    const fixture = join(directory, "over-limit.pdf");
    try {
      writeFileSync(fixture, Buffer.alloc(1024 * 1024 + 1));
      expect(() => verifyFileSize(fixture, 1024 * 1024)).toThrow("1 MiB");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});

describe("resume PDF structure-role semantics", () => {
  it("rejects a nonstandard role for the declared PDF version without a RoleMap", () => {
    expect(() => verifyRoleSemantics("1.4", ["/Document", "/Aside"], {})).toThrow(
      "/Aside",
    );
  });

  it("accepts a custom role only when RoleMap maps it to a standard role", () => {
    expect(() =>
      verifyRoleSemantics("1.4", ["/Document", "/Aside"], { "/Aside": "/Sect" }),
    ).not.toThrow();
    expect(() =>
      verifyRoleSemantics("1.4", ["/Document", "/Aside"], { "/Aside": "/AnotherCustomRole" }),
    ).toThrow("/AnotherCustomRole");
  });
});

describe("resume PDF phone privacy", () => {
  it("rejects phone-shaped text and tel link annotations", () => {
    const verifyPhonePrivacy = (
      resumeVerifier as typeof resumeVerifier & {
        verifyPhonePrivacy?: (texts: string[], links: string[]) => void;
      }
    ).verifyPhonePrivacy;
    const syntheticPhone = ["212", "555", "0199"].join("-");

    expect(typeof verifyPhonePrivacy).toBe("function");
    expect(() => verifyPhonePrivacy?.([`Call ${syntheticPhone}`], [])).toThrow(
      "Phone number found",
    );
    expect(() => verifyPhonePrivacy?.([], [`tel:+1${syntheticPhone.replaceAll("-", "")}`])).toThrow(
      "Phone number found",
    );
    expect(() =>
      verifyPhonePrivacy?.(
        ["New York, NY", "mylesashitey@gmail.com"],
        ["mailto:mylesashitey@gmail.com", "https://www.mylesdesignsthings.com"],
      ),
    ).not.toThrow();
  });
});
