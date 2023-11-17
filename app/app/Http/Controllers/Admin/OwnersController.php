<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Owner;
use App\Models\Admin;
use App\Models\Shop;
use App\Http\Requests\Admin\OwnerStoreRequest;


class OwnersController extends Controller
{

    // ページネーションでownersを取得のメソッド。（indexとstoreで共通化のため）
    protected function get_owners()
    {
        return Owner::orderBy('id', 'asc')->paginate(3);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $owners = $this->get_owners();
        return Inertia::render('Admin/Owners/Index', compact('owners'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Owners/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OwnerStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            $owner = Owner::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            // shopを作成
            Shop::create([
                'owner_id' => $owner->id,
                'name' => '',
                'information' => '',
                'filename' => '',
                'is_selling' => true,
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            session()->flash('エラーのため登録されませんでした。<br />もう一度やり直してください。');
            return to_route('admin.owners.create');
        }

        // ownersの最後のページ番号を取得
        // （indexの最後のページにリダイレクトするため）
        $lastPage = $this->get_owners()->lastPage();

        session()->flash('status', 'success');
        session()->flash('message', "オーナー「{$request->name}」を追加しました。");
        return to_route('admin.owners.index', ['page' => $lastPage]);
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
