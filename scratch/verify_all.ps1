$baseUrl = "https://alphajewels-production.up.railway.app"
$origin = "https://alpha-jewels-personal-hfw0ly46e-naveens-projects-0a253ad7.vercel.app"

function Test-Api {
    param([string]$name, [string]$url, [string]$method = "Get", [hashtable]$headers = @{}, [string]$body = "")
    Write-Output "=== $name ==="
    try {
        $h = @{"Origin" = $origin}
        foreach ($k in $headers.Keys) { $h[$k] = $headers[$k] }

        if ($body) {
            $res = Invoke-RestMethod -Uri $url -Method $method -Headers $h -ContentType "application/json" -Body $body
        } else {
            $res = Invoke-RestMethod -Uri $url -Method $method -Headers $h
        }
        Write-Output "RESULT: PASSED"
        Write-Output ($res | ConvertTo-Json -Depth 5)
        return $res
    } catch {
        Write-Output "RESULT: FAILED ($($_.Exception.Message))"
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            if ($stream) {
                $reader = [System.IO.StreamReader]::new($stream)
                Write-Output "RESPONSE BODY:"
                Write-Output $reader.ReadToEnd()
            }
        }
    }
}

Test-Api -name "1. HEALTH CHECK" -url "$baseUrl/api/health"
Test-Api -name "2. PRODUCTS LISTING" -url "$baseUrl/api/products"

$loginObj = @{ email = "naveensana66028@gmail.com"; password = "Naveen@0987" }
$loginRes = Test-Api -name "3. LOGIN" -url "$baseUrl/api/users/login" -method "Post" -body ($loginObj | ConvertTo-Json)

$jwtToken = ""
if ($loginRes -and $loginRes.token) {
    $jwtToken = $loginRes.token
}

$regObj = @{ email = "user_test_" + (Get-Random) + "@gmail.com"; password = "User@123456"; fullName = "Test User" }
Test-Api -name "4. REGISTER" -url "$baseUrl/api/users/register" -method "Post" -body ($regObj | ConvertTo-Json)

$forgotObj = @{ email = "naveensana66028@gmail.com" }
Test-Api -name "5. FORGOT PASSWORD" -url "$baseUrl/api/users/forgot-password" -method "Post" -body ($forgotObj | ConvertTo-Json)

if ($jwtToken) {
    $authHeader = @{ "Authorization" = "Bearer $jwtToken" }
    Test-Api -name "6. CART" -url "$baseUrl/api/cart/items" -headers $authHeader
    Test-Api -name "7. WISHLIST" -url "$baseUrl/api/wishlist" -headers $authHeader
    Test-Api -name "8. ORDERS" -url "$baseUrl/api/orders" -headers $authHeader
}
