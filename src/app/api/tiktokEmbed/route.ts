import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tiktokId = searchParams.get("tiktokId");

  if (!tiktokId) {
    return NextResponse.json(
      { error: "Missing tiktokId parameter" },
      { status: 400 }
    );
  }

  // Use TikTok Player API with additional parameters
  const playerUrl = `https://www.tiktok.com/player/v1/${tiktokId}?music_info=1&description=1&autoplay=0&controls=1`;

  const html = `
    <html style="width:100%;height:100%;">
      <head>
        <style>
          html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background: black;
            overflow: hidden;
          }
          body {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .tiktok-container {
            width: 100%;
            height: 100%;
            max-width: 605px;
            min-width: 325px;
            position: relative;
            border-radius: 20px;
            overflow: hidden;
          }
          .tiktok-player {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="tiktok-container">
          <iframe
            class="tiktok-player"
            src="${playerUrl}"
            frameBorder="0"
            allowfullscreen
            allow="encrypted-media; autoplay;"
            title="TikTok Video ${tiktokId}"
          ></iframe>
        </div>
        
        <script>
          function sendHeight() {
            const container = document.querySelector('.tiktok-container');
            const player = document.querySelector('.tiktok-player');
            
            // Try to get actual dimensions, fallback to standard
            let height = 600; // Default TikTok height
            
            if (container) {
              const containerHeight = container.offsetHeight || container.scrollHeight;
              if (containerHeight > 100) {
                height = Math.max(containerHeight, 500);
              }
            }
            
            // Ensure minimum height for TikTok content
            height = Math.max(height, 500);
            height = Math.min(height, 800); // Maximum reasonable height
            
            console.log('Sending TikTok height for ${tiktokId}:', height);
            
            window.parent.postMessage({ 
              type: 'tiktok-height', 
              height: height, 
              tiktokId: '${tiktokId}' 
            }, '*');
          }

          // Multiple attempts to get the right height
          window.onload = function() {
            console.log('TikTok player loaded for ${tiktokId}');
            setTimeout(sendHeight, 500);
            setTimeout(sendHeight, 1500);
            setTimeout(sendHeight, 3000);
          };

          // Listen for iframe load events
          const iframe = document.querySelector('.tiktok-player');
          if (iframe) {
            iframe.onload = function() {
              console.log('TikTok iframe loaded for ${tiktokId}');
              setTimeout(sendHeight, 1000);
            };
          }

          // Re-send height on resize
          window.addEventListener('resize', sendHeight);

          // Listen for TikTok player events
          window.addEventListener('message', function(event) {
            if (event.data) {
              const data = event.data;
              if (data.type === 'player_ready' || 
                  data.type === 'video_ready' || 
                  data.type === 'resize' ||
                  data.action === 'video_play') {
                console.log('TikTok player event for ${tiktokId}:', data.type || data.action);
                setTimeout(sendHeight, 500);
              }
            }
          });

          // Final fallback
          setTimeout(sendHeight, 5000);
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
