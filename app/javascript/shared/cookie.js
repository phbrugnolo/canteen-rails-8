export default class Cookie {
  static get(cookieName) {
    for (const cookieString of document.cookie.split(';')) {
      const [k, v] = cookieString.split('=')
      if (k.trim() === cookieName) {
        return decodeURIComponent(v || '')
      }
    }
    return undefined
  }

  static set(cookieName, value, options = {}) {
    const {
      sameSite = 'Strict',
      days = 365,
      path = '/',
      secure = null
    } = options;

    const validSameSiteValues = ['Strict', 'Lax', 'None'];
    if (!validSameSiteValues.includes(sameSite)) {
      throw new Error(`Invalid SameSite value: ${sameSite}. Valid options are ${validSameSiteValues.join(', ')}.`);
    }

    const d = new Date();
    const expireTime = days * 24 * 60 * 60 * 1000;
    d.setTime(d.getTime() + expireTime);

    const shouldBeSecure = secure !== null
      ? secure
      : (sameSite === 'None' || window.location.protocol === 'https:');

    const secureFlag = shouldBeSecure ? ';Secure' : '';
    const encodedValue = encodeURIComponent(value);

    document.cookie = `${cookieName}=${encodedValue};expires=${d.toUTCString()};path=${path};SameSite=${sameSite}${secureFlag}`;
  }

  static remove(cookieName, path = '/') {
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};`;
  }

  static exists(cookieName) {
    return this.get(cookieName) !== undefined;
  }
}
