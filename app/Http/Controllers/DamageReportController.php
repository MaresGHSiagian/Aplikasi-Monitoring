<?php

namespace App\Http\Controllers;

use App\Models\DamageReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DamageReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Hanya yang memiliki akses damage reports yang bisa akses
        if (!auth()->user()->canAddDamageReports()) {
            abort(403, 'Anda tidak memiliki akses untuk melihat daftar kerusakan.');
        }

        $query = DamageReport::query();

        // Filter berdasarkan stasiun jika ada
        if ($request->filled('stasiun')) {
            $query->where('stasiun', $request->stasiun);
        }

        // Search berdasarkan nomor atau keterangan kerusakan
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('no', 'like', "%{$search}%")
                  ->orWhere('keterangan_kerusakan', 'like', "%{$search}%")
                  ->orWhere('catatan', 'like', "%{$search}%");
            });
        }

        $damageReports = $query->orderBy('created_at', 'desc')
                              ->paginate(10)
                              ->withQueryString();

        // Format data untuk frontend
        $formattedReports = $damageReports->map(function ($report) {
            return [
                'id' => $report->id,
                'no' => $report->no,
                'stasiun' => $report->stasiun,
                'formatted_stasiun' => $report->formatted_stasiun,
                'keterangan_kerusakan' => $report->keterangan_kerusakan,
                'catatan' => $report->catatan,
                'gambar' => $report->gambar ? asset('storage/' . $report->gambar) : null,
                'created_at' => $report->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $report->updated_at->format('Y-m-d H:i:s'),
            ];
        });

        return Inertia::render('DamageReports/Index', [
            'damageReports' => [
                'data' => $formattedReports,
                'current_page' => $damageReports->currentPage(),
                'last_page' => $damageReports->lastPage(),
                'per_page' => $damageReports->perPage(),
                'total' => $damageReports->total(),
                'from' => $damageReports->firstItem(),
                'to' => $damageReports->lastItem(),
            ],
            'pagination' => [
                'current_page' => $damageReports->currentPage(),
                'last_page' => $damageReports->lastPage(),
                'per_page' => $damageReports->perPage(),
                'total' => $damageReports->total(),
                'from' => $damageReports->firstItem(),
                'to' => $damageReports->lastItem(),
            ],
            'filters' => [
                'stasiun' => $request->stasiun,
                'search' => $request->search,
            ],
            'stations' => DamageReport::getStations(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Hanya yang memiliki akses damage reports yang bisa create
        if (!auth()->user()->canAddDamageReports()) {
            abort(403, 'Anda tidak memiliki akses untuk menambah laporan kerusakan.');
        }

        return Inertia::render('DamageReports/Create', [
            'stations' => DamageReport::getStations(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Hanya yang memiliki akses damage reports yang bisa store
        if (!auth()->user()->canAddDamageReports()) {
            abort(403, 'Anda tidak memiliki akses untuk menambah laporan kerusakan.');
        }

        $request->validate([
            'no' => 'required|string|max:255|unique:damage_reports',
            'stasiun' => 'required|in:' . implode(',', array_keys(DamageReport::getStations())),
            'keterangan_kerusakan' => 'required|string',
            'catatan' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ], [
            'no.required' => 'Nomor laporan wajib diisi.',
            'no.unique' => 'Nomor laporan sudah digunakan.',
            'stasiun.required' => 'Stasiun wajib dipilih.',
            'stasiun.in' => 'Stasiun yang dipilih tidak valid.',
            'keterangan_kerusakan.required' => 'Keterangan kerusakan wajib diisi.',
            'gambar.image' => 'File harus berupa gambar.',
            'gambar.mimes' => 'Format gambar harus jpeg, png, atau jpg.',
            'gambar.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        $data = $request->only(['no', 'stasiun', 'keterangan_kerusakan', 'catatan']);

        // Upload gambar jika ada
        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('damage-reports', 'public');
        }

        DamageReport::create($data);

        return redirect()->route('damage-reports.index')
                        ->with('success', 'Laporan kerusakan berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(DamageReport $damageReport)
    {
        // Hanya yang memiliki akses damage reports yang bisa view detail
        if (!auth()->user()->canAddDamageReports()) {
            abort(403, 'Anda tidak memiliki akses untuk melihat detail laporan kerusakan.');
        }

        return Inertia::render('DamageReports/Show', [
            'damageReport' => [
                'id' => $damageReport->id,
                'no' => $damageReport->no,
                'stasiun' => $damageReport->stasiun,
                'formatted_stasiun' => $damageReport->formatted_stasiun,
                'keterangan_kerusakan' => $damageReport->keterangan_kerusakan,
                'catatan' => $damageReport->catatan,
                'gambar' => $damageReport->gambar ? asset('storage/' . $damageReport->gambar) : null,
                'created_at' => $damageReport->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $damageReport->updated_at->format('Y-m-d H:i:s'),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DamageReport $damageReport)
    {
        // Hanya yang memiliki akses damage reports yang bisa edit
        if (!auth()->user()->canAddDamageReports()) {
            abort(403, 'Anda tidak memiliki akses untuk mengedit laporan kerusakan.');
        }

        return Inertia::render('DamageReports/Edit', [
            'damageReport' => [
                'id' => $damageReport->id,
                'no' => $damageReport->no,
                'stasiun' => $damageReport->stasiun,
                'formatted_stasiun' => $damageReport->formatted_stasiun,
                'keterangan_kerusakan' => $damageReport->keterangan_kerusakan,
                'catatan' => $damageReport->catatan,
                'gambar' => $damageReport->gambar ? asset('storage/' . $damageReport->gambar) : null,
            ],
            'stations' => DamageReport::getStations(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DamageReport $damageReport)
    {
        // Hanya yang memiliki akses damage reports yang bisa update
        if (!auth()->user()->canAddDamageReports()) {
            abort(403, 'Anda tidak memiliki akses untuk mengedit laporan kerusakan.');
        }

        $request->validate([
            'no' => 'required|string|max:255|unique:damage_reports,no,' . $damageReport->id,
            'stasiun' => 'required|in:' . implode(',', array_keys(DamageReport::getStations())),
            'keterangan_kerusakan' => 'required|string',
            'catatan' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ], [
            'no.required' => 'Nomor laporan wajib diisi.',
            'no.unique' => 'Nomor laporan sudah digunakan.',
            'stasiun.required' => 'Stasiun wajib dipilih.',
            'stasiun.in' => 'Stasiun yang dipilih tidak valid.',
            'keterangan_kerusakan.required' => 'Keterangan kerusakan wajib diisi.',
            'gambar.image' => 'File harus berupa gambar.',
            'gambar.mimes' => 'Format gambar harus jpeg, png, atau jpg.',
            'gambar.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        $data = $request->only(['no', 'stasiun', 'keterangan_kerusakan', 'catatan']);

        // Upload gambar baru jika ada
        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika ada
            if ($damageReport->gambar && Storage::disk('public')->exists($damageReport->gambar)) {
                Storage::disk('public')->delete($damageReport->gambar);
            }
            
            $data['gambar'] = $request->file('gambar')->store('damage-reports', 'public');
        }

        $damageReport->update($data);

        return redirect()->route('damage-reports.index')
                        ->with('success', 'Laporan kerusakan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DamageReport $damageReport)
    {
        // Hanya yang memiliki akses damage reports yang bisa delete
        if (!auth()->user()->canAddDamageReports()) {
            abort(403, 'Anda tidak memiliki akses untuk menghapus laporan kerusakan.');
        }

        // Hapus gambar jika ada
        if ($damageReport->gambar && Storage::disk('public')->exists($damageReport->gambar)) {
            Storage::disk('public')->delete($damageReport->gambar);
        }

        $damageReport->delete();

        return redirect()->route('damage-reports.index')
                        ->with('success', 'Laporan kerusakan berhasil dihapus.');
    }
}
