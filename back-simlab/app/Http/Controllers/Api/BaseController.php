<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

abstract class BaseController extends Controller
{
    public function sendResponse($result, $message)
    {
        $response = [
            'success' => true,
            'data' => $result,
            'message' => $message
        ];

        return response($response, 200);
    }

    public function sendError($error, $errorMessage = [], $code = 404)
    {
        $response = [
            'code' => $code,
            'success' => false,
            'message' => $error
        ];

        if (!empty($errorMessage)) {
            $response['errors'] = $errorMessage;
        }

        return response()->json($response, $code);
    }

    protected function storeFile($request, $request_name, $folder_path, $existing_path = null)
    {
        if ($request->hasFile($request_name)) {
            // Delete old photo if exists
            if ($existing_path ) {
                $this->deleteFile($existing_path);
            }

            $file = $request->file($request_name);
            $extension = $file->getClientOriginalExtension();

            // Generate unique file name
            $name = preg_replace('/[^a-zA-Z0-9_]/', '_', $file->getClientOriginalName());
            $filename = $name . '_' . now()->format('Ymd_His') . '.' . $extension;

            // Store the file
            $path = $file->storeAs("public/{$folder_path}", $filename);

            // Return public path
            return str_replace('public/', 'storage/', $path);
        }

        return $existing_path; // return old path if no new file is uploaded
    }

    protected function deleteFile($path)
    {
        if (Storage::exists(str_replace('storage/', 'public/', $path))) {
            Storage::delete(str_replace('storage/', 'public/', $path));
        }
    }

    protected function convertIsoStringToDate($iso_string)
    {
        $date = Carbon::parse($iso_string);
        return $date->toDateString();
    }
}
