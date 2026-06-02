import { invoke } from "@tauri-apps/api/core";
import { World, worldFromJson } from "@/types/wf-state";

/**
 * Tauri 入口：调用 Rust 端 `get_world_state` 命令拿到原始 JSON，
 * 在前端边界统一通过 `worldFromJson` 归一化成 `World`。
 *
 * 边界处做一次解析，业务/UI 层永远只面对已规整的 `World`。
 */
export async function fetchWorld(): Promise<World> {
    const raw = await invoke<unknown>("get_world_state");
    return worldFromJson(raw);
}
