<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TeamMemberController;

Route::get('/team-members', [TeamMemberController::class, 'index']);
Route::post('/team-members', [TeamMemberController::class, 'store']);
Route::delete('/team-members/{id}', [TeamMemberController::class, 'destroy']);

Route::post('/send-invitation', function (\Illuminate\Http\Request $request) {
    $email = $request->input('email');
    $name = $request->input('name', 'Membre');
    $projectCode = $request->input('project_code', 'SPRINT-8942');
    $projectName = $request->input('project_name', 'sprint');

    if (!$email) {
        return response()->json(['status' => 'error', 'message' => 'Email requis'], 400);
    }

    try {
        \Illuminate\Support\Facades\Mail::raw(
            "Bonjour {$name},\n\nVous avez été invité(e) par le Manager à rejoindre le projet \"{$projectName}\" sur SprintAI !\n\n🔑 Votre Code d'Équipe (Clef Primaire) : {$projectCode}\n\nRejoignez l'espace de travail sur l'application Web & Mobile PWA :\nhttp://127.0.0.1:5173/\n\nCordialement,\nL'équipe SprintAI",
            function ($message) use ($email, $projectName) {
                $message->to($email)
                        ->subject("🔑 Invitation au Projet \"{$projectName}\" - Code d'Équipe SprintAI");
            }
        );
        return response()->json(['status' => 'success', 'message' => "Email d'invitation envoyé à {$email}"]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'warning', 'message' => "Invitation créée. (SMTP: " . $e->getMessage() . ")"]);
    }
});

