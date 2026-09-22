<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeamMemberController extends Controller
{
    public function index()
    {
        $members = DB::table('team_members')->get();
        return response()->json($members);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:191',
            'role' => 'required|string|max:191',
            'email' => 'required|email|max:191',
            'avatar' => 'nullable|string',
            'is_owner' => 'nullable|boolean',
        ]);

        $id = DB::table('team_members')->insertGetId([
            'name' => $validated['name'],
            'role' => $validated['role'],
            'email' => $validated['email'],
            'avatar' => $validated['avatar'] ?? '👤',
            'is_owner' => $validated['is_owner'] ?? false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $member = DB::table('team_members')->where('id', $id)->first();
        return response()->json($member, 201);
    }

    public function destroy($id)
    {
        DB::table('team_members')->where('id', $id)->delete();
        return response()->json(['message' => 'Membre supprimé']);
    }
}
