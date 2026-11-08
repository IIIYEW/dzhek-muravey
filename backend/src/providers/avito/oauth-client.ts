type Credentials = { clientId: string; clientSecret: string };

// Клиент вызывается только на сервере. Токен держим в памяти, в логи не пишем.
// #TODO(Avito): проверить авторизацию с рабочими доступами до включения провайдера.
export class AvitoOAuthClient {
  private token?: { value: string; expiresAt: number };
  private pending?: Promise<string>;
  constructor(
    private credentials: Credentials,
    private transport: typeof fetch = fetch,
  ) {}

  async getToken(now = Date.now()): Promise<string> {
    if (this.token && now < this.token.expiresAt) return this.token.value;
    if (this.pending) return this.pending;
    this.pending = this.requestToken(now);
    try {
      return await this.pending;
    } finally {
      this.pending = undefined;
    }
  }

  private async requestToken(now: number) {
    if (!this.credentials.clientId || !this.credentials.clientSecret)
      throw new Error('Avito credentials are not configured');
    let response: Response;
    try {
      response = await this.transport('https://api.avito.ru/token', {
        method: 'POST',
        redirect: 'error',
        signal: AbortSignal.timeout(10000),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
        }),
      });
    } catch {
      throw new Error('Avito OAuth is unavailable');
    }
    if (!response.ok) throw new Error(`Avito OAuth HTTP ${response.status}`);
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new Error('Invalid OAuth response');
    }
    if (
      !data ||
      typeof data !== 'object' ||
      !('access_token' in data) ||
      typeof data.access_token !== 'string' ||
      !data.access_token ||
      !('expires_in' in data) ||
      typeof data.expires_in !== 'number' ||
      !Number.isFinite(data.expires_in) ||
      data.expires_in <= 0
    )
      throw new Error('OAuth response contains no usable token');
    this.token = {
      value: data.access_token,
      expiresAt: now + Math.max(0, data.expires_in - Math.min(300, data.expires_in / 10)) * 1000,
    };
    return this.token.value;
  }
}
