<?php

namespace App\Http\Controllers;

use App\Models\BengkelJob;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class BengkelJobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = BengkelJob::query();
        $statusFilter = $request->get('status');



        // Apply status filter if provided
        if ($statusFilter && $statusFilter !== '') {
            $query->where('status', $statusFilter);
        }

        $jobs = $query->with(['completedBy', 'reviewedBy'])->latest()->get()->map(function ($job) {
            return [
                'id' => $job->id,
                'nama_pekerjaan' => $job->nama_pekerjaan,
                'mekanik' => $job->mekanik,
                'estimasi_menit' => $job->estimasi_menit,
                'waktu_mulai' => $job->waktu_mulai ? $job->waktu_mulai->format('Y-m-d H:i:s') : null,
                'status' => $job->status,
                'remaining_time' => $job->remaining_time,
                'progress_percentage' => $job->progress_percentage,
                'is_overdue' => $job->is_overdue,
                'created_at' => $job->created_at->format('Y-m-d H:i:s'),
                // Data approval untuk UI
                'submitted_at' => $job->submitted_at ? $job->submitted_at->format('Y-m-d H:i:s') : null,
                'completed_by' => $job->completedBy ? $job->completedBy->name : null,
                'reviewed_at' => $job->reviewed_at ? $job->reviewed_at->format('Y-m-d H:i:s') : null,
                'reviewed_by' => $job->reviewedBy ? $job->reviewedBy->name : null,
                // Informasi lewat waktu untuk job yang sudah diapprove
                'is_approved_overdue' => $job->is_approved_overdue,
                'approved_overdue_duration' => $job->approved_overdue_duration,
                'can_be_completed' => $job->canBeCompleted(),
                'can_be_resubmitted' => $job->canBeResubmitted(),
                'is_waiting_approval' => $job->isWaitingApproval(),
            ];
        });

        // Get statistics for each status
        $stats = [
            'total' => BengkelJob::count(),
            'belum_mulai' => BengkelJob::where('status', 'Belum Mulai')->count(),
            'proses' => BengkelJob::where('status', 'Proses')->count(),
            'waiting' => BengkelJob::where('status', 'Waiting')->count(),
            'selesai' => BengkelJob::where('status', 'Selesai')->count(),
            'rejected' => BengkelJob::where('status', 'Rejected')->count(),
            'lewat_waktu' => BengkelJob::where('status', 'Lewat Waktu')->count(),
        ];

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs,
            'filters' => [
                'status' => $statusFilter
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Hanya asisten bengkel yang bisa menambah pekerjaan karyawan
        if (!auth()->user()->canManageKaryawanJobs()) {
            abort(403, 'Hanya asisten bengkel yang dapat menambah pekerjaan karyawan.');
        }

        $mechanics = \App\Models\User::where('role', 'karyawan')
            ->select('id', 'name', 'role')
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                    'label' => $user->name . ' (' . ucfirst($user->role) . ')'
                ];
            });

        return Inertia::render('Jobs/Create', [
            'mechanics' => $mechanics
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Hanya asisten bengkel yang bisa menambah pekerjaan karyawan
        if (!auth()->user()->canManageKaryawanJobs()) {
            abort(403, 'Hanya asisten bengkel yang dapat menambah pekerjaan karyawan.');
        }

        $request->validate([
            'nama_pekerjaan' => 'required|string|max:255',
            'mekanik' => 'required|string|max:255',
            'estimasi_menit' => 'required|integer|min:1',
        ]);

        // Validate that the mechanic name exists in users table
        $mechanicExists = \App\Models\User::where('name', $request->mekanik)->exists();
        if (!$mechanicExists) {
            return back()->withErrors(['mekanik' => 'Nama mekanik yang dipilih tidak valid. Silakan pilih dari daftar yang tersedia.']);
        }

        BengkelJob::create($request->all());

        return redirect()->route('jobs.index')->with('success', 'Pekerjaan berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(BengkelJob $job)
    {
        // Load relationships untuk data approval
        $job->load(['completedBy', 'reviewedBy']);
        
        return Inertia::render('Jobs/Show', [
            'job' => [
                'id' => $job->id,
                'nama_pekerjaan' => $job->nama_pekerjaan,
                'mekanik' => $job->mekanik,
                'estimasi_menit' => $job->estimasi_menit,
                'waktu_mulai' => $job->waktu_mulai ? $job->waktu_mulai->format('Y-m-d H:i:s') : null,
                'status' => $job->status,
                'remaining_time' => $job->remaining_time,
                'progress_percentage' => $job->progress_percentage,
                'is_overdue' => $job->is_overdue,
                'created_at' => $job->created_at->format('Y-m-d H:i:s'),
                // Data approval baru
                'completion_note' => $job->completion_note,
                'completion_image' => $job->completion_image ? asset('storage/' . $job->completion_image) : null,
                'submitted_at' => $job->submitted_at ? $job->submitted_at->format('Y-m-d H:i:s') : null,
                'completed_by' => $job->completedBy ? [
                    'id' => $job->completedBy->id,
                    'name' => $job->completedBy->name,
                    'role' => $job->completedBy->role,
                ] : null,
                'reject_reason' => $job->reject_reason,
                'reviewed_at' => $job->reviewed_at ? $job->reviewed_at->format('Y-m-d H:i:s') : null,
                'reviewed_by' => $job->reviewedBy ? [
                    'id' => $job->reviewedBy->id,
                    'name' => $job->reviewedBy->name,
                    'role' => $job->reviewedBy->role,
                ] : null,
                // Informasi lewat waktu untuk job yang sudah diapprove
                'is_approved_overdue' => $job->is_approved_overdue,
                'approved_overdue_duration' => $job->approved_overdue_duration,
                // Flags untuk UI
                'can_be_completed' => $job->canBeCompleted(),
                'can_be_resubmitted' => $job->canBeResubmitted(),
                'is_waiting_approval' => $job->isWaitingApproval(),
                'can_be_accessed_by_current_user' => auth()->user()->isKaryawan() 
                    ? $job->canBeAccessedByKaryawan(auth()->user()->name) 
                    : true, // Non-karyawan always have access
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BengkelJob $job)
    {
        // Hanya asisten bengkel yang bisa mengedit pekerjaan
        if (!auth()->user()->isAsistenBengkel()) {
            abort(403, 'Hanya asisten bengkel yang dapat mengedit pekerjaan.');
        }

        $mechanics = \App\Models\User::where('role', 'karyawan')
            ->select('id', 'name', 'role')
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                    'label' => $user->name . ' (' . ucfirst($user->role) . ')'
                ];
            });

        return Inertia::render('Jobs/Edit', [
            'job' => $job,
            'mechanics' => $mechanics
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BengkelJob $job)
    {
        // Hanya asisten bengkel yang bisa mengedit pekerjaan
        if (!auth()->user()->isAsistenBengkel()) {
            abort(403, 'Hanya asisten bengkel yang dapat mengedit pekerjaan.');
        }

        $request->validate([
            'nama_pekerjaan' => 'required|string|max:255',
            'mekanik' => 'required|string|max:255',
            'estimasi_menit' => 'required|integer|min:1',
        ]);

        // Validate that the mechanic name exists in users table
        $mechanicExists = \App\Models\User::where('name', $request->mekanik)->exists();
        if (!$mechanicExists) {
            return back()->withErrors(['mekanik' => 'Nama mekanik yang dipilih tidak valid. Silakan pilih dari daftar yang tersedia.']);
        }

        $job->update($request->all());

        return redirect()->route('jobs.index')->with('success', 'Pekerjaan berhasil diupdate!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BengkelJob $job)
    {
        // Hanya asisten bengkel yang bisa menghapus pekerjaan
        if (!auth()->user()->isAsistenBengkel()) {
            abort(403, 'Hanya asisten bengkel yang dapat menghapus pekerjaan.');
        }

        $job->delete();

        return redirect()->route('jobs.index')->with('success', 'Pekerjaan berhasil dihapus!');
    }

    /**
     * Start a job - HANYA ASISTEN BENGKEL YANG BISA MEMULAI PEKERJAAN KARYAWAN
     */
    public function start(BengkelJob $job)
    {
        // Hanya asisten bengkel yang bisa memulai pekerjaan karyawan
        if (!auth()->user()->canManageKaryawanJobs()) {
            abort(403, 'Hanya asisten bengkel yang dapat memulai pekerjaan karyawan.');
        }

        if ($job->status !== 'Belum Mulai') {
            return back()->with('error', 'Tidak dapat memulai pekerjaan! Status saat ini: ' . $job->status . '. Pekerjaan hanya dapat dimulai jika statusnya "Belum Mulai".');
        }

        $job->start();

        return back()->with('success', 'Pekerjaan dimulai!');
    }

    /**
     * Complete a job
     */
    public function complete(BengkelJob $job)
    {
        $user = auth()->user();

        // Jika user adalah asisten bengkel, redirect ke form completion (dengan auto-approve)
        if ($user->isAsistenBengkel()) {
            if ($job->status === 'Selesai') {
                return back()->with('error', 'Pekerjaan ini sudah dalam status "Selesai" dan tidak dapat diubah lagi.');
            }

            if ($job->canBeCompleted() || $job->canBeResubmitted()) {
                return redirect()->route('jobs.complete-form', $job);
            }

            return back()->with('error', 'Pekerjaan tidak dapat diselesaikan. Status saat ini: ' . $job->status);
        }

        // Jika user adalah karyawan, cek apakah ini jobnya dan redirect ke form completion
        if ($user->isKaryawan()) {
            // Cek apakah karyawan bisa mengakses job ini
            if (!$job->canBeAccessedByKaryawan($user->name)) {
                return back()->with('error', 'Akses ditolak! Anda hanya dapat menyelesaikan pekerjaan yang ditugaskan kepada Anda (' . $user->name . '). Pekerjaan ini ditugaskan kepada: ' . $job->mekanik);
            }

            if ($job->canBeCompleted() || $job->canBeResubmitted()) {
                return redirect()->route('jobs.complete-form', $job);
            }
        }

        return back()->with('error', 'Tidak bisa menyelesaikan pekerjaan ini.');
    }

    /**
     * Get dashboard data
     */
    public function dashboard()
    {
        // Update overdue jobs
        $overdueJobs = BengkelJob::where('status', 'Proses')
            ->whereNotNull('waktu_mulai')
            ->get()
            ->filter(function ($job) {
                return $job->is_overdue;
            });

        foreach ($overdueJobs as $job) {
            $job->markAsOverdue();
        }

        // Get active jobs for dashboard based on user role
        $query = BengkelJob::whereIn('status', ['Belum Mulai', 'Proses', 'Lewat Waktu']);
        
        // If user is karyawan, only show their own jobs
        if (auth()->user()->isKaryawan()) {
            $query->where('mekanik', auth()->user()->name);
        }
        
        $jobs = $query->latest()
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'nama_pekerjaan' => $job->nama_pekerjaan,
                    'mekanik' => $job->mekanik,
                    'estimasi_menit' => $job->estimasi_menit,
                    'waktu_mulai' => $job->waktu_mulai ? $job->waktu_mulai->format('Y-m-d H:i:s') : null,
                    'status' => $job->status,
                    'remaining_time' => $job->remaining_time,
                    'progress_percentage' => $job->progress_percentage,
                    'is_overdue' => $job->is_overdue,
                    'created_at' => $job->created_at->format('Y-m-d H:i:s'),
                ];
            });

        // Get recently completed jobs (last 5)
        $completedJobs = BengkelJob::where('status', 'Selesai')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'nama_pekerjaan' => $job->nama_pekerjaan,
                    'mekanik' => $job->mekanik,
                    'estimasi_menit' => $job->estimasi_menit,
                    'waktu_mulai' => $job->waktu_mulai ? $job->waktu_mulai->format('Y-m-d H:i:s') : null,
                    'status' => $job->status,
                    'created_at' => $job->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $job->updated_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Dashboard', [
            'jobs' => $jobs,
            'completedJobs' => $completedJobs,
            'stats' => [
                'total' => BengkelJob::count(),
                'belum_mulai' => BengkelJob::where('status', 'Belum Mulai')->count(),
                'proses' => BengkelJob::where('status', 'Proses')->count(),
                'waiting' => BengkelJob::where('status', 'Waiting')->count(),
                'selesai' => BengkelJob::where('status', 'Selesai')->count(),
                'rejected' => BengkelJob::where('status', 'Rejected')->count(),
                'lewat_waktu' => BengkelJob::where('status', 'Lewat Waktu')->count(),
            ]
        ]);
    }

    /**
     * Get list of mechanics for dropdown
     */
    public function getMechanics(Request $request)
    {
        $search = $request->get('search', '');
        
        $mechanics = \App\Models\User::select('id', 'name', 'role')
            ->where('role', 'karyawan')
            ->when($search, function ($query, $search) {
                return $query->where('name', 'LIKE', '%' . $search . '%');
            })
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                    'label' => $user->name . ' (' . ucfirst($user->role) . ')'
                ];
            });

        return response()->json($mechanics);
    }

    /**
     * Submit completion by karyawan or asisten bengkel
     */
    public function submitCompletion(Request $request, BengkelJob $job)
    {
        $user = auth()->user();

        // Hanya karyawan dan asisten bengkel yang bisa submit completion
        if (!$user->isKaryawan() && !$user->isAsistenBengkel()) {
            abort(403, 'Hanya karyawan dan asisten bengkel yang dapat menyelesaikan pekerjaan.');
        }

        // Cek akses: Asisten bengkel bisa semua job, karyawan hanya job mereka sendiri
        if ($user->isKaryawan() && !$job->canBeAccessedByKaryawan($user->name)) {
            return back()->with('error', 'Akses ditolak! Anda hanya dapat menyelesaikan pekerjaan yang ditugaskan kepada Anda (' . $user->name . '). Pekerjaan ini ditugaskan kepada: ' . $job->mekanik);
        }

        // Validasi job status
        if (!$job->canBeCompleted() && !$job->canBeResubmitted()) {
            return redirect()->back()->with('error', 'Status pekerjaan tidak memungkinkan untuk diselesaikan. Status saat ini: ' . $job->status . '. Pekerjaan hanya dapat diselesaikan jika statusnya "Proses", "Lewat Waktu", atau "Rejected".');
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
            $user->id
        );

        // Jika asisten bengkel yang submit, langsung approve
        if ($user->isAsistenBengkel()) {
            $job->approveCompletion($user->id);
            return redirect()->route('jobs.index')->with('success', 'Pekerjaan berhasil diselesaikan dan langsung di-approve.');
        }

        return redirect()->route('jobs.index')->with('success', 'Pekerjaan berhasil diselesaikan dan menunggu approval.');
    }

    /**
     * Approve completion by management
     */
    public function approveCompletion(BengkelJob $job)
    {
        // Hanya management yang bisa approve
        if (!auth()->user()->canApproveJobs()) {
            abort(403, 'Unauthorized');
        }

        if (!$job->isWaitingApproval()) {
            return redirect()->back()->with('error', 'Pekerjaan tidak dapat di-approve. Status saat ini: ' . $job->status . '. Hanya pekerjaan dengan status "Waiting" yang dapat di-approve.');
        }

        $job->approveCompletion(auth()->id());

        return redirect()->back()->with('message', 'Pekerjaan berhasil di-approve.');
    }

    /**
     * Reject completion by admin
     */
    public function rejectCompletion(Request $request, BengkelJob $job)
    {
        // Hanya management yang bisa reject
        if (!auth()->user()->canApproveJobs()) {
            abort(403, 'Unauthorized');
        }

        if (!$job->isWaitingApproval()) {
            return redirect()->back()->with('error', 'Pekerjaan tidak dapat di-reject. Status saat ini: ' . $job->status . '. Hanya pekerjaan dengan status "Waiting" yang dapat di-reject.');
        }

        $request->validate([
            'reject_reason' => 'required|string|min:10',
        ]);

        $job->rejectCompletion($request->reject_reason, auth()->id());

        return redirect()->back()->with('message', 'Pekerjaan di-reject. Karyawan dapat submit ulang.');
    }

    /**
     * Show completion form for karyawan and admin
     */
    public function showCompletionForm(BengkelJob $job)
    {
        $user = auth()->user();

        // Hanya karyawan dan asisten bengkel yang bisa menyelesaikan pekerjaan
        if (!$user->isKaryawan() && !$user->isAsistenBengkel()) {
            abort(403, 'Hanya karyawan dan asisten bengkel yang dapat menyelesaikan pekerjaan.');
        }

        // Cek akses: Asisten bengkel bisa semua job, karyawan hanya job mereka sendiri
        if ($user->isKaryawan() && !$job->canBeAccessedByKaryawan($user->name)) {
            abort(403, 'Anda tidak dapat menyelesaikan pekerjaan ini. Hanya dapat menyelesaikan pekerjaan Anda sendiri.');
        }

        // Cek apakah job bisa diselesaikan atau diresubmit
        if (!$job->canBeCompleted() && !$job->canBeResubmitted()) {
            abort(403, 'Pekerjaan tidak dapat diselesaikan.');
        }

        return Inertia::render('Jobs/Complete', [
            'job' => $job->load(['completedBy', 'reviewedBy'])
        ]);
    }

    /**
     * Download completion image for a job
     */
    public function downloadCompletionImage(BengkelJob $job)
    {
        // Check if job has completion image
        if (!$job->completion_image) {
            abort(404, 'Image not found');
        }

        // Get the image path from storage
        $imagePath = storage_path('app/public/' . str_replace('/storage/', '', $job->completion_image));
        
        // Check if file exists
        if (!file_exists($imagePath)) {
            abort(404, 'File not found');
        }

        // Get original filename or create a meaningful one
        $filename = 'bukti_pekerjaan_' . $job->id . '_' . basename($imagePath);

        // Return file download response
        return response()->download($imagePath, $filename);
    }
}
