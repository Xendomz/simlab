<?php

use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BahanLaboratoriumController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\LaboratoryEquipmentController;
use App\Http\Controllers\Api\LaboratoryMaterialController;
use App\Http\Controllers\Api\LaboratoryRoomController;
use App\Http\Controllers\Api\MajorController;
use App\Http\Controllers\Api\PracticumController;
use App\Http\Controllers\Api\PracticumModuleController;
use App\Http\Controllers\Api\PracticumSchedulingController;
use App\Http\Controllers\Api\StudyProgramController;
use App\Http\Controllers\Api\TestingTypeController;
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
    Route::get('/study-programs', [StudyProgramController::class, 'getPublicStudyProgramData']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::resource('laboratory-rooms', LaboratoryRoomController::class)->only(['index']);
    Route::resource('laboratory-materials', LaboratoryMaterialController::class)->only(['index']);
    Route::resource('laboratory-equipments', LaboratoryEquipmentController::class)->only(['index']);
    Route::resource('practicums', PracticumController::class)->only(['index']);

    Route::middleware(['role:admin|laboran|kepala_lab_terpadu'])->group(function () {
        Route::resource('users', UserController::class)->only(['index']);
    });
    Route::middleware(['role:admin|laboran|kepala_lab_terpadu|kepala_lab_jurusan|dosen|mahasiswa'])->group(function () {
        Route::get('/practicums/select', [PracticumController::class, 'getDataForSelect']);
        Route::get('/laboratory-rooms/select', [LaboratoryRoomController::class, 'getDataForSelect']);
        Route::get('/users/select', [UserController::class, 'getDataForSelect']);
    });
    Route::middleware(['role:admin|laboran'])->group(function () {
        // Academic Year Route
        Route::put('/academic-years/{id}/toggle-status', [AcademicYearController::class, 'toggleStatus']);
        Route::resource('academic-years', AcademicYearController::class);

        // Faculty Route
        Route::get('/faculties/select', [FacultyController::class, 'getDataForSelect']);
        Route::resource('faculties', FacultyController::class);

        // Major Route
        Route::get('/majors/select', [MajorController::class, 'getDataForSelect']);
        Route::resource('majors', MajorController::class);

        // Testing Type Route
        Route::resource('testing-types', TestingTypeController::class);

        // Study Program Route
        Route::get('/study-programs/select', [StudyProgramController::class, 'getDataForSelect']);
        Route::resource('study-programs', StudyProgramController::class);

        // Practicum
        Route::resource('practicums', PracticumController::class)->except(['index']);

        // Practicum Module
        Route::put('/practicum-modules/{id}/toggle-status', [PracticumModuleController::class, 'toggleStatus']);
        Route::resource('practicum-modules', PracticumModuleController::class);

        Route::resource('laboratory-rooms', LaboratoryRoomController::class)->except(['index']);

        Route::resource('laboratory-equipments', LaboratoryEquipmentController::class)->except(['index']);
        Route::resource('laboratory-materials', LaboratoryMaterialController::class)->except(['index']);

        // User: admin, kepala_lab_terpadu, Koorpro, Kepala Lab Unit, laboran, Dosen, Mahasiswa, External
        Route::put('/users/{user}/restore-dosen', [UserController::class, 'restoreToDosen']);
        Route::resource('users', UserController::class)->except(['index']);
    });


    // booking (peminjaman)
    Route::group(['prefix' => 'bookings', 'as' => 'bookings', 'role:kepala_lab_terpadu|laboran|dosen|mahasiswa|pihak_luar'], function () {
        Route::get('/{id}/detail', [BookingController::class, 'getBookingData']);
        Route::get('/{id}/approvals', [BookingController::class, 'getBookingApprovals']);

        Route::group(['middleware' => 'role:mahasiswa|dosen|pihak_luar'], function () {
            Route::get('/', [BookingController::class, 'index']);
            Route::post('/', [BookingController::class, 'store']);
            Route::get('/have-draft', [BookingController::class, 'isStillHaveDraftBooking']);
            Route::post('/{id}/equipment-material', [BookingController::class, 'storeBookingEquipmentMaterial']);
            Route::post('/{id}/equipment', [BookingController::class, 'storeBookingEquipment']);
        });

        Route::group(['middleware' => 'role:laboran|kepala_lab_terpadu'], function () {
            Route::get('/verification', [BookingController::class, 'getBookingsForVerification']);
            Route::post('/{id}/verify', [BookingController::class, 'verify']);
        });

        Route::group(['middleware' => 'role:laboran'], function () {
            Route::post('/{id}/verify-return', [BookingController::class, 'bookingReturnVerification']);
        });
    });

    // Practical Schedule
    Route::group(['prefix' => 'practicum-schedule', 'as' => 'practicum', 'middleware', 'role:dosen|kepala_lab_jurusan|laboran|kepala_lab_terpadu'], function () {
        Route::get('/{id}/detail', [PracticumSchedulingController::class, 'getPracticumSchedulingData']);
        Route::get('/{id}/steps', [PracticumSchedulingController::class, 'getPracticumSteps']);

        // route based on role: laboran
        Route::group(['middleware' => 'role:dosen'], function () {
            Route::get('/my-classes', [PracticumSchedulingController::class, 'getPracticumSchedulingByLecturer']);
            Route::post('/{id}/set-lecturer-note', [PracticumSchedulingController::class, 'setLecturerNote']);
        });

        // route based on role: laboran
        Route::group(['middleware' => 'role:laboran'], function () {
            Route::post('/{id}/set-session-conducted', [PracticumSchedulingController::class, 'setSessionConducted']);
        });

        // route based on role: kepala_lab_jurusan
        Route::group(['middleware' => 'role:kepala_lab_jurusan'], function () {
            Route::get('/', [PracticumSchedulingController::class, 'index']);
            Route::post('/', [PracticumSchedulingController::class, 'store']);
            Route::post('/{id}/equipment-material', [PracticumSchedulingController::class, 'storePracticumEquipmentMaterial']);
            Route::get('/have-draft', [PracticumSchedulingController::class, 'isStillHaveDraftPracticum']);
        });

        // route based on role: laboran & kepala_lab_jurusan
        Route::group(['middleware' => 'role:kepala_lab_terpadu|laboran'], function () {
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
