$baseUrl = "https://alphajewels-production.up.railway.app"
$origin = "https://alpha-jewels-personal.vercel.app"

function Test-Endpoint {
    param([string]$name, [string]$url, [string]$method = "Get", [hashtable]$headers = @{}, [string]$body = "")
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "TEST: $name" -ForegroundColor Yellow
    Write-Host "URL: $method $url" -ForegroundColor Gray
    try {
        $h = @{"Origin" = $origin}
        foreach ($k in $headers.Keys) { $h[$k] = $headers[$k] }

        if ($body) {
            $res = Invoke-RestMethod -Uri $url -Method $method -Headers $h -ContentType "application/json" -Body $body
        } else {
            $res = Invoke-RestMethod -Uri $url -Method $method -Headers $h
        }
        Write-Host "STATUS: PASSED (HTTP 200 OK)" -ForegroundColor Green
        Write-Host ($res | ConvertTo-Json -Depth 5)
        return $res
    } catch {
        Write-Host "STATUS: FAILED ($($_.Exception.Message))" -ForegroundColor Red
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            if ($stream) {
                $reader = [System.IO.StreamReader]::new($stream)
                Write-Host "RESPONSE BODY:" -ForegroundColor Red
                Write-Host $reader.ReadToEnd()
            }
        }
        return $null
    }
}

Write-Host "STARTING LIVE PRODUCTION VERIFICATION SUITE..." -ForegroundColor Magenta

# 1. Health
$health = Test-Endpoint -name "1. Health Check" -url "$baseUrl/api/health"

# 2. CORS Preflight
Write-Host "================================" -ForegroundColor Cyan
Write-Host "TEST: 2. CORS Preflight OPTIONS" -ForegroundColor Yellow
try {
    $req = [System.Net.HttpWebRequest]::Create("$baseUrl/api/users/login")
    $req.Method = "OPTIONS"
    $req.Headers.Add("Origin", $origin)
    $req.Headers.Add("Access-Control-Request-Method", "POST")
    $req.Headers.Add("Access-Control-Request-Headers", "Content-Type, Authorization")
    $resp = $req.GetResponse()
    $allowOrigin = $resp.Headers["Access-Control-Allow-Origin"]
    $allowCreds = $resp.Headers["Access-Control-Allow-Credentials"]
    Write-Host "STATUS: PASSED" -ForegroundColor Green
    Write-Host "Access-Control-Allow-Origin: $allowOrigin"
    Write-Host "Access-Control-Allow-Credentials: $allowCreds"
    $resp.Close()
} catch {
    Write-Host "STATUS: FAILED ($($_.Exception.Message))" -ForegroundColor Red
}

# 3. Login
$loginObj = @{ email = "naveensana66028@gmail.com"; password = "Naveen@0987" }
$loginRes = Test-Endpoint -name "3. User Login" -url "$baseUrl/api/users/login" -method "Post" -body ($loginObj | ConvertTo-Json)

$jwtToken = ""
if ($loginRes -and $loginRes.token) {
    $jwtToken = $loginRes.token
}

# 4. Register
$randomId = Get-Random -Minimum 10000 -Maximum 99999
$regObj = @{ email = "testuser_$randomId@gmail.com"; password = "User@123456"; fullName = "Production Test User" }
$regRes = Test-Endpoint -name "4. User Registration" -url "$baseUrl/api/users/register" -method "Post" -body ($regObj | ConvertTo-Json)

# 5. Forgot Password
$forgotObj = @{ email = "naveensana66028@gmail.com" }
$forgotRes = Test-Endpoint -name "5. Forgot Password" -url "$baseUrl/api/users/forgot-password" -method "Post" -body ($forgotObj | ConvertTo-Json)

# 6. Reset Password
$resetObj = @{ email = "naveensana66028@gmail.com"; otp = "000000"; newPassword = "Naveen@0987" }
$resetRes = Test-Endpoint -name "6. Reset Password" -url "$baseUrl/api/users/reset-password" -method "Post" -body ($resetObj | ConvertTo-Json)

# 7. Product Listing
$products = Test-Endpoint -name "7. Products Listing" -url "$baseUrl/api/products"

if ($jwtToken) {
    $authHeader = @{ "Authorization" = "Bearer $jwtToken" }
    # 8. Cart
    $cart = Test-Endpoint -name "8. User Cart (Protected)" -url "$baseUrl/api/cart/items" -headers $authHeader
    # 9. Wishlist
    $wishlist = Test-Endpoint -name "9. User Wishlist (Protected)" -url "$baseUrl/api/wishlist" -headers $authHeader
    # 10. Orders
    $orders = Test-Endpoint -name "10. User Orders (Protected)" -url "$baseUrl/api/orders" -headers $authHeader
    # 11. Admin Protected
    $admin = Test-Endpoint -name "11. Admin Dashboard Users (Protected)" -url "$baseUrl/api/admin/users" -headers $authHeader
}

# 12. Security Test: Reject request without JWT on protected endpoint
Write-Host "================================" -ForegroundColor Cyan
Write-Host "TEST: 12. Security Protection Check (No Token)" -ForegroundColor Yellow
try {
    $unauth = Invoke-RestMethod -Uri "$baseUrl/api/cart/items" -Method Get
    Write-Host "STATUS: FAILED (Protected endpoint allowed unauthenticated request!)" -ForegroundColor Red
} catch {
    Write-Host "STATUS: PASSED (Protected endpoint correctly rejected request with status $($_.Exception.Response.StatusCode))" -ForegroundColor Green
}
