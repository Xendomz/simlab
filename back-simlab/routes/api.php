<?php

use App\Http\Controllers\Api\AlatLaboratoriumController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BahanLaboratoriumController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\JenisPengujianController;
use App\Http\Controllers\Api\JurusanController;
use App\Http\Controllers\Api\PracticumSchedulingController;
use App\Http\Controllers\Api\PraktikumController;
use App\Http\Controllers\Api\ProdiController;
use App\Http\Controllers\Api\RuanganLaboratoriumController;
use App\Http\Controllers\Api\TahunAkademikController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::controller(AuthController::class)->group(function () {
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::get('/user/me', 'getCurrentUser');
});

// Universal Api
Route::prefix('pub')->group(function () {
    Route::get('/study-programs', [ProdiController::class, 'getPublicStudyProgramData']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::resource('laboratory-rooms', RuanganLaboratoriumController::class)->only(['index']);
    Route::resource('laboratory-materials', BahanLaboratoriumController::class)->only(['index']);
    Route::resource('laboratory-equipments', AlatLaboratoriumController::class)->only(['index']);
    Route::resource('practical-works', PraktikumController::class)->only(['index']);

    Route::middleware(['role:Admin|Laboran|Kepala Lab Terpadu'])->group(function () {
        Route::resource('users', UserController::class)->only(['index']);
    });
    Route::middleware(['role:Admin|Laboran'])->group(function () {
        Route::put('/academic-years/{id}/toggle-status', [TahunAkademikController::class, 'toggleStatus']);
        Route::resource('academic-years', TahunAkademikController::class);
        Route::resource('majors', JurusanController::class);
        Route::resource('testing-types', JenisPengujianController::class);
        Route::resource('study-programs', ProdiController::class);
        Route::resource('practical-works', PraktikumController::class)->except(['index']);
        Route::resource('laboratory-rooms', RuanganLaboratoriumController::class)->except(['index']);
        Route::resource('laboratory-equipments', AlatLaboratoriumController::class)->except(['index']);
        Route::resource('laboratory-materials', BahanLaboratoriumController::class)->except(['index']);

        // User: Admin, Kepala Lab Terpadu, Koorpro, Kepala Lab Unit, Laboran, Dosen, Mahasiswa, External
        Route::put('/users/{user}/restore-dosen', [UserController::class, 'restoreToDosen']);
        Route::resource('users', UserController::class)->except(['index']);
    });


    // booking (peminjaman)
    Route::group(['prefix' => 'bookings', 'as' => 'bookings' ], function () {
        Route::get('/', [BookingController::class, 'index']);
        Route::post('/', [BookingController::class, 'store']);
        Route::get('/have-draft', [BookingController::class, 'isStillHaveDraftBooking']);
        Route::get('/{id}/detail', [BookingController::class, 'getBookingData']);
        Route::get('/{id}/steps', [BookingController::class, 'getBookingSteps']);
        Route::post('/{id}/room-n-equipment', [BookingController::class, 'storeBookingRoomNEquipment']);
        Route::post('/{id}/equipment', [BookingController::class, 'storeBookingEquipment']);
        Route::group(['middleware' => 'role:Laboran|Kepala Lab Terpadu'], function () {
            Route::get('/verification', [BookingController::class, 'getBookingsForVerification']);
            Route::post('/{id}/verify', [BookingController::class, 'verify']);
        });
    });

    // Practical Schedule
    Route::get('/practicum-schedule', [PracticumSchedulingController::class, 'index']);
    Route::post('/practicum-schedule', [PracticumSchedulingController::class, 'store']);
    Route::get('/practicum-schedule/{id}/detail', [PracticumSchedulingController::class, 'getPracticumSchedulingData']);
    Route::post('/practicum-schedule/{id}/equipment-n-material', [PracticumSchedulingController::class, 'storePracticumEquipmentNMaterial']);
    Route::get('/practicum-schedule/verification', [PracticumSchedulingController::class, 'getPracticumSchedulingForVerification']);
    Route::post('/practicum-schedule/{id}/verify', [PracticumSchedulingController::class, 'verifyPracticumScheduling']);

    // logout route
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
