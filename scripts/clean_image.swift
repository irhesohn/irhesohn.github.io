// 블로그 사진 정리: 위치(GPS)·촬영 날짜·기기 정보 같은 메타데이터를 모두 지우고,
// 회전 방향을 바로잡고, 긴 변이 maxpx보다 크면 줄여서 저장합니다.
// 사용: clean_image <입력> <출력> <maxpx> <jpeg품질 0~1>
// 출력 형식은 출력 파일 확장자를 따릅니다 (.png 는 PNG, 그 밖에는 JPEG).
import Foundation
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
guard a.count == 5, let maxPx = Int(a[3]), let q = Double(a[4]) else {
  FileHandle.standardError.write("usage: clean_image <in> <out> <maxpx> <quality>\n".data(using: .utf8)!); exit(2)
}
let inURL = URL(fileURLWithPath: a[1]), outURL = URL(fileURLWithPath: a[2])
guard let src = CGImageSourceCreateWithURL(inURL as CFURL, nil),
      let props = CGImageSourceCopyPropertiesAtIndex(src, 0, nil) as? [CFString: Any] else { exit(1) }
let w = props[kCGImagePropertyPixelWidth] as? Int ?? 0, h = props[kCGImagePropertyPixelHeight] as? Int ?? 0
let opts: [CFString: Any] = [kCGImageSourceCreateThumbnailFromImageAlways: true,
                             kCGImageSourceCreateThumbnailWithTransform: true,
                             kCGImageSourceThumbnailMaxPixelSize: max(1, min(maxPx, max(w, h)))]
guard let img = CGImageSourceCreateThumbnailAtIndex(src, 0, opts as CFDictionary) else { exit(1) }
let isPNG = outURL.pathExtension.lowercased() == "png"
let type = (isPNG ? UTType.png : UTType.jpeg).identifier as CFString
guard let dst = CGImageDestinationCreateWithURL(outURL as CFURL, type, 1, nil) else { exit(1) }
CGImageDestinationAddImage(dst, img, (isPNG ? [:] : [kCGImageDestinationLossyCompressionQuality: q]) as CFDictionary)
exit(CGImageDestinationFinalize(dst) ? 0 : 1)
