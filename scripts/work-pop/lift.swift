// Lift the foreground subject out of an image with macOS Vision (the same
// model as "lift subject from background" in Photos). Writes a full-size PNG
// with the subject on transparency, registered pixel-for-pixel with the input.
// Usage: swift scripts/work-pop/lift.swift <in.png> <out.png> [--center]
//   --center keeps only the instance under the image's centre pixel.
import Foundation
import Vision
import CoreImage
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count >= 3 else { print("usage: lift.swift in out [--center]"); exit(1) }
let centerOnly = args.contains("--center")
let inURL = URL(fileURLWithPath: args[1]), outURL = URL(fileURLWithPath: args[2])
guard let ci = CIImage(contentsOf: inURL) else { print("cannot read"); exit(1) }
let handler = VNImageRequestHandler(ciImage: ci)
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let obs = req.results?.first else { print("no subject found"); exit(2) }
var instances = obs.allInstances
if centerOnly {
  // The instance label under the centre of the image.
  let labels = obs.instanceMask
  CVPixelBufferLockBaseAddress(labels, .readOnly)
  let w = CVPixelBufferGetWidth(labels), h = CVPixelBufferGetHeight(labels)
  let row = CVPixelBufferGetBytesPerRow(labels)
  let base = CVPixelBufferGetBaseAddress(labels)!.assumingMemoryBound(to: UInt8.self)
  let label = Int(base[(h / 2) * row + (w / 2)])
  CVPixelBufferUnlockBaseAddress(labels, .readOnly)
  if label > 0 { instances = IndexSet(integer: label) }
}
let buf = try obs.generateMaskedImage(ofInstances: instances, from: handler, croppedToInstancesExtent: false)
let out = CIImage(cvPixelBuffer: buf)
let ctx = CIContext()
guard let cg = ctx.createCGImage(out, from: out.extent) else { exit(3) }
let dest = CGImageDestinationCreateWithURL(outURL as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, cg, nil)
CGImageDestinationFinalize(dest)
print("ok \(obs.allInstances.count) instance(s) \(Int(out.extent.width))x\(Int(out.extent.height))")
