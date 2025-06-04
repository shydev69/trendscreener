import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const instaId = searchParams.get("instaId");

  if (!instaId) {
    return NextResponse.json(
      { error: "Missing instaId parameter" },
      { status: 400 }
    );
  }

  // Instagram post URL
  const postUrl = `https://www.instagram.com/p/${instaId}/`;

  // Return HTML with Instagram embed script and height communication
  const html = `
    <html style="width:100%;height:100%;">
      <head>
        <script async src="https://www.instagram.com/embed.js"></script>
        <style>
          html, body {
            width: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          body {
            box-sizing: border-box;
            width: 100vw;
            display: flex;
            align-items: stretch;
            justify-content: stretch;
          }
          .instagram-media {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            display: block !important;
          }
            
        </style>
      </head>
      <body>
        <blockquote class="instagram-media" data-instgrm-permalink="${postUrl}" data-instgrm-version="14"></blockquote>
        <script>
          // Function to send height to parent with specific instaId
          function sendHeight() {
            const media = document.querySelector('.instagram-media-rendered') || document.querySelector('.instagram-media');
            if (media) {
              const height = media.scrollHeight || document.body.scrollHeight || 400;
              console.log('Sending height for ${instaId}:', height);
              // Send message with instaId to identify which iframe this is for
              window.parent.postMessage({ 
                type: 'instagram-height', 
                height: height, 
                instaId: '${instaId}' 
              }, '*');
            } else {
              // Fallback height if no media found
              window.parent.postMessage({ 
                type: 'instagram-height', 
                height: 400, 
                instaId: '${instaId}' 
              }, '*');
            }
          }

          // Observe changes to the DOM for when Instagram renders
          const observer = new MutationObserver(() => {
            const rendered = document.querySelector('.instagram-media-rendered');
            if (rendered) {
              console.log('Instagram media rendered for ${instaId}, sending height');
              setTimeout(sendHeight, 500); // Small delay to ensure full render
              observer.disconnect(); // Stop observing once rendered
            }
          });

          observer.observe(document.body, { childList: true, subtree: true });

          // Process Instagram embed
          window.onload = function() {
            if (window.instgrm) {
              window.instgrm.Embeds.process();
              // Fallback timeout in case MutationObserver doesn't catch it
              setTimeout(sendHeight, 2000);
            } else {
              // If instgrm not available, send fallback height
              setTimeout(sendHeight, 1000);
            }
          };

          // Re-send height on resize
          window.addEventListener('resize', sendHeight);
          
          // Additional fallback - send initial height
          setTimeout(sendHeight, 3000);
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
