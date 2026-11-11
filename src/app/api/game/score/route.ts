import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, sanitizeUser } from "@/lib/customerAuth";
import { readStore, writeStore } from "@/lib/store";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  const user = await getCurrentUser();
  const store = readStore();

  const leaderboard = [...store.users]
    .filter((u) => u.gameHighScore > 0)
    .sort((a, b) => b.gameHighScore - a.gameHighScore)
    .slice(0, 10)
    .map((u, idx) => ({
      rank: idx + 1,
      id: u.id,
      name: u.fullName || u.email.split("@")[0],
      highScore: u.gameHighScore,
      totalRuns: u.totalRuns,
    }));

  return NextResponse.json({
    user: user ? sanitizeUser(user) : null,
    leaderboard,
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Sign in to save your Fox Runner score and earn Crunch Points." },
      { status: 401 }
    );
  }

  try {
    const body = (await req.json()) as { distance?: number };
    const distance = Math.max(0, Math.min(50000, Math.floor(Number(body.distance) || 0)));

    // 1 Crunch Point per 25m run, capped at 100 pts per run
    const pointsEarned = Math.min(100, Math.floor(distance / 25));

    const store = readStore();
    const idx = store.users.findIndex((u) => u.id === user.id);
    if (idx === -1) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const current = store.users[idx];
    const isNewBest = distance > current.gameHighScore;
    const updatedUser = {
      ...current,
      gameHighScore: Math.max(current.gameHighScore, distance),
      totalRuns: current.totalRuns + 1,
      totalDistance: current.totalDistance + distance,
      loyaltyPoints: current.loyaltyPoints + pointsEarned,
      updatedAt: new Date().toISOString(),
    };

    store.users[idx] = updatedUser;
    store.gameRuns = [
      {
        id: `run_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        userId: updatedUser.id,
        userName: updatedUser.fullName || updatedUser.email.split("@")[0],
        distance,
        pointsEarned,
        createdAt: new Date().toISOString(),
      },
      ...(store.gameRuns || []),
    ].slice(0, 200);

    if (updatedUser.phone) {
      store.loyalty[updatedUser.phone] = {
        mobile_number: updatedUser.phone,
        available_points: updatedUser.loyaltyPoints,
        blocked: store.loyalty[updatedUser.phone]?.blocked || {},
      };
    }

    writeStore(store);

    if (isSupabaseConfigured()) {
      const sbAdmin = getSupabaseAdmin();
      if (sbAdmin) {
        await sbAdmin
          .from("profiles")
          .update({
            game_high_score: updatedUser.gameHighScore,
            total_runs: updatedUser.totalRuns,
            total_distance: updatedUser.totalDistance,
            loyalty_points: updatedUser.loyaltyPoints,
            updated_at: updatedUser.updatedAt,
          })
          .eq("id", updatedUser.id);

        await sbAdmin.from("game_runs").insert({
          user_id: updatedUser.id,
          distance,
          points_earned: pointsEarned,
        });
      }
    }

    const leaderboard = [...store.users]
      .filter((u) => u.gameHighScore > 0)
      .sort((a, b) => b.gameHighScore - a.gameHighScore)
      .slice(0, 10)
      .map((u, idxRank) => ({
        rank: idxRank + 1,
        id: u.id,
        name: u.fullName || u.email.split("@")[0],
        highScore: u.gameHighScore,
        totalRuns: u.totalRuns,
      }));

    return NextResponse.json({
      ok: true,
      distance,
      pointsEarned,
      isNewBest,
      user: sanitizeUser(updatedUser),
      leaderboard,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed saving score." },
      { status: 500 }
    );
  }
}
