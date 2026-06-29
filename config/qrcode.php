<?php

/*
 * This file is part of Laravel-QRCode.
 *
 * (c) Graham Campbell <graham@alt-three.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

return [

    /*
    |--------------------------------------------------------------------------
    | QR Code Generator
    |--------------------------------------------------------------------------
    |
    | This manages the default generator to be used when generating QR codes.
    | The default is "bacon", but "imagemagick" is also available.
    |
    */

    'generator' => 'bacon',

    /*
    |--------------------------------------------------------------------------
    | QR Code Renderer
    |--------------------------------------------------------------------------
    |
    | This manages the default renderer to be used when generating QR codes.
    | The default is "imagick", but "gd" and "svg" are also available.
    |
    */

    'renderer' => 'imagick',

    /*
    |--------------------------------------------------------------------------
    | QR Code Error Correction
    |--------------------------------------------------------------------------
    |
    | This manages the default error correction to be used when generating
    | QR codes. The default is "L", but "M", "Q", and "H" are also available.
    |
    */

    'error_correction' => 'L',

    /*
    |--------------------------------------------------------------------------
    | QR Code Size
    |--------------------------------------------------------------------------
    |
    | This manages the default size of the QR code to be generated.
    |
    */

    'size' => 100,

    /*
    |--------------------------------------------------------------------------
    | QR Code Margin
    |--------------------------------------------------------------------------
    |
    | This manages the default margin of the QR code to be generated.
    |
    */

    'margin' => 0,

    /*
    |--------------------------------------------------------------------------
    | QR Code Foreground Color
    |--------------------------------------------------------------------------
    |
    | This manages the default foreground color of the QR code to be generated.
    |
    */

    'foreground_color' => ['r' => 0, 'g' => 0, 'b' => 0],

    /*
    |--------------------------------------------------------------------------
    | QR Code Background Color
    |--------------------------------------------------------------------------
    |
    | This manages the default background color of the QR code to be generated.
    |
    */

    'background_color' => ['r' => 255, 'g' => 255, 'b' => 255],

    /*
    |--------------------------------------------------------------------------
    | QR Code Round Block Size
    |--------------------------------------------------------------------------
    |
    | This manages the default round block size of the QR code to be generated.
    |
    */

    'round_block_size' => true,

];