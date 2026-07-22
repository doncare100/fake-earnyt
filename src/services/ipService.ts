import { IPInfo } from '../types';

export async function checkClientIP(): Promise<IPInfo> {
  const checkedAt = new Date().toISOString();

  try {
    // 1. First try server endpoint which inspects request headers
    const res = await fetch('/api/ip-check');
    if (res.ok) {
      const data: IPInfo = await res.json();
      // If server returned a valid public IP evaluation, return it
      if (data.ip && data.ip !== '127.0.0.1' && data.ip !== '::1') {
        return data;
      }
    }
  } catch (err) {
    console.warn("Server IP check endpoint failed, trying direct browser IP lookup", err);
  }

  // 2. Direct browser IP Geolocation lookup fallback (Guarantees user's actual client IP)
  try {
    const geoRes = await fetch('https://ipapi.co/json/');
    if (geoRes.ok) {
      const geo = await geoRes.json();
      const countryCode = geo.country_code || 'US';
      const isVpn = Boolean(geo.security?.is_vpn || geo.security?.is_proxy || geo.security?.is_tor || geo.hosting);
      
      let status: 'ALLOWED' | 'REGION_NOT_SUPPORTED' | 'VPN_NOT_SUPPORTED' = 'ALLOWED';
      if (countryCode !== 'US') {
        status = 'REGION_NOT_SUPPORTED';
      } else if (isVpn) {
        status = 'VPN_NOT_SUPPORTED';
      }

      const clientInfo: IPInfo = {
        ip: geo.ip || 'Unknown IP',
        country: geo.country_name || 'United States',
        countryCode,
        city: geo.city || 'Unknown City',
        region: geo.region || 'Unknown Region',
        isp: geo.org || geo.asn || 'Internet Provider',
        isVpn,
        isProxy: Boolean(geo.security?.is_proxy),
        isTor: Boolean(geo.security?.is_tor),
        isDatacenter: Boolean(geo.hosting),
        status,
        checkedAt
      };

      // Notify server to store in admin log
      fetch('/api/ip-check/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientInfo)
      }).catch(() => {});

      return clientInfo;
    }
  } catch (err) {
    console.warn("Direct IP API lookup failed", err);
  }

  // 3. Secondary direct client lookup attempt via ip-api
  try {
    const geoRes2 = await fetch('http://ip-api.com/json/?fields=status,country,countryCode,regionName,city,isp,org,proxy,hosting,query');
    if (geoRes2.ok) {
      const geo2 = await geoRes2.json();
      if (geo2.status === 'success') {
        const countryCode = geo2.countryCode || 'US';
        const isVpn = Boolean(geo2.proxy || geo2.hosting);

        let status: 'ALLOWED' | 'REGION_NOT_SUPPORTED' | 'VPN_NOT_SUPPORTED' = 'ALLOWED';
        if (countryCode !== 'US') {
          status = 'REGION_NOT_SUPPORTED';
        } else if (isVpn) {
          status = 'VPN_NOT_SUPPORTED';
        }

        const clientInfo: IPInfo = {
          ip: geo2.query || 'Unknown IP',
          country: geo2.country || 'United States',
          countryCode,
          city: geo2.city || 'Unknown City',
          region: geo2.regionName || 'Unknown Region',
          isp: geo2.isp || geo2.org || 'Internet Provider',
          isVpn,
          isProxy: Boolean(geo2.proxy),
          isTor: false,
          isDatacenter: Boolean(geo2.hosting),
          status,
          checkedAt
        };

        // Notify server to store in admin log
        fetch('/api/ip-check/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientInfo)
        }).catch(() => {});

        return clientInfo;
      }
    }
  } catch (err) {
    console.warn("Secondary IP API lookup failed", err);
  }

  // Final fallback if offline or blocked
  return {
    ip: '127.0.0.1',
    country: 'United States',
    countryCode: 'US',
    city: 'New York',
    region: 'New York',
    isp: 'Local ISP',
    isVpn: false,
    isProxy: false,
    isTor: false,
    isDatacenter: false,
    status: 'ALLOWED',
    checkedAt
  };
}
