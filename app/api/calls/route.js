import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

export async function GET(request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const callId = new URL(request.url).searchParams.get("callId");

  if (callId) {
    const { data: call } = await supabase
      .from("calls")
      .select("id, caller_id, callee_id")
      .eq("id", callId)
      .single();

    if (!call) {
      return NextResponse.json({ error: "Call not found." }, { status: 404 });
    }

    if (call.caller_id !== user.id && call.callee_id !== user.id) {
      return NextResponse.json({ error: "You cannot access this call." }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("call_candidates")
      .select("id, sender_id, candidate, created_at")
      .eq("call_id", callId)
      .neq("sender_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Could not load call signals." }, { status: 500 });
    }

    return NextResponse.json({
      candidates: (data || []).map((item) => ({
        id: item.id,
        senderId: item.sender_id,
        candidate: item.candidate,
        createdAt: item.created_at
      }))
    });
  }

  const { data, error } = await supabase
    .from("calls")
    .select("id, caller_id, callee_id, status, offer, answer, created_at, updated_at, caller:caller_id(username), callee:callee_id(username)")
    .or(`caller_id.eq.${user.id},callee_id.eq.${user.id}`)
    .in("status", ["ringing", "accepted"])
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: "Could not load calls." }, { status: 500 });
  }

  const calls = (data || []).map((call) => ({
    id: call.id,
    callerId: call.caller_id,
    calleeId: call.callee_id,
    callerUsername: call.caller?.username || "Unknown",
    calleeUsername: call.callee?.username || "Unknown",
    status: call.status,
    offer: call.offer,
    answer: call.answer,
    createdAt: call.created_at,
    updatedAt: call.updated_at
  }));

  return NextResponse.json({ calls, currentUserId: user.id });
}

export async function POST(request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const action = body?.action;

  if (action === "start") {
    const calleeId = body?.calleeId?.toString();
    const calleeUsername = body?.calleeUsername?.toString().trim();

    if (!calleeId && !calleeUsername) {
      return NextResponse.json({ error: "Invalid call recipient." }, { status: 400 });
    }

    let calleeQuery = supabase.from("profiles").select("id, username");
    if (calleeId) {
      calleeQuery = calleeQuery.eq("id", calleeId);
    } else {
      calleeQuery = calleeQuery.ilike("username", calleeUsername);
    }

    const { data: callee } = await calleeQuery.single();

    if (!callee || callee.id === user.id) {
      return NextResponse.json({ error: "Invalid call recipient." }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("calls")
      .select("id")
      .or(`caller_id.eq.${user.id},callee_id.eq.${user.id}`)
      .in("status", ["ringing", "accepted"])
      .limit(1);

    if (existing?.length) {
      return NextResponse.json({ error: "You already have an active call." }, { status: 409 });
    }

    const { data: targetActive } = await supabase
      .from("calls")
      .select("id")
      .or(`caller_id.eq.${callee.id},callee_id.eq.${callee.id}`)
      .in("status", ["ringing", "accepted"])
      .limit(1);

    if (targetActive?.length) {
      return NextResponse.json({ error: "That user is already on a call." }, { status: 409 });
    }

    const { data: call, error } = await supabase
      .from("calls")
      .insert({
        caller_id: user.id,
        callee_id: callee.id,
        status: "ringing"
      })
      .select("id, caller_id, callee_id, status, created_at, updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "Could not start the call." }, { status: 500 });
    }

    return NextResponse.json({
      call: {
        id: call.id,
        callerId: call.caller_id,
        calleeId: call.callee_id,
        status: call.status,
        createdAt: call.created_at,
        updatedAt: call.updated_at,
        calleeUsername: callee.username
      }
    });
  }

  const callId = body?.callId?.toString();

  if (!callId) {
    return NextResponse.json({ error: "Call ID is required." }, { status: 400 });
  }

  const { data: call } = await supabase
    .from("calls")
    .select("id, caller_id, callee_id, status")
    .eq("id", callId)
    .single();

  if (!call) {
    return NextResponse.json({ error: "Call not found." }, { status: 404 });
  }

  if (call.caller_id !== user.id && call.callee_id !== user.id) {
    return NextResponse.json({ error: "You cannot access this call." }, { status: 403 });
  }

  if (action === "accept") {
    if (call.callee_id !== user.id || call.status !== "ringing") {
      return NextResponse.json({ error: "This call cannot be accepted." }, { status: 400 });
    }

    const { error } = await supabase
      .from("calls")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", callId);

    if (error) {
      return NextResponse.json({ error: "Could not accept the call." }, { status: 500 });
    }

    return NextResponse.json({ success: true, status: "accepted" });
  }

  if (action === "decline" || action === "end") {
    if (call.status === "ended" || call.status === "declined") {
      return NextResponse.json({ success: true, status: call.status });
    }

    const status = action === "decline" ? "declined" : "ended";

    const { error } = await supabase
      .from("calls")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", callId);

    if (error) {
      return NextResponse.json({ error: "Could not update the call." }, { status: 500 });
    }

    return NextResponse.json({ success: true, status });
  }

  if (action === "offer" || action === "answer") {
    const value = body?.value;

    if (!value || call.status !== "accepted") {
      return NextResponse.json({ error: "Call signaling is not ready." }, { status: 400 });
    }

    if (action === "offer" && call.caller_id !== user.id) {
      return NextResponse.json({ error: "Only the caller can send the offer." }, { status: 403 });
    }

    if (action === "answer" && call.callee_id !== user.id) {
      return NextResponse.json({ error: "Only the callee can send the answer." }, { status: 403 });
    }

    const update = action === "offer" ? { offer: value } : { answer: value };

    const { error } = await supabase
      .from("calls")
      .update({ ...update, updated_at: new Date().toISOString() })
      .eq("id", callId);

    if (error) {
      return NextResponse.json({ error: "Could not update call signaling." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  if (action === "candidate") {
    const candidate = body?.value;

    if (!candidate || call.status !== "accepted") {
      return NextResponse.json({ error: "Call signaling is not ready." }, { status: 400 });
    }

    const { error } = await supabase
      .from("call_candidates")
      .insert({
        call_id: callId,
        sender_id: user.id,
        candidate
      });

    if (error) {
      return NextResponse.json({ error: "Could not send call signal." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown call action." }, { status: 400 });
}
