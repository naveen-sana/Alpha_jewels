$baseUrl = "https://alphajewels-production.up.railway.app"
$origin = "https://alpha-jewels-personal-hfw0ly46e-naveens-projects-0a253ad7.vercel.app"

Write-Output "=== 1. HEALTH CHECK ==="
try {
    $h = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get
    Write-Output "HEALTH: PASSED ($($h.status))"
} catch {
    Write-Output "HEALTH: FAILED ($($_.Exception.Message))"
}

Write-Output "`n=== 2. PRODUCTS LISTING ==="
try {
    $p = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method Get
    Write-Output "PRODUCTS: PASSED ($($p.Count) products returned)"
} catch {
    Write-Output "PRODUCTS: FAILED ($($_.Exception.Message))"
}

Write-Output "`n=== 3. LOGIN & JWT GENERATION ==="
$jwtToken = ""
try {
    $loginBody = '{"email":"naveensana66028@gmail.com","password":"Naveen@0987"}'
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/api/users/login" -Method Post -Headers @{"Origin"=$origin} -ContentType "application/json" -Body $loginBody
    $jwtToken = $loginRes.token
    Write-Output "LOGIN: PASSED (Token Length: $($jwtToken.Length))"
} catch {
    Write-Output "LOGIN: FAILED ($($_.Exception.Message))"
}

Write-Output "`n=== 4. REGISTRATION ==="
try {
    $testEmail = "user_test_" + (Get-Random -Minimum 1000 -Maximum 9999) + "@gmail.com"
    $regBody = '{"email":"' + $testEmail + '","password":"TestUser@123","fullName":"Test User"}'
    $regRes = Invoke-RestMethod -Uri "$baseUrl/api/users/register" -Method Post -Headers @{"Origin"=$origin} -ContentType "application/json" -Body $regBody
    Write-Output "REGISTER: PASSED ($testEmail registered)"
} catch {
    Write-Output "REGISTER: FAILED ($($_.Exception.Message))"
}

Write-Output "`n=== 5. FORGOT PASSWORD ==="
try {
    $forgotBody = '{"email":"naveensana66028@gmail.com"}'
    $forgotRes = Invoke-RestMethod -Uri "$baseUrl/api/users/forgot-password" -Method Post -Headers @{"Origin"=$origin} -ContentType "application/json" -Body $forgotBody
    Write-Output "FORGOT PASSWORD: PASSED"
} catch {
    Write-Output "FORGOT PASSWORD: FAILED ($($_.Exception.Message))"
}

Write-Output "`n=== 6. PROTECTED CART (WITH JWT) ==="
try {
    $headers = @{
        "Origin" = $origin
        "Authorization" = "Bearer $jwtToken"
    }
    $cartRes = Invoke-RestMethod -Uri "$baseUrl/api/cart/items" -Method Get -Headers $headers
    Write-Output "CART: PASSED (Authenticated Request Succeeded)"
} catch {
    Write-Output "CART: FAILED ($($_.Exception.Message))"
}

Write-Output "`n=== 7. PROTECTED WISHLIST (WITH JWT) ==="
try {
    $headers = @{
        "Origin" = $origin
        "Authorization" = "Bearer $jwtToken"
    }
    $wishRes = Invoke-RestMethod -Uri "$baseUrl/api/wishlist" -Method Get -Headers $headers
    Write-Output "WISHLIST: PASSED (Authenticated Request Succeeded)"
} catch {
    Write-Output "WISHLIST: FAILED ($($_.Exception.Message))"
}

Write-Output "`n=== 8. PROTECTED ORDERS (WITH JWT) ==="
try {
    $headers = @{
        "Origin" = $origin
        "Authorization" = "Bearer $jwtToken"
    }
    $orderRes = Invoke-RestMethod -Uri "$baseUrl/api/orders" -Method Get -Headers $headers
    Write-Output "ORDERS: PASSED (Authenticated Request Succeeded)"
} catch {
    Write-Output "ORDERS: FAILED ($($_.Exception.Message))"
}
