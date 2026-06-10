import {invoke} from "@tauri-apps/api/core";
import {
    Arby,
    arbyFromJson,
    SpIncursion,
    spIncursionsFromJson,
    BountyCycle,
    bountyCycleFromJson,
} from "@/types/wf-state";

export async function fetchArby(): Promise<Arby>{
    const raw = await invoke<unknown>("get_arby");
    return arbyFromJson( raw);
}

export async function fetchSpIncursions(): Promise<SpIncursion[]>{
    const raw = await invoke<unknown>("get_sp_incursions");
    return spIncursionsFromJson(raw);
}

export async function fetchBountyCycle(): Promise<BountyCycle>{
    const raw = await invoke<unknown>("get_bounty_cycle");
    return bountyCycleFromJson(raw);
}