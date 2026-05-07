$base = "http://localhost:4000/api"

Write-Host "`n===== Phase 7 Endpoint Smoke Test =====" -ForegroundColor Cyan

# --- Auth Login ---
Write-Host "`n[1] POST /api/auth/login" -ForegroundColor Yellow
$loginBody = @{ email = "ceo@pentacrm.com"; password = "password" } | ConvertTo-Json
try {
    $login = Invoke-RestMethod -Uri "$base/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "    OK -> role=$($login.role)  name=$($login.name)  token=$($login.token.Substring(0,20))..." -ForegroundColor Green
} catch { Write-Host "    ERR -> $($_.Exception.Message)" -ForegroundColor Red }

# --- Leads ---
Write-Host "`n[2] GET /api/leads" -ForegroundColor Yellow
try {
    $leads = Invoke-RestMethod -Uri "$base/leads" -Method GET
    Write-Host "    OK -> $($leads.Count) leads returned" -ForegroundColor Green
} catch { Write-Host "    ERR -> $($_.Exception.Message)" -ForegroundColor Red }

Write-Host "`n[3] GET /api/leads/meta" -ForegroundColor Yellow
try {
    $meta = Invoke-RestMethod -Uri "$base/leads/meta" -Method GET
    Write-Host "    OK -> $($meta.Count) meta leads returned" -ForegroundColor Green
} catch { Write-Host "    ERR -> $($_.Exception.Message)" -ForegroundColor Red }

Write-Host "`n[4] GET /api/leads/unassigned" -ForegroundColor Yellow
try {
    $unassigned = Invoke-RestMethod -Uri "$base/leads/unassigned" -Method GET
    Write-Host "    OK -> $($unassigned.Count) unassigned leads" -ForegroundColor Green
} catch { Write-Host "    ERR -> $($_.Exception.Message)" -ForegroundColor Red }

Write-Host "`n[5] GET /api/leads/my/MO" -ForegroundColor Yellow
try {
    $myLeads = Invoke-RestMethod -Uri "$base/leads/my/MO" -Method GET
    Write-Host "    OK -> $($myLeads.Count) leads for MO" -ForegroundColor Green
} catch { Write-Host "    ERR -> $($_.Exception.Message)" -ForegroundColor Red }

Write-Host "`n[6] GET /api/leads/1" -ForegroundColor Yellow
try {
    $lead = Invoke-RestMethod -Uri "$base/leads/1" -Method GET
    Write-Host "    OK -> name=$($lead.name)  status=$($lead.status)" -ForegroundColor Green
} catch { Write-Host "    ERR -> $($_.Exception.Message)" -ForegroundColor Red }

# --- Assign ---
Write-Host "`n[7] POST /api/leads/1/assign" -ForegroundColor Yellow
$assignBody = @{ agentInitials = "FA" } | ConvertTo-Json
try {
    $assigned = Invoke-RestMethod -Uri "$base/leads/1/assign" -Method POST -Body $assignBody -ContentType "application/json"
    Write-Host "    OK -> $($assigned.name) assigned to $($assigned.assigned_agent)  status=$($assigned.status)" -ForegroundColor Green
} catch { Write-Host "    ERR -> $($_.Exception.Message)" -ForegroundColor Red }

# --- Meetings ---
Write-Host "`n[8] POST /api/meetings" -ForegroundColor Yellow
$meetBody = @{ lead_id = 1; lead_name = "Hassan"; agent_initials = "MO"; title = "Discovery Call"; date = "May 10, 2026"; time = "10:00 AM" } | ConvertTo-Json
try {
    $meeting = Invoke-RestMethod -Uri "$base/meetings" -Method POST -Body $meetBody -ContentType "application/json"
    Write-Host "    OK -> id=$($meeting.id)  title=$($meeting.title)  icon=$($meeting.icon)  status=$($meeting.status)" -ForegroundColor Green
} catch { Write-Host "    ERR -> $($_.Exception.Message)" -ForegroundColor Red }

Write-Host "`n[9] GET /api/meetings" -ForegroundColor Yellow
try {
    $meetings = Invoke-RestMethod -Uri "$base/meetings" -Method GET
    Write-Host "    OK -> $($meetings.Count) meetings returned" -ForegroundColor Green
} catch { Write-Host "    ERR -> $($_.Exception.Message)" -ForegroundColor Red }

# --- Agents ---
Write-Host "`n[10] GET /api/agents" -ForegroundColor Yellow
try {
    $agents = Invoke-RestMethod -Uri "$base/agents" -Method GET
    Write-Host "    OK -> $($agents.Count) agents: $(($agents | ForEach-Object { $_.name }) -join ', ')" -ForegroundColor Green
} catch { Write-Host "    ERR -> $($_.Exception.Message)" -ForegroundColor Red }

# --- Stats ---
Write-Host "`n[11] GET /api/stats/ceo" -ForegroundColor Yellow
try {
    $ceo = Invoke-RestMethod -Uri "$base/stats/ceo" -Method GET
    Write-Host "    OK -> total=$($ceo.total)  newLeads=$($ceo.newLeads)  convRate=$($ceo.convRate)%" -ForegroundColor Green
} catch { Write-Host "    ERR -> $($_.Exception.Message)" -ForegroundColor Red }

Write-Host "`n[12] GET /api/stats/manager" -ForegroundColor Yellow
try {
    $mgr = Invoke-RestMethod -Uri "$base/stats/manager" -Method GET
    Write-Host "    OK -> total=$($mgr.total)  teamRows=$($mgr.teamRows.Count)" -ForegroundColor Green
} catch { Write-Host "    ERR -> $($_.Exception.Message)" -ForegroundColor Red }

Write-Host "`n[13] GET /api/stats/employee/MO" -ForegroundColor Yellow
try {
    $emp = Invoke-RestMethod -Uri "$base/stats/employee/MO" -Method GET
    Write-Host "    OK -> newEntries=$($emp.newEntries.total)  inProgress=$($emp.inProgress.total)  qualified=$($emp.qualified.total)" -ForegroundColor Green
} catch { Write-Host "    ERR -> $($_.Exception.Message)" -ForegroundColor Red }

Write-Host "`n===== Done =====" -ForegroundColor Cyan
