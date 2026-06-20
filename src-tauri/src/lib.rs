mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(
            tauri_plugin_stronghold::Builder::new(|p| {
                use sha2::{Digest, Sha256};
                let mut h = Sha256::new();
                h.update(b"doroframe-stronghold-v1");
                h.update(p.as_bytes());
                h.finalize().to_vec()
            })
            .build(),
        )
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .manage(commands::world::WorldHttp::new())
        .manage(commands::browse::BrowseHttp::new())
        .manage(commands::market::MarketHttp::new())
        .manage(commands::auth::AuthHttp::new())
//         .setup(|app| {
//             commands::overlay::start_overlay_ticker(app.handle().clone());
//             Ok(())
//         })
        .invoke_handler(tauri::generate_handler![
            commands::world::get_world_state,
            commands::browse::get_arby,
            commands::browse::get_sp_incursions,
            commands::browse::get_bounty_cycle,
            commands::market::get_market_items,
            commands::market::get_market_orders,
            commands::market::get_orders_recent,
            commands::market::get_orders_top,
            commands::market::get_market_set,
            commands::market::get_riven_weapons,
            commands::market::get_riven_weapon,
            commands::market::get_riven_attributes,
            commands::market::get_lich_weapons,
            commands::market::get_lich_weapon,
            commands::market::get_lich_ephemeras,
            commands::market::get_lich_quirks,
            commands::market::get_sister_weapons,
            commands::market::get_sister_weapon,
            commands::market::get_sister_ephemeras,
            commands::market::get_sister_quirks,
            commands::market::get_auctions,
            commands::market::search_auctions,
            commands::market::create_auction,
            commands::market::get_user_orders,
            commands::market::create_market_order,
            commands::market::edit_market_order,
            commands::market::edit_market_orders_group,
            commands::market::close_market_order,
            commands::market::delete_market_order,
            commands::auth::market_sign_in,
            commands::auth::market_sign_out,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
