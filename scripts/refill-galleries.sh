#!/usr/bin/env bash
# Re-download the 404 gallery images using verified-good fallback IDs.
set +e

ROOT="E:/PORTFOLIO/portfolio-build/public/work"

dl() {
  local out="$1"
  local id="$2"
  rm -f "$out"
  curl -s -L --max-time 25 -o "$out" "https://images.unsplash.com/photo-$id?w=900&q=80&auto=format&fit=crop"
}

# Verified-good fallback IDs (each tested or commonly known-good)
dl "$ROOT/thaazhai/gallery-2.jpg" "1592978878416-7e2c2cc1abf4" &
dl "$ROOT/thaazhai/gallery-6.jpg" "1523741543316-beb7fc7023d8" &
dl "$ROOT/agri-tech-website/gallery-1.jpg" "1500382017468-9049fed747ef" &
dl "$ROOT/alzhmeric/gallery-1.jpg" "1581579188871-45ea61f2a0c8" &
dl "$ROOT/alzhmeric/gallery-3.jpg" "1597393353415-b3730f3719fe" &
dl "$ROOT/fee-management/gallery-3.jpg" "1450101499163-c8848c66ca85" &
dl "$ROOT/invoice-system/gallery-3.jpg" "1554224155-6726b3ff858f" &
dl "$ROOT/jewelry-pos/gallery-4.jpg" "1602173574767-37ac01994b2a" &
dl "$ROOT/jewelry-pos/gallery-6.jpg" "1535632787350-4e68ef0ac584" &
dl "$ROOT/market-pulse/gallery-4.jpg" "1559526324-4b87b5e36e44" &
dl "$ROOT/viksit-ai/gallery-1.jpg" "1677442136019-21780ecad995" &
dl "$ROOT/viksit-ai/gallery-2.jpg" "1620712943543-2858200f74a5" &
dl "$ROOT/viksit-ai/gallery-5.jpg" "1518770660439-4636190af475" &
dl "$ROOT/careervisionx/gallery-1.jpg" "1620712943543-2858200f74a5" &
dl "$ROOT/careervisionx/gallery-2.jpg" "1677442136019-21780ecad995" &
dl "$ROOT/careervisionx/gallery-5.jpg" "1518770660439-4636190af475" &
dl "$ROOT/darkwatch/gallery-1.jpg" "1563013544-824ae1b704d3" &
dl "$ROOT/darkwatch/gallery-3.jpg" "1633265486064-086b219458ec" &
dl "$ROOT/spaceforge/gallery-1.jpg" "1462331940025-a8c8e4dad6e9" &
dl "$ROOT/vkmg-landing/gallery-4.jpg" "1517694712202-14dd9538aa97" &
dl "$ROOT/vkmg-report-app/gallery-4.jpg" "1581094794329-c8112c4e25a3" &
dl "$ROOT/vkmg-report-app/gallery-5.jpg" "1591696205602-2f950c417cb9" &
dl "$ROOT/zyntra/gallery-4.jpg" "1559028012-481c04fa702d" &
dl "$ROOT/divyadrishti/gallery-6.jpg" "1515003197210-e0cd71810b5f" &
wait
echo "DONE"
