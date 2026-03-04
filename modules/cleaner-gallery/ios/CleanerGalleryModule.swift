import ExpoModulesCore
import Foundation
import Photos

let blurryImageDetector = BlurryImageDetector()
let similarImageDetector = SimilarImageDetector()
let cameraroll = Cameraroll()

public class CleanerGalleryModule: Module {
  public func definition() -> ModuleDefinition {
     Name("CleanerGallery")

     AsyncFunction("findBlurryImagesFromGallery") { (previousIds: [String], threshold: Double, itemsPerPage: Int, promise: Promise) in
       blurryImageDetector.findBlurryImagesFromGallery(
          previousIds: previousIds, threshold: threshold, itemsPerPage: itemsPerPage, resolve: promise.resolve)
    }


    AsyncFunction("findSimilarImagesFromGallery") { (interval: Double, promise: Promise) in
       similarImageDetector.findSimilarImagesFromGallery(interval: interval, resolve: promise.resolve);
    }

    AsyncFunction("getAssets") { (params: [String: Any], promise: Promise) in
       cameraroll.getAssets(params: params, resolve: promise.resolve, reject: promise.legacyRejecter)
    }


    AsyncFunction("deleteAssets") { (ids: [String], promise: Promise) in
       cameraroll.deleteAssets(ids: ids, resolve: promise.resolve, reject: promise.legacyRejecter)
    }

    AsyncFunction("extractThumbnail") { (id: String, filename: URL, width: Int, height: Int, promise: Promise) in
       cameraroll.extractThumbnail(id: id, filename: filename, width: width, height: height, resolve: promise.resolve, reject: promise.legacyRejecter);
    }

     AsyncFunction("saveAssets") { (files: [String], promise: Promise) in
       cameraroll.saveAssets(files: files, resolve: promise.resolve, reject: promise.legacyRejecter);
    }
  }
}
