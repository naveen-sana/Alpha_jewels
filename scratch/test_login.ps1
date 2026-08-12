try {
    $body = @{
        email = "naveensana66028@gmail.com"
        password = "Naveen@0987"
    } | ConvertTo-Json

    $headers = @{
        "Origin" = "https://alpha-jewels-personal-hfw0ly46e-naveens-projects-0a253ad7.vercel.app"
    }

    $response = Invoke-WebRequest -Uri "https://alphajewels-production.up.railway.app/api/users/login" -Method Post -Headers $headers -ContentType "application/json" -Body $body -UseBasicParsing
    Write-Output "STATUS: "$response.StatusCode
    Write-Output "BODY: "$response.Content
} catch {
    Write-Output "ERROR: "$_.Exception.Message
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        Write-Output "RESPONSE BODY: "$reader.ReadToEnd()
    }
}
