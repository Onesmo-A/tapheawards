<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ImageOptimizer
{
    /**
     * Optimize and store an uploaded image on the public disk.
     * Converts to WebP format, resizes if too large, and compresses.
     *
     * @param UploadedFile $file
     * @param string $directory
     * @param int|null $maxWidth
     * @param int $quality
     * @return string Relative path of the stored file
     */
    public static function optimizeAndStore(UploadedFile $file, string $directory, ?int $maxWidth = 1200, int $quality = 80): string
    {
        // 1. Fallback to standard Laravel storage if GD extension is not loaded
        if (!extension_loaded('gd')) {
            Log::warning('GD Extension is not loaded. Falling back to standard image storage.');
            return $file->store($directory, 'public');
        }

        // 2. Generate a unique filename with .webp extension
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        // Clean original name (keep only alphanumeric and dashes)
        $cleanName = preg_replace('/[^a-zA-Z0-9_\-]/', '', $originalName);
        if (empty($cleanName)) {
            $cleanName = 'image';
        }
        $filename = $cleanName . '_' . time() . '_' . uniqid() . '.webp';
        
        $tempPath = $file->getRealPath();
        
        // 3. Verify it is a valid image and get dimensions
        $imageInfo = @getimagesize($tempPath);
        if (!$imageInfo) {
            Log::warning('File is not a valid image format. Storing as original.');
            return $file->store($directory, 'public');
        }
        
        [$origWidth, $origHeight, $type] = $imageInfo;
        
        // 4. Load the image resource according to type
        $srcImage = null;
        switch ($type) {
            case IMAGETYPE_JPEG:
                $srcImage = @imagecreatefromjpeg($tempPath);
                break;
            case IMAGETYPE_PNG:
                $srcImage = @imagecreatefrompng($tempPath);
                break;
            case IMAGETYPE_WEBP:
                $srcImage = @imagecreatefromwebp($tempPath);
                break;
            case IMAGETYPE_GIF:
                $srcImage = @imagecreatefromgif($tempPath);
                break;
            default:
                Log::warning('Unsupported image format. Storing as original: ' . $type);
                return $file->store($directory, 'public');
        }
        
        if (!$srcImage) {
            Log::warning('Failed to create image resource. Storing as original.');
            return $file->store($directory, 'public');
        }
        
        // 5. Calculate new dimensions and resize if it exceeds max width
        if ($maxWidth && $origWidth > $maxWidth) {
            $newWidth = $maxWidth;
            $newHeight = (int) (($origHeight / $origWidth) * $newWidth);
            
            $dstImage = imagecreatetruecolor($newWidth, $newHeight);
            
            // Retain transparency for PNG/WebP/GIF
            imagealphablending($dstImage, false);
            imagesavealpha($dstImage, true);
            
            // Resize using best interpolation method
            imagecopyresampled($dstImage, $srcImage, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
            
            imagedestroy($srcImage);
            $processedImage = $dstImage;
        } else {
            $processedImage = $srcImage;
            
            // Ensure alpha transparency is saved even if we didn't resize
            imagealphablending($processedImage, false);
            imagesavealpha($processedImage, true);
        }
        
        // 6. Write image as webp to temporary file
        $tempWebp = tempnam(sys_get_temp_dir(), 'webp_opt');
        if (!$tempWebp) {
            imagedestroy($processedImage);
            return $file->store($directory, 'public');
        }
        
        $success = @imagewebp($processedImage, $tempWebp, $quality);
        imagedestroy($processedImage);
        
        if (!$success) {
            Log::warning('Failed to generate WebP image. Storing as original.');
            if (file_exists($tempWebp)) {
                @unlink($tempWebp);
            }
            return $file->store($directory, 'public');
        }
        
        // 7. Store using Laravel Storage facade
        $storedPath = Storage::disk('public')->putFileAs($directory, new \Illuminate\Http\File($tempWebp), $filename);
        
        // Cleanup temp file
        if (file_exists($tempWebp)) {
            @unlink($tempWebp);
        }
        
        return $storedPath ?: $file->store($directory, 'public');
    }
}
