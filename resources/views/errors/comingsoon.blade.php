{{-- resources/views/errors/comingsoon.blade.php --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coming Soon | TapheAwards</title>

    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: #fff;
            text-align: center;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            background: rgba(255, 255, 255, 0.1);
            padding: 40px 30px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            animation: fadeIn 1.2s ease-in-out;
        }

        .logo {
            margin-bottom: 20px;
        }

        .logo img {
            height: 80px;
            width: auto;
            border-radius: 50%;
            border: 3px solid #fff;
            padding: 5px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }

        h1 {
            font-size: 2.2rem;
            font-weight: 800;
            margin-bottom: 15px;
        }

        p {
            font-size: 1.1rem;
            margin-bottom: 25px;
            line-height: 1.6;
        }

        .countdown {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 15px;
        }

        .time-box {
            background: rgba(255, 255, 255, 0.15);
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            min-width: 65px;
        }

        footer {
            margin-top: 25px;
            font-size: 0.85rem;
            opacity: 0.85;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Logo -->
        <div class="logo">
            <img src="{{ asset('images/logo.png') }}" alt="TapheAwards Logo">
        </div>

        <h1>Coming Soon</h1>
        <p>
            Our website is currently under construction.<br>
            Stay tuned for something amazing!
        </p>

        <div class="countdown" id="countdown">
            <div class="time-box"><span id="days">00</span><br>Days</div>
            <div class="time-box"><span id="hours">00</span><br>Hours</div>
            <div class="time-box"><span id="minutes">00</span><br>Min</div>
            <div class="time-box"><span id="seconds">00</span><br>Sec</div>
        </div>

        <footer>
            &copy; {{ date('Y') }} TapheAwards. All rights reserved.
        </footer>
    </div>

    <script>
        // Countdown for exactly 24 hours (1 day)
        const targetDate = new Date().getTime() + (24 * 60 * 60 * 1000);

        const countdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                document.getElementById("countdown").innerHTML = "We're Live!";
                return;
            }

            const days = 0; // force days to always show 0
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("days").innerText = days;
            document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
            document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
            document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
        };

        setInterval(countdown, 1000);
    </script>
</body>
</html>
