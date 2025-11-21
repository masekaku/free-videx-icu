import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🛡️ BLOCK direct access to videos.json - CRITICAL SECURITY!
  if (pathname === '/videos.json' || pathname.endsWith('/videos.json')) {
    return new NextResponse('Not Found', { status: 404 });
  }
  
  const ip = request.ip || request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (!ip) return NextResponse.next();

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    
    // ONLY check VPN/Proxy - Country blocking handled by Cloudflare
    if (data.vpn || data.proxy || data.hosting || data.tor) {
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Access Restricted</title>
            <meta name="viewport" content="width=device-width,initial-scale=1">
          </head>
          <body style="margin:0;padding:0;background:black;color:white;height:100vh;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-family:system-ui,sans-serif;text-align:center;">
            <div>
              <h1 style="font-size:2rem;margin-bottom:1rem;">VPN/Proxy Detected</h1>
              <p>This service is not available through VPN or proxy connections.</p>
              <p style="font-size:0.9rem;margin-top:1rem;color:#ccc;">Country: ${data.country_name || 'Unknown'}</p>
            </div>
          </body>
        </html>
      `, {
        status: 403,
        headers: { 'Content-Type': 'text/html' }
      });
    }
  } catch (e) {
    console.warn('VPN API fail, allow fallback');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]{2,4}).*)',
  ],
};