<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends BaseController
{
    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = User::query()->with('studyProgram');

            if ($request->filter_study_program) {
                $query->where('study_program_id', $request->filter_study_program);
            }

            // Add search functionality
            if ($request->search) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('email', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('identity_num', 'LIKE', "%{$searchTerm}%");
                });
            }

            // get user seected role
            $query->where('role', $request->role);

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $users = $query->paginate($perPage, ['*'], 'page', $page);
            return $this->sendResponse($users, 'Data pengguna berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data pengguna', [$e->getMessage()], 500);
        }
    }

    public function store(UserRequest $request)
    {
        try {
            // Prevent duplicate Kepala Laboratorium Terpadu
            if ($request->role === 'kepala_lab_terpadu') {
                $existing = User::where('role', 'kepala_lab_terpadu')->first();
                if ($existing) {
                    return $this->sendError('Sudah ada user dengan role Kepala Laboratorium Terpadu.', [], 422);
                }
            }

            if ($this->checkIsSingleRoleExist($request->role, $request->study_program_id)) {
                return $this->sendError('Sudah ada user dengan prodi ini di role tersebut.', [], 400);
            }

            $user = User::create($request->validated());

            return $this->sendResponse($user, 'Berhasil menambah data pengguna', 201);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menambah data pengguna', [$e->getMessage()], 500);
        }
    }

    public function update(UserRequest $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $data = $request->validated();

            if (!$request->password) {
                unset($data['password']);
            }

            // Prevent duplicate Kepala Laboratorium Terpadu
            if ($request->role === 'kepala_lab_terpadu') {
                $existing = User::where('role', 'kepala_lab_terpadu')->where('id', '!=', $user->id)->first();
                if ($existing) {
                    return $this->sendError('Sudah ada user dengan role Kepala Laboratorium Terpadu.', [], 422);
                }
            }

            if ($this->checkIsSingleRoleExist($request->role, $request->study_program_id, $user)) {
                return $this->sendError('Sudah ada user dengan prodi ini di role tersebut.', [], 422);
            }

            $user->update($data);

            return $this->sendResponse($user, "Behasil mengubah data pengguna");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Pengguna tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengubah data pengguna', [$e->getMessage()], 500);
        }
    }

    // for checking person have koorprodi & kepala lab is exists
    private function checkIsSingleRoleExist($role, $study_program_id, $selected_user = null)
    {
        if ($role == 'koorprodi' || $role == 'kepala_lab_jurusan') {
            $user = User::where('role', $role)->where('study_program_id', $study_program_id)->first();
            if ($selected_user && $user) {
                return $user->id != $selected_user->id ? true : false;
            }
            return $user ? true : false;
        }

        return false;
    }

    public function restoreToDosen($id)
    {
        try {
            $user = User::findOrFail($id);

            $user->update(['role' => 'dosen']);

            return $this->sendResponse($user, "Berhasil memulihkan role pengguna ke Dosen");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Pengguna tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengubah data pengguna', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return $this->sendResponse([], 'Berhasil menghapus data pengguna');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Pengguna tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menghapus data pengguna', [$e->getMessage()], 500);
        }
    }

    public function getDataForSelect(Request $request)
    {
        try {
            $query = User::query()->select('id', 'name');
            $query->where('role', $request->role);
            $users = $query->get();
            return $this->sendResponse($users, 'Data pengguna berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError("Gagal mengambil data pengguna", [$e->getMessage()], 500);
        }
    }
}
