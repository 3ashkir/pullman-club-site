"""Crop a PNG to WxH from the top-left, without PIL."""
import sys, zlib, struct

def chunks(d):
    i = 8
    while i < len(d):
        ln = struct.unpack(">I", d[i:i+4])[0]
        typ = d[i+4:i+8]
        yield typ, d[i+8:i+8+ln]
        i += 8 + ln + 4

def pack(typ, data):
    return struct.pack(">I", len(data)) + typ + data + struct.pack(">I", zlib.crc32(typ + data) & 0xffffffff)

src, dst, W, H = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
d = open(src, "rb").read()
idat = b""
for typ, data in chunks(d):
    if typ == b"IHDR":
        w, h, depth, ctype, comp, filt, inter = struct.unpack(">IIBBBBB", data)
        assert depth == 8 and inter == 0, (depth, inter)
        bpp = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[ctype]
    elif typ == b"IDAT":
        idat += data
raw = zlib.decompress(idat)
stride = w * bpp
prev = bytearray(stride)
out_rows = []
pos = 0
for y in range(h):
    f = raw[pos]; pos += 1
    line = bytearray(raw[pos:pos+stride]); pos += stride
    for x in range(stride):          # undo the per-scanline filter
        a = line[x - bpp] if x >= bpp else 0
        b = prev[x]
        c = prev[x - bpp] if x >= bpp else 0
        if f == 1: line[x] = (line[x] + a) & 255
        elif f == 2: line[x] = (line[x] + b) & 255
        elif f == 3: line[x] = (line[x] + ((a + b) >> 1)) & 255
        elif f == 4:
            p = a + b - c
            pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
            pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
            line[x] = (line[x] + pr) & 255
    prev = line
    if y < H:
        out_rows.append(b"\x00" + bytes(line[:W * bpp]))
new = zlib.compress(b"".join(out_rows), 9)
open(dst, "wb").write(
    d[:8]
    + pack(b"IHDR", struct.pack(">IIBBBBB", W, H, depth, ctype, comp, filt, inter))
    + pack(b"IDAT", new)
    + pack(b"IEND", b"")
)
print("cropped ->", W, "x", H)
