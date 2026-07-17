<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class OptimizeImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:optimize';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Boresha na ubadilishe picha zote za static na zilizopakiwa kuwa WebP na kusasisha database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Inaanza kuboresha picha zote...");

        if (!extension_loaded('gd')) {
            $this->error("GD Extension haipo kwenye PHP. Tafadhali washa GD extension kwanza.");
            return 1;
        }

        // 1. Optimize static images in public/images
        $this->info("\n--- 1. Kuboresha picha za static kwenye public/images ---");
        $this->optimizeStaticImages();

        // 2. Optimize database uploads
        $this->info("\n--- 2. Kuboresha picha za database uploads ---");
        $this->optimizeDatabaseUploads();

        $this->info("\nUboreshaji umekamilika kikamilifu! Picha zote ziko katika mfumo wa WebP sasa.");
        return 0;
    }

    /**
     * Convert and optimize static images in public/images.
     */
    private function optimizeStaticImages()
    {
        $publicImagesDir = public_path('images');
        if (!file_exists($publicImagesDir)) {
            $this->warn("Folda ya public/images haipo.");
            return;
        }

        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($publicImagesDir, \RecursiveDirectoryIterator::SKIP_DOTS)
        );

        $count = 0;
        foreach ($files as $file) {
            if ($file->isDir()) {
                continue;
            }

            $path = $file->getRealPath();
            $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

            // Skip webp or files that are not common images
            if (!in_array($extension, ['png', 'jpg', 'jpeg', 'gif'])) {
                continue;
            }

            $imageInfo = @getimagesize($path);
            if (!$imageInfo) {
                continue;
            }

            [$width, $height, $type] = $imageInfo;

            $srcImage = null;
            switch ($type) {
                case IMAGETYPE_JPEG:
                    $srcImage = @imagecreatefromjpeg($path);
                    break;
                case IMAGETYPE_PNG:
                    $srcImage = @imagecreatefrompng($path);
                    break;
                case IMAGETYPE_GIF:
                    $srcImage = @imagecreatefromgif($path);
                    break;
            }

            if (!$srcImage) {
                continue;
            }

            // Kama picha ni kubwa sana (zaidi ya 1600px width), ipunguze ukubwa proportionally
            if ($width > 1600) {
                $newWidth = 1600;
                $newHeight = (int) (($height / $width) * $newWidth);
                $dstImage = imagecreatetruecolor($newWidth, $newHeight);
                imagealphablending($dstImage, false);
                imagesavealpha($dstImage, true);
                imagecopyresampled($dstImage, $srcImage, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                imagedestroy($srcImage);
                $processedImage = $dstImage;
            } else {
                $processedImage = $srcImage;
                imagealphablending($processedImage, false);
                imagesavealpha($processedImage, true);
            }

            $targetPath = pathinfo($path, PATHINFO_DIRNAME) . '/' . pathinfo($path, PATHINFO_FILENAME) . '.webp';

            $success = @imagewebp($processedImage, $targetPath, 80);
            imagedestroy($processedImage);

            if ($success) {
                // Futa faili la zamani zito
                @unlink($path);
                $this->info("Kubadili picha: " . basename($path) . " -> " . basename($targetPath));
                $count++;
            }
        }

        $this->info("Zoezi la picha za static limekamilika. Picha {$count} zimebadilishwa kuwa WebP.");
    }

    /**
     * Convert and optimize uploaded files referenced in the database.
     */
    private function optimizeDatabaseUploads()
    {
        $models = [
            \App\Models\Category::class => 'image_path',
            \App\Models\GalleryAlbum::class => 'cover_image',
            \App\Models\HeroBanner::class => 'image_path',
            \App\Models\Nominee::class => 'image_path',
            \App\Models\NomineeApplication::class => 'photo_path',
            \App\Models\Post::class => 'featured_image',
            \App\Models\SeasonAward::class => 'cover_image_path',
            \App\Models\Sponsor::class => 'logo_path',
        ];

        foreach ($models as $modelClass => $attribute) {
            if (!class_exists($modelClass)) {
                $this->warn("Model {$modelClass} haipo, inaruka.");
                continue;
            }

            $this->info("Inapitia database record za: {$modelClass} (field: {$attribute})...");
            
            $records = $modelClass::whereNotNull($attribute)
                ->where($attribute, '!=', '')
                ->where($attribute, 'not like', '%.webp')
                ->get();

            $count = 0;
            foreach ($records as $record) {
                $oldPath = $record->$attribute;
                
                // Ikiwa file lipo kwenye public disk
                if (Storage::disk('public')->exists($oldPath)) {
                    $absolutePath = Storage::disk('public')->path($oldPath);
                    $directory = dirname($oldPath);
                    $directory = ($directory === '.') ? '' : $directory;

                    $newPath = $this->convertUploadToWebp($absolutePath, $directory);
                    if ($newPath) {
                        // Futa file la zamani
                        Storage::disk('public')->delete($oldPath);
                        // Hifadhi jina jipya la .webp kwenye database
                        $record->$attribute = $newPath;
                        $record->save();
                        $count++;
                    }
                }
            }

            $this->info("Imesasisha record {$count} za {$modelClass}.");
        }
    }

    /**
     * Helper converting single file to WebP in target storage directory.
     */
    private function convertUploadToWebp(string $absolutePath, string $directory): ?string
    {
        if (!file_exists($absolutePath)) {
            return null;
        }

        $imageInfo = @getimagesize($absolutePath);
        if (!$imageInfo) {
            return null;
        }

        [$width, $height, $type] = $imageInfo;

        $srcImage = null;
        switch ($type) {
            case IMAGETYPE_JPEG:
                $srcImage = @imagecreatefromjpeg($absolutePath);
                break;
            case IMAGETYPE_PNG:
                $srcImage = @imagecreatefrompng($absolutePath);
                break;
            case IMAGETYPE_GIF:
                $srcImage = @imagecreatefromgif($absolutePath);
                break;
        }

        if (!$srcImage) {
            return null;
        }

        // Handle transparency
        imagealphablending($srcImage, false);
        imagesavealpha($srcImage, true);

        // Resize proportionally if too large (isizidi 1200px width kwenye dynamic uploads)
        if ($width > 1200) {
            $newWidth = 1200;
            $newHeight = (int) (($height / $width) * $newWidth);
            $dstImage = imagecreatetruecolor($newWidth, $newHeight);
            imagealphablending($dstImage, false);
            imagesavealpha($dstImage, true);
            imagecopyresampled($dstImage, $srcImage, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagedestroy($srcImage);
            $processedImage = $dstImage;
        } else {
            $processedImage = $srcImage;
        }

        // Generate target filename
        $filename = pathinfo($absolutePath, PATHINFO_FILENAME) . '.webp';
        
        $outputDirAbs = Storage::disk('public')->path($directory);
        if (!file_exists($outputDirAbs)) {
            @mkdir($outputDirAbs, 0755, true);
        }

        $targetPathAbs = $outputDirAbs . '/' . $filename;

        // Ikiwa file lenye jina hilo lipo tayari, ongeza timestamp kulifanya unique
        if (file_exists($targetPathAbs)) {
            $filename = pathinfo($absolutePath, PATHINFO_FILENAME) . '_' . time() . '.webp';
            $targetPathAbs = $outputDirAbs . '/' . $filename;
        }

        $success = @imagewebp($processedImage, $targetPathAbs, 80);
        imagedestroy($processedImage);

        if ($success) {
            return empty($directory) ? $filename : $directory . '/' . $filename;
        }

        return null;
    }
}
