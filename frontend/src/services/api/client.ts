export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// Относительный /api работает и через Vite proxy, и на общем production-домене.
export async function apiRequest<T>(path: string, signal?: AbortSignal): Promise<T> {
  const timeout = AbortSignal.timeout(12000);
  try {
    const response = await fetch(`/api${path}`, {
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
      headers: { Accept: 'application/json' },
    });
    const data: unknown = await response.json();
    // 503 означает недоступность источника, а не успешно загруженный пустой каталог.
    // 404 также передаём странице, чтобы она показала состояние отсутствующего товара.
    if (!response.ok && response.status !== 503 && response.status !== 404) {
      throw new ApiError(response.status, 'Не удалось загрузить данные');
    }
    return data as T;
  } catch (error) {
    if (signal?.aborted) throw error;
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'Не удалось связаться с сервером. Попробуйте ещё раз.');
  }
}
