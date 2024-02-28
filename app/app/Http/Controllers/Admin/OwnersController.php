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
use App\Http\Requests\Admin\OwnerUpdateRequest;

class OwnersController extends Controller
{

    // ページネーションでownersを取得のメソッド。（indexとstoreで共通化のため）
    protected function getOwnersToPaginate()
    {
        return Owner::orderBy('id', 'asc')->paginate(3);
    }

    // 特定idのデータが、何ページ目にあるのかを返す。
    protected function getIdToPage($id)
    {
        // 特定idが何番目か取得する。id以下の数をCOUNTでいける。
        $count = Owner::where('id', '<=', $id)->count();
        // 何番目をページ掲載数3で割るとページ数がわかる。
        return (int)ceil($count / 3);
        // return $nowPage;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $owners = $this->getOwnersToPaginate();
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
            session()->flash('status', 'error');
            session()->flash('message', __("Not registered due to an error.\r\n Please try again.") );
            return to_route('admin.owners.index');
        }

        // ownersの最後のページ番号を取得
        // （indexの最後のページにリダイレクトするため）
        $lastPage = $this->getOwnersToPaginate()->lastPage();

        session()->flash('status', 'success');

        session()->flash('message', __("Added owner \":name.\"", ['name' => $request->name]));

        return to_route('admin.owners.index', ['page' => $lastPage]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
       dd(__FUNCTION__);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $owner = Owner::with('shop')->findOrFail($id);
        return Inertia::render('Admin/Owners/Edit', compact('owner'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(OwnerUpdateRequest $request, string $id)
    {
        $owner = Owner::findOrFail($id);
        $owner->name = $request->name;
        $owner->email = $request->email;
        $owner->password = Hash::make($request->password);
        $owner->save();

        $page = $this->getIdToPage($id);

        session()->flash('status', 'success');
        session()->flash('message', __('The owner information for ID ":id" has been updated.', ['id' => $id]));
        return to_route('admin.owners.index', ['page' => $page]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $page = request()->page;

        $owner = Owner::findOrFail($id);
        $ownerName = $owner->name;
        $owner->delete();

        session()->flash('status', 'error');
        session()->flash('message', __("Owner \":name\" has been deleted.", ['name' => $ownerName]));
        return to_route('admin.owners.index', ['page' => $page]);
    }





    public function expiredOwnersIndex ()
    {
        // 期限切れオーナーをページネーションで取得。
        $owners = Owner::onlyTrashed()->orderBy('id', 'asc')->paginate(3);
        return Inertia::render('Admin/Owners/ExpiredOwnersIndex', compact('owners'));
    }


    public function expiredOwnersRestore ($id)
    {
        $page = request()->page;

        $owner = Owner::onlyTrashed()->findOrFail($id);
        $name = $owner->name;
        $owner->restore();

        session()->flash('status', 'success');
        session()->flash('message', __("Owner \":name\" has been restored.", ['name' => $name]) );

        return to_route('admin.expired-owners.index', ['page' => $page]);
    }


    public function expiredOwnersDestroy ($id)
    {
        $page = request()->page;
        $owner = Owner::onlyTrashed()->findOrFail($id);
        try {
            $name = $owner->name;
            $owner->forceDelete();
        } catch (\Exception $e) {
            // 削除に失敗した場合のエラーを表示（外部キー制約で商品があると消せないエラーがでる。）
            session()->flash('status', 'warning');
            session()->flash('message', __('This owner has already released the product. Cannot be deleted.') );
            return to_route('admin.expired-owners.index', ['page' => $page]);
        }

        // 「削除完了」のフラッシュをセット。赤表示なのでstatusはerrorにする。
        session()->flash('status', 'error');
        session()->flash('message', __("Owner \":name\" has been permanently deleted.", ['name' => $name]) );
        return to_route('admin.expired-owners.index', ['page' => $page]);
    }
}
