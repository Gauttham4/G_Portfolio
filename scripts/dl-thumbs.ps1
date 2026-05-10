$ErrorActionPreference = 'Continue'
$base = 'E:\PORTFOLIO\portfolio-build\public\work'

$jobs = @(
  @{slug='electrobike';          id='1571068316344-75bc76f77890'},
  @{slug='agri-tech-website';    id='1592982537447-7440770cbfc9'},
  @{slug='careervisionx';        id='1552581234-26160f608093'},
  @{slug='cloud-provisioning';   id='1558494949-ef010cbdcc31'},
  @{slug='darkwatch';            id='1614064548237-096d1a45b4a2'},
  @{slug='divyadrishti';         id='1573497019418-b400bb3ab074'},
  @{slug='ea-tuition-app';       id='1554415707-6e8cfc93fe23'},
  @{slug='fee-management';       id='1554224155-6726b3ff858f'},
  @{slug='hotel-app';            id='1566073771259-6a8506099945'},
  @{slug='invoice-system';       id='1450101499163-c8848c66ca85'},
  @{slug='jewelry-pos';          id='1515562141207-7a88fb7ce338'},
  @{slug='market-pulse';         id='1611974789855-9c2a0a7236a3'},
  @{slug='medicine-search';      id='1584308666744-24d5c474f2ae'},
  @{slug='mindora';              id='1545389336-cf090694435e'},
  @{slug='student-portal';       id='1606761568499-6d2451b23c66'},
  @{slug='teacher-portal';       id='1577896851231-70ef18881754'},
  @{slug='tvk';                  id='1565299585323-38d6b0865b47'},
  @{slug='vkmg-landing';         id='1497366216548-37526070297c'},
  @{slug='vkmg-report-app';      id='1454165804606-c3d57bc86b40'},
  @{slug='voyagr';               id='1488646953014-85cb44e25828'},
  @{slug='zyntra';               id='1559028012-481c04fa702d'}
)

$alts = @{
  'electrobike'='1622188942497-3a08e0bd9e71'
  'agri-tech-website'='1500382017468-9049fed747ef'
  'careervisionx'='1551836022-deb4988cc6c0'
  'cloud-provisioning'='1573164574572-cb89e39749b4'
  'darkwatch'='1550751827-4bd374c3f58b'
  'divyadrishti'='1551836022-deb4988cc6c0'
  'ea-tuition-app'='1453928582365-b6ad33cbcf64'
  'fee-management'='1450101499163-c8848c66ca85'
  'hotel-app'='1564501049412-61c2a3083791'
  'invoice-system'='1554224155-6726b3ff858f'
  'jewelry-pos'='1573408301185-9146fe634ad0'
  'market-pulse'='1590283603385-17ffb3a7f29f'
  'medicine-search'='1471864190281-a93a3070b6de'
  'mindora'='1499209974431-9dddcece7f88'
  'student-portal'='1523580494863-6f3031224c94'
  'teacher-portal'='1503676260728-1c00da094a0b'
  'tvk'='1611605698335-8b1569810432'
  'vkmg-landing'='1517694712202-14dd9538aa97'
  'vkmg-report-app'='1521737711867-e3b97375f902'
  'voyagr'='1530521954074-e64f6810b32d'
  'zyntra'='1558655146-9f40138edfeb'
}

function Get-Thumb($slug, $id) {
  $dir = Join-Path $base $slug
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  $out = Join-Path $dir 'thumb.jpg'
  $url = "https://images.unsplash.com/photo-$id`?w=1200&q=80&auto=format&fit=crop"
  try {
    & curl.exe -sSL --max-time 30 -o $out $url 2>$null
    if (Test-Path $out) {
      $sz = (Get-Item $out).Length
      return $sz
    }
  } catch {}
  return 0
}

$results = @()
foreach ($j in $jobs) {
  $sz = Get-Thumb $j.slug $j.id
  $usedId = $j.id
  $note = 'primary'
  if ($sz -lt 30000) {
    $altId = $alts[$j.slug]
    $sz2 = Get-Thumb $j.slug $altId
    if ($sz2 -ge 30000) { $usedId = $altId; $sz = $sz2; $note = 'alt' }
    else { $note = "FAIL($sz/$sz2)" }
  }
  $results += [pscustomobject]@{ Slug=$j.slug; Id=$usedId; Bytes=$sz; Note=$note }
  Write-Host ("{0,-22} {1,-32} {2,8} {3}" -f $j.slug, $usedId, $sz, $note)
}

$results | Export-Csv -Path 'E:\PORTFOLIO\portfolio-build\scripts\dl-thumbs-result.csv' -NoTypeInformation -Encoding UTF8
