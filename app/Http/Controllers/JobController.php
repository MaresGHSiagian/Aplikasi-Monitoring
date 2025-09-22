<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = Job::with('user')->latest();
        
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        $jobs = $query->get()->map(function ($job) {
            return [
                'id' => $job->id,
                'nama_pekerjaan' => $job->nama_pekerjaan,
                'mekanik' => $job->mekanik,
                'estimasi_menit' => $job->estimasi_menit,
                'waktu_mulai' => $job->waktu_mulai,
                'status' => $job->status,
                'user' => $job->user,
                'sisa_waktu' => $job->sisa_waktu,
                'persentase_progress' => $job->persentase_progress,
                'created_at' => $job->created_at,
            ];
        });

        // Get statistics for each status
        $stats = [
            'total' => Job::count(),
            'belum_mulai' => Job::where('status', 'Belum Mulai')->count(),
            'proses' => Job::where('status', 'Proses')->count(),
            'selesai' => Job::where('status', 'Selesai')->count(),
            'lewat_waktu' => Job::where('status', 'Lewat Waktu')->count(),
        ];

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs,
            'filters' => $request->only(['status']),
            'stats' => $stats
        ]);
    }

    public function dashboard()
    {
        $jobs = Job::with('user')
            ->whereIn('status', ['Belum Mulai', 'Proses'])
            ->latest()
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'nama_pekerjaan' => $job->nama_pekerjaan,
                    'mekanik' => $job->mekanik,
                    'estimasi_menit' => $job->estimasi_menit,
                    'waktu_mulai' => $job->waktu_mulai,
                    'status' => $job->status,
                    'user' => $job->user,
                    'sisa_waktu' => $job->sisa_waktu,
                    'persentase_progress' => $job->persentase_progress,
                ];
            });

        return Inertia::render('Dashboard', [
            'jobs' => $jobs
        ]);
    }

    public function create()
    {
        // Hanya asisten bengkel yang bisa akses halaman create job karyawan
        if (!auth()->user()->canManageKaryawanJobs()) {
            abort(403, 'Unauthorized');
        }

        // Ambil semua karyawan untuk dropdown
        $mechanics = \App\Models\User::where('role', 'karyawan')->get();

        return Inertia::render('Jobs/Create', [
            'mechanics' => $mechanics
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_pekerjaan' => 'required|string|max:150',
            'mekanik' => 'required|string|max:100',
            'estimasi_menit' => 'required|integer|min:1',
        ]);

        Job::create([
            'nama_pekerjaan' => $request->nama_pekerjaan,
            'mekanik' => $request->mekanik,
            'estimasi_menit' => $request->estimasi_menit,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('jobs.index')->with('message', 'Pekerjaan berhasil ditambahkan.');
    }

    public function updateStatus(Request $request, Job $job)
    {
        $request->validate([
            'status' => 'required|in:Belum Mulai,Proses,Selesai,Lewat Waktu'
        ]);

        $updateData = ['status' => $request->status];

        if ($request->status === 'Proses' && $job->status === 'Belum Mulai') {
            $updateData['waktu_mulai'] = Carbon::now();
        }

        $job->update($updateData);

        return redirect()->back()->with('message', 'Status pekerjaan berhasil diupdate.');
    }

    public function show(Job $job)
    {
        $job->load('user');
        
        return Inertia::render('Jobs/Show', [
            'job' => [
                'id' => $job->id,
                'nama_pekerjaan' => $job->nama_pekerjaan,
                'mekanik' => $job->mekanik,
                'estimasi_menit' => $job->estimasi_menit,
                'waktu_mulai' => $job->waktu_mulai,
                'status' => $job->status,
                'user' => $job->user,
                'sisa_waktu' => $job->sisa_waktu,
                'persentase_progress' => $job->persentase_progress,
                'created_at' => $job->created_at,
                'updated_at' => $job->updated_at,
            ]
        ]);
    }

    public function edit(Job $job)
    {
        return Inertia::render('Jobs/Edit', [
            'job' => [
                'id' => $job->id,
                'nama_pekerjaan' => $job->nama_pekerjaan,
                'mekanik' => $job->mekanik,
                'estimasi_menit' => $job->estimasi_menit,
                'waktu_mulai' => $job->waktu_mulai,
                'status' => $job->status,
                'created_at' => $job->created_at,
                'updated_at' => $job->updated_at,
            ]
        ]);
    }

    public function update(Request $request, Job $job)
    {
        $request->validate([
            'nama_pekerjaan' => 'required|string|max:150',
            'mekanik' => 'required|string|max:100',
            'estimasi_menit' => 'required|integer|min:1',
        ]);

        $job->update([
            'nama_pekerjaan' => $request->nama_pekerjaan,
            'mekanik' => $request->mekanik,
            'estimasi_menit' => $request->estimasi_menit,
        ]);

        return redirect()->route('jobs.index')->with('message', 'Pekerjaan berhasil diupdate.');
    }

    public function destroy(Job $job)
    {
        $job->delete();
        return redirect()->route('jobs.index')->with('message', 'Pekerjaan berhasil dihapus.');
    }

    /**
     * Submit completion by karyawan
     */
    public function submitCompletion(Request $request, Job $job)
    {
        // Hanya karyawan yang bisa submit completion
        if (auth()->user()->role !== 'karyawan') {
            abort(403, 'Unauthorized');
        }

        // Validasi job status
        if (!$job->canBeCompleted() && !$job->canBeResubmitted()) {
            return redirect()->back()->with('error', 'Pekerjaan tidak dapat diselesaikan.');
        }

        $request->validate([
            'completion_note' => 'required|string|min:10',
            'completion_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Upload gambar
        $imagePath = $request->file('completion_image')->store('completion-images', 'public');

        // Submit completion
        $job->submitCompletion(
            $request->completion_note,
            $imagePath,
            auth()->id()
        );

        return redirect()->route('jobs.index')->with('message', 'Pekerjaan berhasil diselesaikan dan menunggu approval.');
    }

    /**
     * Approve completion by management
     */
    public function approveCompletion(Job $job)
    {
        // Hanya management yang bisa approve
        if (!auth()->user()->canApproveJobs()) {
            abort(403, 'Unauthorized');
        }

        if (!$job->isWaitingApproval()) {
            return redirect()->back()->with('error', 'Pekerjaan tidak dalam status menunggu approval.');
        }

        $job->approveCompletion(auth()->id());

        return redirect()->back()->with('message', 'Pekerjaan berhasil di-approve.');
    }

    /**
     * Reject completion by management
     */
    public function rejectCompletion(Request $request, Job $job)
    {
        // Hanya management yang bisa reject
        if (!auth()->user()->canApproveJobs()) {
            abort(403, 'Unauthorized');
        }

        if (!$job->isWaitingApproval()) {
            return redirect()->back()->with('error', 'Pekerjaan tidak dalam status menunggu approval.');
        }

        $request->validate([
            'reject_reason' => 'required|string|min:10',
        ]);

        $job->rejectCompletion($request->reject_reason, auth()->id());

        return redirect()->back()->with('message', 'Pekerjaan di-reject. Karyawan dapat submit ulang.');
    }

    /**
     * Show completion form for karyawan
     */
    public function showCompletionForm(Job $job)
    {
        // Hanya karyawan yang bisa akses
        if (auth()->user()->role !== 'karyawan') {
            abort(403, 'Unauthorized');
        }

        // Cek apakah job bisa diselesaikan atau diresubmit
        if (!$job->canBeCompleted() && !$job->canBeResubmitted()) {
            abort(403, 'Pekerjaan tidak dapat diselesaikan.');
        }

        return Inertia::render('Jobs/Complete', [
            'job' => $job->load(['user', 'completedBy', 'reviewedBy'])
        ]);
    }
}
