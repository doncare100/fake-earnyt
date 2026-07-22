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

  // 2. Direct browser IP Geolocation lookup fallback
  try {
    const geoRes = await fetch('https://ipapi.co/json/');
    if (geoRes.ok) {
      const geo = await geoRes.json();
      const countryCode = geo.country_code || 'US';
      const isVpn = countryCode === 'US' ? true : Boolean(geo.security?.is_vpn || geo.security?.is_proxy || geo.security?.is_tor);
      
      let status: 'ALLOWED' | 'REGION_NOT_SUPPORTED' | 'VPN_NOT_SUPPORTED' = 'ALLOWED';
      if (countryCode !== 'US') {
        status = 'REGION_NOT_SUPPORTED';
      } else {
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
        isProxy: true,
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

  // 3. Secondary direct client lookup attempt via freeipapi
  try {
    const geoRes2 = await fetch('https://freeipapi.com/api/json');
    if (geoRes2.ok) {
      const geo2 = await geoRes2.json();
      const countryCode = geo2.countryCode || 'US';
      const isVpn = countryCode === 'US' ? true : Boolean(geo2.isProxy);

      let status: 'ALLOWED' | 'REGION_NOT_SUPPORTED' | 'VPN_NOT_SUPPORTED' = 'ALLOWED';
      if (countryCode !== 'US') {
        status = 'REGION_NOT_SUPPORTED';
      } else {
        status = 'VPN_NOT_SUPPORTED';
      }

      const clientInfo: IPInfo = {
        ip: geo2.ipAddress || 'Unknown IP',
        country: geo2.countryName || 'United States',
        countryCode,
        city: geo2.cityName || 'Unknown City',
        region: geo2.regionName || 'Unknown Region',
        isp: 'Internet Provider',
        isVpn,
        isProxy: true,
        isTor: false,
        isDatacenter: false,
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
    isVpn: true,
    isProxy: true,
    isTor: false,
    isDatacenter: false,
    status: 'VPN_NOT_SUPPORTED',
    checkedAt
  };
}
