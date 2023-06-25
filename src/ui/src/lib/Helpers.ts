
export async function fetchJson<T>(input:RequestInfo|URL, init: RequestInit| undefined = undefined): Promise<T> {
    let response = await fetch(input, init);
    return (await response.json()) as T;
}