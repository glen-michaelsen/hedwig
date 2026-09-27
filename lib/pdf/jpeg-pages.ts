/**
 * A PDF where every page is one full-bleed JPEG, sized to the image. That's
 * all a LinkedIn document carousel needs, so it's written by hand here
 * rather than pulling a PDF library into the Worker: JPEG goes into a PDF
 * as-is (the DCTDecode filter), so there's nothing to encode.
 */

type JpegInfo = { width: number; height: number; components: number };

/** Width, height and colour channels, read from the JPEG's SOF marker. */
export function readJpegInfo(bytes: Uint8Array): JpegInfo | null {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < bytes.length) {
    if (bytes[i] !== 0xff) return null;
    const marker = bytes[i + 1];
    const length = (bytes[i + 2] << 8) | bytes[i + 3];
    // SOF0 to SOF15, except the DHT, JPG and DAC markers in that range.
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return {
        height: (bytes[i + 5] << 8) | bytes[i + 6],
        width: (bytes[i + 7] << 8) | bytes[i + 8],
        components: bytes[i + 9],
      };
    }
    i += 2 + length;
  }
  return null;
}

const COLOR_SPACES: Record<number, string> = { 1: "/DeviceGray", 3: "/DeviceRGB", 4: "/DeviceCMYK" };

function pdfString(value: string) {
  // Plain ASCII keeps the metadata valid without a font or encoding.
  return `(${value.replace(/[^\x20-\x7e]/g, "").replace(/[\\()]/g, "\\$&")})`;
}

export function jpegPagesToPdf(jpegs: Uint8Array[], title: string): Uint8Array {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;

  const push = (chunk: Uint8Array | string) => {
    const bytes = typeof chunk === "string" ? encoder.encode(chunk) : chunk;
    chunks.push(bytes);
    length += bytes.length;
  };
  const object = (id: number, body: (Uint8Array | string)[]) => {
    offsets[id] = length;
    push(`${id} 0 obj\n`);
    body.forEach(push);
    push("\nendobj\n");
  };

  const pages = jpegs
    .map((jpeg) => ({ jpeg, info: readJpegInfo(jpeg) }))
    .filter((page): page is { jpeg: Uint8Array; info: JpegInfo } =>
      Boolean(page.info && COLOR_SPACES[page.info.components]),
    );

  // 1 catalog, 2 page tree, then three objects per page, then the info.
  const pageId = (index: number) => 3 + index * 3;
  const infoId = 3 + pages.length * 3;

  push("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n");
  object(1, ["<< /Type /Catalog /Pages 2 0 R >>"]);
  object(2, [
    `<< /Type /Pages /Kids [${pages.map((_, i) => `${pageId(i)} 0 R`).join(" ")}] /Count ${pages.length} >>`,
  ]);

  pages.forEach(({ jpeg, info }, i) => {
    const id = pageId(i);
    const draw = `q ${info.width} 0 0 ${info.height} 0 0 cm /Im0 Do Q`;
    object(id, [
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${info.width} ${info.height}] ` +
        `/Resources << /XObject << /Im0 ${id + 2} 0 R >> >> /Contents ${id + 1} 0 R >>`,
    ]);
    object(id + 1, [`<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`]);
    object(id + 2, [
      `<< /Type /XObject /Subtype /Image /Width ${info.width} /Height ${info.height} ` +
        `/ColorSpace ${COLOR_SPACES[info.components]} /BitsPerComponent 8 /Filter /DCTDecode ` +
        `/Length ${jpeg.length} >>\nstream\n`,
      jpeg,
      "\nendstream",
    ]);
  });

  object(infoId, [`<< /Title ${pdfString(title)} /Producer (Trenodo) >>`]);

  const xrefAt = length;
  const count = infoId + 1;
  push(`xref\n0 ${count}\n0000000000 65535 f \n`);
  for (let id = 1; id < count; id++) {
    push(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  }
  push(`trailer\n<< /Size ${count} /Root 1 0 R /Info ${infoId} 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`);

  const out = new Uint8Array(length);
  let at = 0;
  for (const chunk of chunks) {
    out.set(chunk, at);
    at += chunk.length;
  }
  return out;
}
