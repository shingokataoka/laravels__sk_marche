<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Owner;
use App\Models\Admin;

class OwnersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd( config('app.timezone') );
        $owners = Owner::orderBy('id', 'asc')->paginate(3);
        return Inertia::render('Admin/Owners/Index', compact('owners'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        dd('Admin/OwnersController の ' . __FUNCTION__);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        dd('Admin/OwnersController の ' . __FUNCTION__);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        dd('Admin/OwnersController の ' . __FUNCTION__);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        dd($id);
        dd('Admin/OwnersController の ' . __FUNCTION__);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        dd('Admin/OwnersController の ' . __FUNCTION__);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return 1;
        dd($id);
        dd('Admin/OwnersController の ' . __FUNCTION__);
    }
}
