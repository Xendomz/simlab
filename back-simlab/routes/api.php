<?php

use App\Http\Controllers\Api\AcademicYearController;
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
        Route::put('/academic-years/{id}/toggle-status', [AcademicYearController::class, 'toggleStatus']);
        Route::resource('academic-years', AcademicYearController::class);
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
        Route::group(['middleware' => 'role:Mahasiswa|Dosen|Pihak Luar'], function () {
            Route::get('/', [BookingController::class, 'index']);
            Route::post('/', [BookingController::class, 'store']);
            Route::get('/have-draft', [BookingController::class, 'isStillHaveDraftBooking']);
        });
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
    Route::group(['prefix' => 'practicum-schedule', 'as' => 'practicum', 'middleware', 'role:Dosen|Kepala Lab Terpadu|Laboran|Koorprodi'], function() {
        Route::get('/{id}/detail', [PracticumSchedulingController::class, 'getPracticumSchedulingData']);
        Route::get('/{id}/steps', [PracticumSchedulingController::class, 'getPracticumSteps']);
        Route::group(['middleware' => 'role:Dosen'], function() {
            Route::get('/', [PracticumSchedulingController::class, 'index']);
            Route::post('/', [PracticumSchedulingController::class, 'store']);
            Route::post('/{id}/equipment-n-material', [PracticumSchedulingController::class, 'storePracticumEquipmentNMaterial']);
            Route::get('/have-draft', [PracticumSchedulingController::class, 'isStillHaveDraftPracticum']);
        });
        Route::group(['middleware' => 'role:Kepala Lab Terpadu|Laboran|Koorprodi'], function() {
            Route::get('/verification', [PracticumSchedulingController::class, 'getPracticumSchedulingForVerification']);
            Route::post('/{id}/verify', [PracticumSchedulingController::class, 'verifyPracticumScheduling']);
        });
    });

    // logout route
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
