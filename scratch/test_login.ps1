try {
    $headers = @{
        "Origin" = "https://alpha-jewels-personal-hfw0ly46e-naveens-projects-0a253ad7.vercel.app"
    }

    $response = Invoke-RestMethod -Uri "https://alphajewels-production.up.railway.app/api/users/login" -Method Post -Headers $headers
    Write-Output "SUCCESS:"
    Write-Output ($response | ConvertTo-Json)
} catch {
    Write-Output "ERROR STATUS: "$_.Exception.Response.StatusCode
    $stream = $_.Exception.Response.GetResponseStream()
    if ($stream) {
        $reader = [System.IO.StreamReader]::new($stream)
        Write-Output "ERROR BODY:"
        Write-Output $reader.ReadToEnd()
    } else {
        Write-Output $_.Exception.Message
    }
}
