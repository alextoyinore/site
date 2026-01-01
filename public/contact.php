<?php
// Simple form handler for AADI (cPanel hosting)
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $type = $data['type'] ?? 'inquiry'; // 'volunteer', 'member', 'partner', 'inquiry'
    $messageBody = $data['message'] ?? '';
    $subjectLine = $data['subject'] ?? "New AADI Application: " . ucfirst($type);
    
    // Validate
    if (empty($name) || empty($email)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Name and Email are required"]);
        exit;
    }

    // --- 1. EMAIL NOTIFICATION ---
    $to = "admin@aadi.org"; 
    
    if ($type === 'inquiry') {
        $subject = "Inquiry: " . $subjectLine;
        $email_content = "Name: $name\nEmail: $email\nSubject: $subjectLine\n\nMessage:\n$messageBody";
    } else {
        $subject = "Application: " . ucfirst($type);
        $email_content = "New Application Received:\n\nName: $name\nEmail: $email\nPhone: $phone\nType: $type\n\nMessage:\n$messageBody";
    }

    $headers = "From: no-reply@aadi.org" . "\r\n" .
               "Reply-To: $email" . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    // mail($to, $subject, $email_content, $headers); // Uncomment to enable email

    // --- 2. DATABASE STORAGE ---
    $servername = "localhost";
    $username = "your_db_username"; // UPDATE THIS
    $password = "your_db_password"; // UPDATE THIS
    $dbname = "your_db_name";       // UPDATE THIS

    // Create connection
    // $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    /*
    if ($conn->connect_error) {
        // Log error but don't fail the request to the user if possible, or return 500
        // die("Connection failed: " . $conn->connect_error);
    } else {
        $stmt = $conn->prepare("INSERT INTO onboarding (name, email, phone, type, message) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $name, $email, $phone, $type, $messageBody);
        $stmt->execute();
        $stmt->close();
        $conn->close();
    }
    */

    echo json_encode(["status" => "success", "message" => "Application received successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}
?>
