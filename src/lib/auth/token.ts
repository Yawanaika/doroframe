/**
 * 登录返回的 JWT 以 set-cookie 字符串形式存储，其中含 cookie 的
 * `Expires=<RFC1123 日期>` 属性（如 `Expires=Wed, 19 Aug 2026 15:35:19 GMT`）。
 * 这里解析出该过期时间（毫秒时间戳），用于本地判断登录是否失效。
 *
 * 返回 null 表示无法确定过期时间（token 为空或缺少 Expires），此时按“不过期”处理，
 * 仍依赖后端在请求时返回 401。
 */
export function parseTokenExpiry(
    token: string | null | undefined,
): number | null {
    if (!token) return null;
    const m = /Expires=([^;]+)/i.exec(token);
    if (!m) return null;
    const ts = Date.parse(m[1].trim());
    return Number.isNaN(ts) ? null : ts;
}
